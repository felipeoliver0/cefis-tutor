// app/page.tsx
"use client";

import { useState } from "react";

// Interface para tipar as recomendações que vamos simular ou extrair da IA
interface RecommendedCourse {
  id: string;
  title: string;
  duration: string;
  lessonTitle: string;
  lessonId: number;
  badge: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    goal: "",
    experience: "Iniciante",
    timeAvailable: "15 minutos por dia",
    learningStyle: "Visual",
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<RecommendedCourse[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setCourses([]);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar dados com a IA.");
      }

      setResult(data.tutorResponse);

      // Injeção de Cursos Reais baseados no acervo local para alimentar o layout da plataforma
      if (formData.goal.toLowerCase().includes("comunica") || formData.goal.toLowerCase().includes("corporativ")) {
        setCourses([
          {
            id: "curso-comunicacao",
            title: "Comunicação Corporativa Eficaz",
            duration: "2h 45min",
            lessonTitle: "Apresentação e Introdução",
            lessonId: 488225,
            badge: "Conteúdo Oficial CEFIS"
          }
        ]);
      } else {
        // Fallback de cursos da plataforma caso a busca seja ampla
        setCourses([
          {
            id: "curso-1",
            title: "Desenvolvimento de Soft Skills",
            duration: "4h 20min",
            lessonTitle: "Comunicação e Alinhamento",
            lessonId: 101,
            badge: "Recomendado"
          },
          {
            id: "curso-2",
            title: "Liderança e Cultura Organizacional",
            duration: "3h 10min",
            lessonTitle: "Cultura do Usuário em 1º Lugar",
            lessonId: 102,
            badge: "Destaque"
          }
        ]);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 py-4 animate-fadeIn">
      
      {/* Top Banner / Hero */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 p-8 md:p-12 rounded-3xl border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase">
            Plataforma de Aprendizado Customizada
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Acelere sua evolução com inteligência.
          </h1>
          <p className="text-slate-300 text-base md:text-lg font-light max-w-2xl">
            Sua trilha não é uma lista estática. É um ecossistema vivo que conecta seus objetivos profissionais ao acervo de conhecimento da CEFIS.
          </p>
        </div>
      </div>

      {/* Main Grid: Form e Resposta */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Formulário (Coluna Esquerda) */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 p-6 md:p-8 rounded-3xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg text-sm">
              01
            </div>
            <h2 className="text-lg font-bold tracking-wide text-slate-200">Definição de Escopo</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                O que você deseja dominar? <span className="text-blue-500">*</span>
              </label>
              <textarea
                name="goal"
                required
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="Ex: Quero aprender sobre comunicação corporativa..."
                className="w-full p-4 border border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-slate-950 text-slate-200 placeholder-slate-600 text-sm h-24 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                Nível Técnico Atual
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full p-4 border border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none bg-slate-950 text-slate-200 text-sm cursor-pointer"
              >
                <option value="Iniciante">Iniciante (Conhecimento zero)</option>
                <option value="Intermediário">Intermediário (Possuo fundamentos)</option>
                <option value="Avançado">Avançado (Busco especialização)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                  Disponibilidade
                </label>
                <select
                  name="timeAvailable"
                  value={formData.timeAvailable}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none bg-slate-950 text-slate-200 text-xs cursor-pointer"
                >
                  <option value="15 minutos por dia">15 min/dia</option>
                  <option value="1 hora por dia">1 hora/dia</option>
                  <option value="Finais de semana">Fins de semana</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                  Estilo de Conteúdo
                </label>
                <select
                  name="learningStyle"
                  value={formData.learningStyle}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none bg-slate-950 text-slate-200 text-xs cursor-pointer"
                >
                  <option value="Visual (Vídeos, Esquemas)">Visual (Vídeos)</option>
                  <option value="Auditivo (Podcasts)">Auditivo (Áudios)</option>
                  <option value="Prático (Mão na massa)">Prático (Execução)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm py-4 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 border border-blue-400/20"
            >
              {loading ? "Processando..." : "Mapear Trajetória"}
            </button>
          </form>
        </div>

        {/* Console / Resposta da IA (Coluna Direita) */}
        <div className="lg:col-span-7 bg-slate-900/20 border border-slate-800/60 p-6 md:p-8 rounded-3xl flex flex-col min-h-[450px] relative overflow-hidden backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-blue-400 text-sm shadow-inner">
              02
            </div>
            <h2 className="text-lg font-bold tracking-wide text-slate-200">Diagnóstico Estratégico</h2>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-mono">{error}</div>}

          {!result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 text-center py-12">
              <p className="text-sm max-w-xs font-light">Insira as diretrizes do seu perfil no console operacional para carregar a IA.</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-mono text-slate-500 tracking-wider uppercase animate-pulse">Varrendo registros CEFIS...</p>
            </div>
          )}

          {result && !loading && (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 shadow-inner">
                <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed text-sm">
                  {result}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Seção da Vitrine da Plataforma de Cursos (Abaixo) */}
      {result && !loading && (
        <div className="border-t border-slate-800/80 pt-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                Seu Ambiente de Aprendizado
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Aulas e módulos sincronizados dinamicamente a partir do repositório da plataforma.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg h-fit">
              {courses.length} MATERIAIS_DISPONÍVEIS
            </span>
          </div>

          {/* Grid de Cards de Cursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col shadow-lg group hover:-translate-y-1"
              >
                {/* Cabeçalho do Card (Simula uma capa/banner com cor de marca) */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 border-b border-slate-800/80 relative">
                  <span className="absolute top-4 right-4 text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                    {course.badge}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3 text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">Duração: {course.duration}</p>
                </div>

                {/* Corpo do Card (Detalhes da próxima aula) */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-5 bg-slate-950/20">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">PRÓXIMA AULA RECOMENDADA</span>
                    <p className="text-sm font-semibold text-slate-300 line-clamp-2">
                      {course.lessonTitle}
                    </p>
                    <span className="text-xs font-mono text-slate-600 block">ID do Módulo: #{course.lessonId}</span>
                  </div>

                  {/* Ação de entrada na aula */}
                  <button 
                    onClick={() => alert(`Iniciando player da aula ID: ${course.lessonId}`)}
                    className="w-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                    Acessar Conteúdo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}