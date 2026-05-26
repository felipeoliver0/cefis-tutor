// app/page.tsx
"use client";

import { useState } from "react";

interface PlanModule {
  id: string;
  title: string;
  duration: string;
  lessonTitle: string;
  lessonId: number;
  badge: string;
  isCompleted: boolean;
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
  const [modules, setModules] = useState<PlanModule[]>([]);
  const [downloading, setDownloading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLessonCompletion = (id: string) => {
    setModules(prev => 
      prev.map(mod => mod.id === id ? { ...mod, isCompleted: !mod.isCompleted } : mod)
    );
  };

  const handleDownload = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const response = await fetch("/api/download-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: formData.goal,
          experience: formData.experience,
          diagnostic: result,
          modules: modules
        })
      });
      
      if (!response.ok) throw new Error("Erro ao baixar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Plano_Estudos_CEFIS.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setModules([]);

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
      setModules(data.courses || []);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 py-4">
      
      {/* Banner Superior */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-8 md:p-12 rounded-3xl border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase">
            Plataforma AI Tutor V3 // Online
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Aprenda exatamente o que importa.
          </h1>
          <p className="text-slate-300 text-sm md:text-base font-light max-w-xl">
            Nosso motor neural cruza suas necessidades com o acervo da CEFIS para remover lacunas de carreira de forma ágil.
          </p>
        </div>
      </div>

      {/* Grid Central */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Formulário */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl backdrop-blur-md">
          <h2 className="text-lg font-bold tracking-wide text-slate-200 mb-6 flex items-center gap-3">
            <span className="w-2 h-4 bg-blue-500 rounded-full"></span> Parâmetros de Estudo
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Objetivo de Carreira</label>
              <textarea
                name="goal"
                required
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="Ex: Preciso entender comunicação corporativa para liderar reuniões..."
                className="w-full p-4 border border-slate-700 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-slate-950 text-slate-200 text-sm h-24 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Nível Inicial</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full p-4 border border-slate-700 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none bg-slate-950 text-slate-200 text-sm"
              >
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Tempo Diário</label>
                <select
                  name="timeAvailable"
                  value={formData.timeAvailable}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none bg-slate-950 text-slate-200 text-xs"
                >
                  <option value="15 minutos por dia">15 min/dia</option>
                  <option value="1 hora por dia">1 hora/dia</option>
                  <option value="Finais de semana">Fins de semana</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Formato Ideal</label>
                <select
                  name="learningStyle"
                  value={formData.learningStyle}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none bg-slate-950 text-slate-200 text-xs"
                >
                  <option value="Visual">Visual (Vídeos)</option>
                  <option value="Auditivo">Auditivo (Áudios)</option>
                  <option value="Prático">Prático (Execução)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm py-4 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg disabled:opacity-50 flex justify-center items-center gap-2 border border-blue-400/20"
            >
              {loading ? "Calculando Rotas..." : "Mapear Trajetória"}
            </button>
          </form>
        </div>

        {/* Console IA */}
        <div className="lg:col-span-7 bg-slate-900/20 border border-slate-800 p-6 md:p-8 rounded-3xl flex flex-col min-h-[450px] relative backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold tracking-wide text-slate-200 flex items-center gap-3">
              <span className="w-2 h-4 bg-indigo-500 rounded-full"></span> Diagnóstico Neural
            </h2>
            {result && (
              <button 
                onClick={handleDownload}
                disabled={downloading}
                className="text-xs font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all shadow-sm"
              >
                {downloading ? "Baixando..." : "📥 Baixar Plano Oficial"}
              </button>
            )}
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-mono">{error}</div>}

          {!result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 text-center py-12">
              <p className="text-sm font-light">Mapeie seu perfil para carregar as recomendações em tempo real.</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-slate-800 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-mono text-slate-500 tracking-wider uppercase animate-pulse">Varrendo trilhas de conhecimento...</p>
            </div>
          )}

          {result && !loading && (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6">
                <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed text-sm">
                  {result}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vitrine Sincronizada */}
      {result && !loading && modules.length > 0 && (
        <div className="border-t border-slate-800/80 pt-10 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span> Módulos Obrigatórios Sincronizados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <div 
                key={mod.id} 
                className={`border transition-all duration-300 rounded-2xl overflow-hidden flex flex-col shadow-lg relative group ${mod.isCompleted ? 'bg-slate-950/40 border-emerald-500/30 opacity-75' : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/40'}`}
              >
                <div className="p-5 border-b border-slate-800/80 relative bg-gradient-to-br from-slate-900 to-slate-950">
                  <span className="absolute top-4 right-4 text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                    {mod.badge}
                  </span>
                  <h3 className="text-base font-bold text-white line-clamp-1">{mod.title}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">Duração: {mod.duration}</p>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider">AULA SELECIONADA</span>
                    <p className="text-sm font-semibold text-slate-300 line-clamp-2">{mod.lessonTitle}</p>
                    <span className="text-xs font-mono text-slate-600 block">Módulo ID: #{mod.lessonId}[cite: 3]</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleLessonCompletion(mod.id)}
                      className={`flex-1 font-mono text-xs font-bold py-3 px-4 rounded-xl transition-all border ${mod.isCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-slate-900' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
                    >
                      {mod.isCompleted ? "✓ Concluído" : "[ ] Marcar Concluído"}
                    </button>
                    
                    <button 
                      onClick={() => alert(`Acessando player para a aula da CEFIS #${mod.lessonId}`)}
                      className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all"
                      title="Assistir Aula"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}