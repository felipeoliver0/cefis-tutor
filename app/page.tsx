// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  // Estado dos campos que sumiram
  const [formData, setFormData] = useState({ 
    goal: "", 
    experience: "Iniciante", 
    timeAvailable: "15 min/dia", 
    learningStyle: "Visual" 
  });

  useEffect(() => {
    const token = localStorage.getItem("cefis_token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      setUserEmail(localStorage.getItem("cefis_user_email") || "Usuário");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

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
    } catch (err) {
      alert("Erro ao conectar com a IA.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header com Logout */}
        <header className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <h1 className="text-xl font-bold text-white">AI Tutor Engine // CEFIS</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{userEmail}</span>
            <button onClick={handleLogout} className="text-red-400 text-xs font-bold underline">Sair</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário completo */}
          <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea 
                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl"
                placeholder="Qual o seu objetivo de estudo?"
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
              />
              <select className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl" onChange={(e) => setFormData({...formData, experience: e.target.value})}>
                <option>Iniciante</option>
                <option>Intermediário</option>
                <option>Avançado</option>
              </select>
              <select className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl" onChange={(e) => setFormData({...formData, timeAvailable: e.target.value})}>
                <option>15 min/dia</option>
                <option>30 min/dia</option>
                <option>1 hora/dia</option>
              </select>
              <select className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl" onChange={(e) => setFormData({...formData, learningStyle: e.target.value})}>
                <option>Visual</option>
                <option>Prático</option>
                <option>Teórico</option>
              </select>
              <button className="w-full bg-blue-600 py-4 rounded-xl font-bold text-white">
                {loading ? "Processando..." : "Mapear Trajetória"}
              </button>
            </form>
          </section>

          {/* Resultado */}
          <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 min-h-[300px]">
            {result ? (
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300">{result}</pre>
            ) : (
              <p className="text-slate-600 italic text-center mt-20">O diagnóstico da IA aparecerá aqui...</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}