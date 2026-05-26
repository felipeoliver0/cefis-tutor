"use client";
import { useState, useEffect, useRef } from "react";
import { UserProfile } from "../types/profile";

// Tipagem para as mensagens do chat
interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function TutorDashboard({ profile }: { profile: UserProfile }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Para o loading das mensagens novas
  const [inputValue, setInputValue] = useState("");
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Rola o chat para baixo automaticamente
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Carregamento Inicial (Gera o plano)
  useEffect(() => {
    const generateInitialPlan = async () => {
      if (messages.length > 0) return; // Só roda na primeira vez
      
      setLoading(true);
      try {
        const response = await fetch("/api/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile), 
        });
        const data = await response.json();
        
        setMessages([{ role: "assistant", content: data.tutorResponse }]);
        setCourses(data.recommendedCourses || []);
      } catch (err) {
        setMessages([{ role: "assistant", content: "Erro ao conectar com a IA." }]);
      } finally {
        setLoading(false);
      }
    };

    generateInitialPlan();
  }, [profile, messages.length]);

  // Função para enviar nova mensagem
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg: Message = { role: "user", content: inputValue };
    const newHistory = [...messages, newUserMsg];
    
    setMessages(newHistory);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviamos o perfil + o histórico de conversa!
        body: JSON.stringify({ ...profile, history: newHistory }), 
      });
      
      const data = await response.json();
      setMessages([...newHistory, { role: "assistant", content: data.tutorResponse }]);
    } catch (err) {
      setMessages([...newHistory, { role: "assistant", content: "Ops, falha na conexão. Tente novamente." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400 font-medium">Analisando dados e criando seu ambiente de estudos...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* LADO ESQUERDO: ÁREA DO CHAT */}
      <div className="flex-1 flex flex-col bg-slate-950 rounded-3xl border border-slate-800 h-[600px] overflow-hidden shadow-xl">
        
        {/* Histórico de Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] p-5 rounded-2xl ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-slate-800 text-slate-200 rounded-bl-sm"}`}>
                <pre className="whitespace-pre-wrap font-sans leading-relaxed text-[15px]">
                  {msg.content}
                </pre>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-200 p-5 rounded-2xl rounded-bl-sm">
                <span className="animate-pulse">Tutor digitando...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} /> {/* Âncora para o scroll automático */}
        </div>

        {/* Input de Digitação */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pergunte ao seu tutor sobre o plano..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={isTyping || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 px-6 py-3 rounded-xl font-bold text-white transition-all"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>

      {/* LADO DIREITO: CURSOS RECOMENDADOS (Mantemos os cards aqui ao lado!) */}
      {courses.length > 0 && (
        <div className="w-full md:w-80 space-y-4">
          <h3 className="text-lg font-bold text-white mb-4">Materiais CEFIS</h3>
          <div className="space-y-4 overflow-y-auto max-h-[550px] pr-2">
            {courses.map((course) => (
              <div key={course.id} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all shadow-lg">
                <img src={course.banner} alt={course.title} className="w-full h-32 object-cover" />
                <div className="p-4">
                  <h4 className="font-bold text-white mb-2 line-clamp-2">{course.title}</h4>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{course.summary}</p>
                  {course.firstLessonVideo && (
                    <a href={course.firstLessonVideo} target="_blank" rel="noreferrer"
                       className="block w-full text-center bg-slate-800 hover:bg-blue-600 py-2 rounded-lg text-sm font-bold text-white transition-colors">
                      Assistir Aula
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}