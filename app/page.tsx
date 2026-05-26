// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({ goal: "", experience: "Iniciante", timeAvailable: "15 minutos por dia", learningStyle: "Visual" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [modules, setModules] = useState<PlanModule[]>([]);

  // Guard de Autenticação
  useEffect(() => {
    const token = localStorage.getItem("cefis_token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data.tutorResponse);
      setModules(data.courses || []);
    } catch (err) {
      alert("Erro ao conectar com a IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <header className="bg-gradient-to-r from-slate-900 to-indigo-950 p-8 rounded-3xl border border-indigo-500/20">
          <h1 className="text-4xl font-extrabold text-white">AI Tutor Engine // CEFIS</h1>
          <p className="text-slate-400 mt-2">Mapeamento de carreira inteligente.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl"
                placeholder="Qual seu objetivo?"
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              />
              <button className="w-full bg-blue-600 py-4 rounded-xl font-bold text-white hover:bg-blue-500">
                {loading ? "Processando..." : "Mapear Trajetória"}
              </button>
            </form>
          </section>

          {/* Resultado IA */}
          <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 min-h-[300px]">
            {result ? (
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300">{result}</pre>
            ) : (
              <p className="text-slate-600 italic text-center mt-20">O diagnóstico da IA aparecerá aqui...</p>
            )}
          </section>
        </div>

        {/* Vitrine Sincronizada */}
        {modules.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <div key={mod.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-white">{mod.title}</h3>
                <p className="text-xs text-slate-500">{mod.lessonTitle}</p>
                <button 
                  onClick={() => setModules(prev => prev.map(m => m.id === mod.id ? {...m, isCompleted: !m.isCompleted} : m))}
                  className={`mt-4 w-full py-2 rounded-lg text-xs font-bold ${mod.isCompleted ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800'}`}
                >
                  {mod.isCompleted ? "✓ Concluído" : "Marcar Concluído"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}