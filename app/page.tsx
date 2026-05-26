// app/page.tsx
"use client";

import { useState } from "react";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 py-8">
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
          O caminho definitivo para o aprendizado acelerado.
        </h1>
        <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-light">
          Defina seu alvo. Nossa IA faz a varredura no catálogo da CEFIS, processa milhares de dados e monta a sua rota estratégica.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Painel do Formulário */}
        <div className="lg:col-span-5 bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-700/50 sticky top-28">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              1
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Parâmetros</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Alvo de Conhecimento <span className="text-blue-500">*</span>
              </label>
              <textarea
                name="goal"
                required
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="Ex: Quero aprender sobre comunicação corporativa para minha próxima promoção..."
                className="w-full p-4 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all bg-slate-950 hover:bg-slate-900 resize-none shadow-inner text-slate-200 placeholder-slate-600"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Nível Operacional
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full p-4 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all bg-slate-950 hover:bg-slate-900 shadow-inner appearance-none cursor-pointer text-slate-200"
              >
                <option value="Iniciante">Iniciante (Boot sequence inicial)</option>
                <option value="Intermediário">Intermediário (Base estabelecida)</option>
                <option value="Avançado">Avançado (Otimização máxima)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  Janela de Tempo
                </label>
                <select
                  name="timeAvailable"
                  value={formData.timeAvailable}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all bg-slate-950 hover:bg-slate-900 shadow-inner appearance-none cursor-pointer text-slate-200 text-sm"
                >
                  <option value="15 minutos por dia">15 min/dia</option>
                  <option value="1 hora por dia">1 hora/dia</option>
                  <option value="Finais de semana">Apenas finais de semana</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  Modo de Input
                </label>
                <select
                  name="learningStyle"
                  value={formData.learningStyle}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all bg-slate-950 hover:bg-slate-900 shadow-inner appearance-none cursor-pointer text-slate-200 text-sm"
                >
                  <option value="Visual (Vídeos, Esquemas)">Visual (UI/Vídeos)</option>
                  <option value="Auditivo (Podcasts)">Auditivo (Voice)</option>
                  <option value="Prático (Mão na massa)">Prático (Execução)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg py-4 px-6 rounded-2xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando Dados...
                </>
              ) : (
                "Inicializar Diagnóstico"
              )}
            </button>
          </form>
        </div>

        {/* Painel de Resposta da IA */}
        <div className="lg:col-span-7 bg-slate-900/40 relative overflow-hidden p-8 rounded-3xl shadow-2xl text-slate-100 flex flex-col h-full min-h-[600px] border border-slate-700/50 backdrop-blur-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-slate-800 border border-slate-600 text-blue-400 w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-inner">
                2
              </div>
              <h2 className="text-2xl font-bold text-slate-100">Terminal Estratégico</h2>
            </div>
            
            {error && (
              <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-5 rounded-2xl mb-4 font-mono text-sm flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {error}
              </div>
            )}

            {!result && !loading && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center px-4">
                <div className="bg-slate-800/30 p-8 rounded-full mb-6 border border-slate-700/30">
                  <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-mono text-slate-400 mb-2">SISTEMA EM STANDBY</h3>
                <p className="max-w-sm text-sm">Aguardando inserção de parâmetros para iniciar a varredura neural no banco da CEFIS.</p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-24 h-24 border-4 border-slate-700 rounded-full"></div>
                  <div className="w-24 h-24 border-4 border-blue-500 rounded-full border-t-transparent animate-spin absolute"></div>
                  <div className="w-16 h-16 border-4 border-purple-500 rounded-full border-b-transparent animate-[spin_1.5s_linear_reverse] absolute"></div>
                </div>
                <h3 className="text-lg font-mono text-blue-400 mt-8 mb-2 animate-pulse">Estabelecendo Conexão RAG...</h3>
                <p className="text-slate-500 text-xs font-mono">Indexando transcrições dos cursos.</p>
              </div>
            )}

            {result && !loading && (
              <div className="prose prose-invert prose-blue max-w-none flex-1 overflow-y-auto pr-4 custom-scrollbar font-sans">
                <div className="bg-slate-950/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-md">
                  <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed bg-transparent p-0 m-0 text-[15px]">
                    {result}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}