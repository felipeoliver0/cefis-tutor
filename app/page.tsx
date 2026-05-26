"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EnvironmentManager from "../components/EnvironmentManager";
import Onboarding from "../components/Onboarding";
import TutorDashboard from "../components/TutorDashboard";
import { LearningEnvironment } from "../types/profile";

export default function Home() {
  const router = useRouter();
  
  // Estados da página
  const [view, setView] = useState<"list" | "onboarding" | "dashboard">("list");
  const [activeEnv, setActiveEnv] = useState<LearningEnvironment | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [isReady, setIsReady] = useState(false);

  // Validação de sessão ao carregar
  useEffect(() => {
    const token = localStorage.getItem("cefis_token");
    if (!token) {
      router.push("/login");
    } else {
      setUserEmail(localStorage.getItem("cefis_user_email") || "Usuário");
      setIsReady(true);
    }
  }, [router]);

  // Handler para criar novo ambiente após o onboarding
  const handleCreateNew = (data: any) => {
    const newEnv: LearningEnvironment = {
      id: Date.now().toString(),
      name: data.subject, 
      profile: data
    };

    const currentEnvs = JSON.parse(localStorage.getItem("cefis_environments") || "[]");
    const updatedEnvs = [...currentEnvs, newEnv];
    
    localStorage.setItem("cefis_environments", JSON.stringify(updatedEnvs));
    
    setActiveEnv(newEnv);
    setView("dashboard");
  };

  // Handler de Logout (Apaga apenas a sessão, mantém os ambientes salvos)
  const handleLogout = () => {
    localStorage.removeItem("cefis_token");
    localStorage.removeItem("cefis_user_email");
    router.push("/login");
  };

  if (!isReady) return <div className="min-h-screen bg-[#0a0f1c]"></div>;

  return (
    <div className="min-h-screen bg-[#0a0f1c] font-sans flex flex-col">
      
      {/* TOP NAVBAR (Barra Superior com Logo Clicável e Branca) */}
      <nav className="w-full bg-[#0a0f1c] border-b border-slate-800/80 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          
          {/* Logo da CEFIS usando SVG Nativo e Texto Branco (100% à prova de falhas) */}
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-all cursor-pointer group" title="Voltar ao Início">
            <svg className="w-8 h-8 text-white group-hover:-rotate-3 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
            </svg>
            <span className="text-2xl font-black text-white tracking-tight">CEFIS</span>
          </a>
          
          <div className="h-6 w-px bg-slate-700"></div> {/* Linha separadora vertical */}
          
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-blue-500 font-bold tracking-widest text-sm uppercase">AI Tutor Engine</span>
          </div>
        </div>
        
        {/* Badge Lateral do Hackathon */}
        <div className="hidden md:block px-4 py-1.5 rounded-md border border-slate-800 bg-slate-900/50 text-slate-400 text-[10px] tracking-widest">
          HACKATHON_2026 // SYSTEM_ONLINE
        </div>
      </nav>

      {/* ÁREA PRINCIPAL DA APLICAÇÃO */}
      <main className="flex-1 p-6 md:p-12 text-slate-200">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Cabeçalho Interno do Usuário */}
          <header className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
            <h1 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
              Al Tutor // CEFIS
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:block text-slate-300">{userEmail}</span>
              <button 
                onClick={handleLogout}
                className="text-red-400 text-sm font-bold hover:text-red-300 hover:underline transition-colors cursor-pointer"
              >
                Sair
              </button>
            </div>
          </header>

          {/* Renderização Dinâmica das Telas */}
          <section className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 min-h-[400px]">
            
            {view === "list" && (
              <EnvironmentManager onSelect={(env) => {
                if (env.id === 'new') {
                  setView("onboarding");
                } else {
                  setActiveEnv(env);
                  setView("dashboard");
                }
              }} />
            )}

            {view === "onboarding" && (
              <Onboarding onComplete={handleCreateNew} />
            )}

            {view === "dashboard" && activeEnv && (
              <div className="space-y-6 animate-fade-in">
                <button 
                  onClick={() => setView("list")} 
                  className="text-blue-400 text-sm hover:text-blue-300 hover:underline mb-4 font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  ← Voltar para Meus Ambientes
                </button>
                <TutorDashboard profile={activeEnv.profile} />
              </div>
            )}

          </section>
        </div>
      </main>
    </div>
  );
}