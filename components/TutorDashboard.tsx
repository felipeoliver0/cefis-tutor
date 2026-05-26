"use client";
import { useState, useEffect, useRef } from "react";
import { UserProfile } from "../types/profile";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function TutorDashboard({ profile }: { profile: UserProfile }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false); // Controle de áudio
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const generateInitialPlan = async () => {
      if (messages.length > 0) return;
      
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Para o áudio se o usuário mandar nova mensagem
    if (isSpeaking) handleStopSpeaking();

    const newUserMsg: Message = { role: "user", content: inputValue };
    const newHistory = [...messages, newUserMsg];
    
    setMessages(newHistory);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, history: newHistory }), 
      });
      
      const data = await response.json();
      setMessages([...newHistory, { role: "assistant", content: data.tutorResponse }]);
      if (data.recommendedCourses && data.recommendedCourses.length > 0) {
        setCourses(data.recommendedCourses);
      }
    } catch (err) {
      setMessages([...newHistory, { role: "assistant", content: "Ops, falha na conexão." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ==========================================
  // FUNÇÃO DE LEITURA EM ÁUDIO (MULTIFORMATO)
  // ==========================================
  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Seu navegador não suporta leitura em voz alta.");
      return;
    }

    // Limpa marcações markdown para leitura mais fluida
    const cleanText = text.replace(/[*#]/g, '').replace(/_ /g, '');

    window.speechSynthesis.cancel(); // Para qualquer leitura anterior
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR'; // Força voz em português
    utterance.rate = 1.1; // Velocidade ligeiramente mais rápida
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Limpa o áudio se a pessoa sair da página
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400 font-medium">Diagnosticando lacunas e estruturando plano...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 h-[700px]">
      
      {/* LADO ESQUERDO: CHAT COM A IA */}
      <div className="flex-1 flex flex-col bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl relative">
        
        {/* Aviso de Áudio Tocando */}
        {isSpeaking && (
          <div className="absolute top-0 left-0 right-0 bg-blue-600/90 backdrop-blur-sm px-4 py-2 flex items-center justify-between z-10 animate-fade-in shadow-lg">
            <span className="text-white text-xs font-bold flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1 h-3 bg-white rounded-full animate-[bounce_1s_infinite]"></span>
                <span className="w-1 h-3 bg-white rounded-full animate-[bounce_1s_infinite_0.2s]"></span>
                <span className="w-1 h-3 bg-white rounded-full animate-[bounce_1s_infinite_0.4s]"></span>
              </span>
              Reproduzindo conteúdo em áudio...
            </span>
            <button onClick={handleStopSpeaking} className="text-white bg-black/30 hover:bg-black/50 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer">
              Parar Áudio
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6 pt-12">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[85%] p-5 rounded-2xl ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-slate-800 text-slate-200 rounded-bl-sm"}`}>
                <pre className="whitespace-pre-wrap font-sans leading-relaxed text-[15px]">{msg.content}</pre>
              </div>
              
              {/* Botão de Ouvir Áudio (Só aparece nas respostas da IA) */}
              {msg.role === "assistant" && !isSpeaking && (
                <button 
                  onClick={() => handleSpeak(msg.content)}
                  className="mt-2 text-xs font-bold text-slate-500 hover:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer px-2"
                  title="Reproduzir resposta em formato Podcast/Áudio"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                  Ouvir Resposta
                </button>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start"><div className="bg-slate-800 text-slate-200 p-5 rounded-2xl rounded-bl-sm animate-pulse">Tutor digitando...</div></div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            placeholder="Pergunte ao seu tutor..."
          />
          <button type="submit" disabled={!inputValue.trim() || isTyping} className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 px-6 py-3 rounded-xl font-bold text-white transition-all cursor-pointer">
            Enviar
          </button>
        </form>
      </div>

      {/* LADO DIREITO: CURSOS E VÍDEOS RECOMENDADOS */}
      {courses.length > 0 && (
        <div className="w-full md:w-96 space-y-6 overflow-y-auto max-h-[700px] pr-2 scrollbar-thin scrollbar-thumb-slate-800">
          <h3 className="text-lg font-bold text-white">Materiais Recomendados CEFIS</h3>
          {courses.map((course) => (
            <div key={course.id} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
              
              {course.firstLessonVideo && (
                <div className="relative bg-black group border-b border-slate-800">
                  <video controls className="w-full aspect-video object-contain" crossOrigin="anonymous">
                    <source src={course.firstLessonVideo} type="video/mp4" />
                    {course.subtitlePath && (
                      <track kind="captions" src={`/api/subtitle?path=${encodeURIComponent(course.subtitlePath)}`} srcLang="pt-br" label="Português" default />
                    )}
                  </video>
                  <div className="absolute top-2 right-2 pointer-events-none">
                    {course.subtitlePath && <span className="bg-green-600/90 text-[10px] text-white px-2 py-1 rounded-full font-bold">CC</span>}
                  </div>
                </div>
              )}
              
              <div className="p-4">
                <h4 className="font-bold text-white mb-2 line-clamp-2">{course.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-3">{course.summary}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}