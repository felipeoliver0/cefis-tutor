// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Importação dos componentes
import EnvironmentManager from "../components/EnvironmentManager";
import Onboarding from "../components/Onboarding";
import TutorDashboard from "../components/TutorDashboard";

// Importação dos tipos
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
      name: data.subject, // Usa o assunto como nome do ambiente
      profile: data
    };

    const currentEnvs = JSON.parse(localStorage.getItem("cefis_environments") || "[]");
    const updatedEnvs = [...currentEnvs, newEnv];
    
    localStorage.setItem("cefis_environments", JSON.stringify(updatedEnvs));
    
    setActiveEnv(newEnv);
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!isReady) return <div className="min-h-screen bg-slate-950"></div>;

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Consistente */}
        <header className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
              AI Tutor Engine // CEFIS
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block">{userEmail}</span>
            <button 
              onClick={handleLogout}
              className="text-red-400 text-sm font-bold underline hover:text-red-300"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Área Principal Dinâmica */}
        <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 min-h-[400px]">
          
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
            <div className="space-y-6">
              <button 
                onClick={() => setView("list")} 
                className="text-blue-400 text-sm hover:underline mb-4"
              >
                ← Voltar para meus ambientes
              </button>
              <TutorDashboard profile={activeEnv.profile} />
            </div>
          )}

        </section>
      </div>
    </main>
  );
}