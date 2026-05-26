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
        throw new Error(data.error || "Erro desconhecido ao conectar com a IA");
      }

      setResult(data.tutorResponse);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 py-6">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          O caminho mais inteligente para o seu aprendizado.
        </h1>
        <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
          Conte sobre seus objetivos e deixe nossa Inteligência Artificial mapear suas lacunas e estruturar um plano de estudos perfeito usando o acervo da CEFIS.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Painel do Formulário (Esquerda) */}
        <div className="lg:col-span-5 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-slate-200/60 sticky top-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md">
              1
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Seu Perfil</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                O que você quer aprender? <span className="text-red-500">*</span>
              </label>
              <textarea
                name="goal"
                required
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="Ex: Quero dominar o básico de comunicação corporativa para melhorar minhas apresentações..."
                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50 hover:bg-white resize-none shadow-sm text-slate-700"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Qual seu nível atual nesse assunto?
              </label>
              <div className="relative">
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50 hover:bg-white shadow-sm appearance-none cursor-pointer text-slate-700"
                >
                  <option value="Iniciante">Iniciante (Começando do zero)</option>
                  <option value="Intermediário">Intermediário (Já conheço um pouco)</option>
                  <option value="Avançado">Avançado (Busco me aprofundar)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Tempo na rotina
                </label>
                <div className="relative">
                  <select
                    name="timeAvailable"
                    value={formData.timeAvailable}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50 hover:bg-white shadow-sm appearance-none cursor-pointer text-slate-700 text-sm"
                  >
                    <option value="15 minutos por dia">15 min/dia</option>
                    <option value="1 hora por dia">1 hora/dia</option>
                    <option value="Finais de semana">Fins de semana</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Formato Ideal
                </label>
                <div className="relative">
                  <select
                    name="learningStyle"
                    value={formData.learningStyle}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50 hover:bg-white shadow-sm appearance-none cursor-pointer text-slate-700 text-sm"
                  >
                    <option value="Visual (Vídeos, Esquemas)">Visual (Vídeos)</option>
                    <option value="Auditivo (Podcasts)">Auditivo (Áudio)</option>
                    <option value="Prático (Mão na massa)">Prático</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analisando Perfil...
                </>
              ) : (
                "Gerar Plano de Estudos"
              )}
            </button>
          </form>
        </div>

        {/* Painel de Resposta da IA (Direita) */}
        <div className="lg:col-span-7 bg-slate-900 relative overflow-hidden p-8 rounded-3xl shadow-2xl text-slate-100 flex flex-col h-full min-h-[600px] border border-slate-800">
          
          {/* Efeitos de fundo (Glow) */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-slate-800 border border-slate-700 text-blue-400 w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-inner">
                2
              </div>
              <h2 className="text-2xl font-bold text-slate-100">Trilha Inteligente</h2>
            </div>
            
            {error && (
              <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-5 rounded-2xl mb-4 font-medium flex items-center gap-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {error}
              </div>
            )}

            {!result && !loading && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center px-4">
                <div className="bg-slate-800/50 p-6 rounded-full mb-6 border border-slate-700/50">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">Aguardando Dados</h3>
                <p className="max-w-xs">Preencha o formulário ao lado para a IA processar a base de cursos da CEFIS.</p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-slate-700 rounded-full"></div>
                  <div className="w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
                <h3 className="text-xl font-bold text-blue-400 mt-6 mb-2">Buscando na Base de Dados...</h3>
                <p className="text-slate-500 text-sm">Cruzando seu perfil com milhares de transcrições.</p>
              </div>
            )}

            {result && !loading && (
              <div className="prose prose-invert prose-blue max-w-none flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="bg-slate-800/40 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm">
                  <pre className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed bg-transparent p-0 m-0 text-[15px]">
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