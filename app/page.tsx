"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EnvironmentManager from "../components/EnvironmentManager";
import Onboarding from "../components/Onboarding";
import TutorDashboard from "../components/TutorDashboard";
import CourseCatalog from "../components/CourseCatalog"; // Importamos o Catálogo!
import { LearningEnvironment } from "../types/profile";

export default function Home() {
  const router = useRouter();
  
  // Adicionamos 'catalog' aos estados da página
  const [view, setView] = useState<"list" | "onboarding" | "dashboard" | "catalog">("list");
  const [activeEnv, setActiveEnv] = useState<LearningEnvironment | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("cefis_token");
    if (!token) {
      router.push("/login");
    } else {
      setUserEmail(localStorage.getItem("cefis_user_email") || "Usuário");
      setIsReady(true);
    }
  }, [router]);

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

  const handleLogout = () => {
    localStorage.removeItem("cefis_token");
    localStorage.removeItem("cefis_user_email");
    router.push("/login");
  };

  if (!isReady) return <div className="min-h-screen bg-[#0a0f1c]"></div>;

  return (
    <div className="min-h-screen bg-[#0a0f1c] font-sans flex flex-col">
      
      {/* NAVBAR SUPERIOR */}
      <nav className="w-full bg-[#0a0f1c] border-b border-slate-800/80 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-all cursor-pointer group" title="Voltar ao Início">
            <svg className="w-8 h-8 text-white group-hover:-rotate-3 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
            </svg>
            <span className="text-2xl font-black text-white tracking-tight">CEFIS</span>
          </a>
          <div className="h-6 w-px bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-blue-500 font-bold tracking-widest text-sm uppercase">AI Tutor Engine</span>
          </div>
        </div>
        
        <div className="hidden md:block px-4 py-1.5 rounded-md border border-slate-800 bg-slate-900/50 text-slate-400 text-[10px] tracking-widest">
          HACKATHON_2026 // SYSTEM_ONLINE
        </div>
      </nav>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 p-6 md:p-12 text-slate-200">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <header className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
            <h1 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
              Al Tutor // CEFIS
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:block text-slate-300">{userEmail}</span>
              <button onClick={handleLogout} className="text-red-400 text-sm font-bold hover:text-red-300 hover:underline transition-colors cursor-pointer">
                Sair
              </button>
            </div>
          </header>

          <section className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 min-h-[400px]">
            
            {/* SISTEMA DE ABAS (Só aparece se não estivermos no dashboard ou onboarding) */}
            {(view === "list" || view === "catalog") && (
              <div className="flex gap-4 mb-8 border-b border-slate-800/80 pb-px">
                <button 
                  onClick={() => setView("list")}
                  className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${view === "list" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}
                >
                  Meus Ambientes
                </button>
                <button 
                  onClick={() => setView("catalog")}
                  className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${view === "catalog" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}
                >
                  Catálogo Completo
                </button>
              </div>
            )}

            {/* RENDERIZAÇÃO DAS TELAS */}
            {view === "list" && (
              <EnvironmentManager onSelect={(env) => {
                if (env.id === 'new') setView("onboarding");
                else { setActiveEnv(env); setView("dashboard"); }
              }} />
            )}

            {view === "catalog" && (
              <CourseCatalog />
            )}

            {view === "onboarding" && (
              <div className="animate-fade-in">
                <button onClick={() => setView("list")} className="text-slate-400 hover:text-blue-400 mb-6 font-bold flex items-center gap-2 text-sm cursor-pointer">
                  ← Cancelar
                </button>
                <Onboarding onComplete={handleCreateNew} />
              </div>
            )}

            {view === "dashboard" && activeEnv && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-800/80 mb-6">
                  <button onClick={() => setView("list")} className="text-slate-400 hover:text-blue-400 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm">
                    ← Voltar
                  </button>
                  <div className="h-6 w-px bg-slate-700"></div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    Ambiente: <span className="text-blue-400">{activeEnv.name}</span>
                  </h2>
                </div>

                <TutorDashboard profile={activeEnv.profile} />
              </div>
            )}

          </section>
        </div>
      </main>
    </div>
  );
}