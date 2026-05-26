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
    <div className="flex flex-col gap-8">
      
      {/* Título da Página */}
      <div className="text-center max-w-2xl mx-auto mb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
          O caminho mais inteligente para o seu aprendizado.
        </h1>
        <p className="text-slate-600 text-lg">
          Conte sobre seus objetivos e deixe a Inteligência Artificial mapear suas lacunas e estruturar um plano de estudos perfeito para sua rotina.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Painel do Formulário */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
          <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Seu Perfil
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                O que você quer aprender? (Objetivo final)
              </label>
              <textarea
                name="goal"
                required
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="Ex: Quero aprender a criar páginas de conversão de alta performance..."
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Qual seu nível atual nesse assunto?
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
              >
                <option value="Iniciante">Iniciante (Começando do zero)</option>
                <option value="Intermediário">Intermediário (Já conheço um pouco)</option>
                <option value="Avançado">Avançado (Busco me aprofundar)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tempo na rotina
                </label>
                <select
                  name="timeAvailable"
                  value={formData.timeAvailable}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                >
                  <option value="15 minutos por dia">15 min/dia</option>
                  <option value="1 hora por dia">1 hora/dia</option>
                  <option value="Finais de semana">Finais de semana</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Estilo de Aprendizado
                </label>
                <select
                  name="learningStyle"
                  value={formData.learningStyle}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                >
                  <option value="Visual (Vídeos, Esquemas)">Visual</option>
                  <option value="Auditivo (Podcasts, Aulas Narradas)">Auditivo</option>
                  <option value="Prático (Mão na massa)">Prático</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-600 text-white font-bold text-lg py-4 px-4 rounded-xl hover:bg-blue-700 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analisando Perfil...
                </>
              ) : (
                "Gerar Diagnóstico e Plano"
              )}
            </button>
          </form>
        </div>

        {/* Painel de Resposta da IA */}
        <div className="bg-slate-900 p-8 rounded-2xl shadow-xl text-slate-100 flex flex-col h-full min-h-[500px] border border-slate-800">
          <h2 className="text-xl font-bold mb-6 text-blue-400 flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-sm border border-blue-500/30">2</span>
            Plano Estratégico
          </h2>
          
          {error && (
            <div className="bg-red-500/10 text-red-400 border border-red-500/30 p-4 rounded-xl mb-4 font-medium">
              {error}
            </div>
          )}

          {!result && !loading && !error && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center px-4">
              <svg className="w-16 h-16 mb-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p>Aguardando os dados do seu perfil para processar a melhor trilha de estudos usando Inteligência Artificial.</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center animate-pulse">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-6"></div>
              <p className="text-blue-400 font-semibold text-lg">Cruzando dados com a base da CEFIS...</p>
              <p className="text-slate-500 text-sm mt-2">Montando cronograma personalizado.</p>
            </div>
          )}

          {result && !loading && (
            <div className="prose prose-invert prose-blue max-w-none flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <pre className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed bg-transparent p-0 m-0 text-base">
                  {result}
                </pre>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}