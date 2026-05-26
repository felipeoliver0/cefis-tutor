"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Onboarding from "../components/Onboarding";
import TutorDashboard from "../components/TutorDashboard";
import CourseCatalog from "../components/CourseCatalog";
import { LearningEnvironment } from "../types/profile";

export default function Home() {
  const router = useRouter();
  
  // Agora o estado inicial pode ser o catálogo (como uma vitrine)
  const [view, setView] = useState<"onboarding" | "dashboard" | "catalog" | "watched">("catalog");
  const [envs, setEnvs] = useState<LearningEnvironment[]>([]);
  const [activeEnv, setActiveEnv] = useState<LearningEnvironment | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [isReady, setIsReady] = useState(false);

  // Carrega a sessão e o histórico da barra lateral
  useEffect(() => {
    const token = localStorage.getItem("cefis_token");
    if (!token) {
      router.push("/login");
    } else {
      setUserEmail(localStorage.getItem("cefis_user_email") || "Usuário");
      const savedEnvs = localStorage.getItem("cefis_environments");
      if (savedEnvs) setEnvs(JSON.parse(savedEnvs));
      setIsReady(true);
    }
  }, [router]);

  // Cria um novo chat/ambiente
  const handleCreateNew = (data: any) => {
    const newEnv: LearningEnvironment = {
      id: Date.now().toString(),
      name: data.subject, 
      profile: data
    };
    const updatedEnvs = [newEnv, ...envs]; // Adiciona no topo
    setEnvs(updatedEnvs);
    localStorage.setItem("cefis_environments", JSON.stringify(updatedEnvs));
    
    setActiveEnv(newEnv);
    setView("dashboard");
  };

  // Exclui uma conversa do histórico
  const deleteEnv = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique abra o ambiente ao tentar excluir
    if (confirm("Deseja apagar este histórico com a IA?")) {
      const updated = envs.filter(env => env.id !== id);
      setEnvs(updated);
      localStorage.setItem("cefis_environments", JSON.stringify(updated));
      if (activeEnv?.id === id) {
        setActiveEnv(null);
        setView("catalog");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cefis_token");
    localStorage.removeItem("cefis_user_email");
    router.push("/login");
  };

  if (!isReady) return <div className="h-screen bg-[#0a0f1c]"></div>;

  return (
    <div className="flex h-screen bg-[#0a0f1c] font-sans overflow-hidden text-slate-200">
      
      {/* ================= BARRA LATERAL (SIDEBAR TIPO GEMINI) ================= */}
      <aside className="w-72 bg-[#080c17] border-r border-slate-800/80 flex flex-col h-full flex-shrink-0 z-20">
        
        {/* Topo da Sidebar: Logo */}
        <div className="p-6 border-b border-slate-800/50">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-all cursor-pointer group">
            <svg className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
            </svg>
            <span className="text-2xl font-black text-white tracking-tight">CEFIS</span>
          </a>
        </div>

        {/* Botão Novo Chat */}
        <div className="p-4">
          <button 
            onClick={() => setView("onboarding")}
            className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] active:scale-[0.98] cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Novo AI Tutor
          </button>
        </div>

        {/* Menu de Navegação */}
        <div className="px-4 pb-4 space-y-1 border-b border-slate-800/50">
          <button 
            onClick={() => { setView("catalog"); setActiveEnv(null); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${view === "catalog" ? "bg-slate-800/80 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Catálogo de Aulas
          </button>
          <button 
            onClick={() => { setView("watched"); setActiveEnv(null); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${view === "watched" ? "bg-slate-800/80 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Aulas Assistidas
          </button>
        </div>

        {/* Histórico de Conversas (scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-800">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Suas Conversas</h3>
          <div className="space-y-1">
            {envs.length === 0 ? (
              <p className="text-xs text-slate-600 px-2 italic">Nenhum tutor ativo.</p>
            ) : (
              envs.map((env) => (
                <div 
                  key={env.id}
                  onClick={() => { setActiveEnv(env); setView("dashboard"); }}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all ${activeEnv?.id === env.id ? "bg-slate-800/80 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"}`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <span className="truncate">{env.name}</span>
                  </div>
                  {/* Botão de excluir que aparece no hover */}
                  <button onClick={(e) => deleteEnv(env.id, e)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rodapé da Sidebar: Usuário */}
        <div className="p-4 border-t border-slate-800/50 bg-[#080c17]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold border border-blue-500/30 flex-shrink-0">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-slate-300 truncate">{userEmail}</span>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors p-2 cursor-pointer" title="Sair">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= ÁREA PRINCIPAL (CONTEÚDO) ================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#0a0f1c]">
        
        {/* Navbar de Contexto (Topo da área principal) */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {view === "dashboard" && activeEnv ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  Conversando com Tutor: <span className="text-blue-400">{activeEnv.name}</span>
                </h1>
              </>
            ) : view === "catalog" ? (
              <h1 className="text-lg font-bold text-white">Catálogo de Aulas</h1>
            ) : view === "watched" ? (
              <h1 className="text-lg font-bold text-white">Aulas Assistidas</h1>
            ) : view === "onboarding" ? (
              <h1 className="text-lg font-bold text-white">Configurar Novo Tutor</h1>
            ) : null}
          </div>
          <div className="px-3 py-1.5 rounded-md bg-blue-900/20 border border-blue-800/50 text-blue-400 text-[10px] tracking-widest font-bold">
            SYSTEM_ONLINE
          </div>
        </header>

        {/* Área de Rolagem do Conteúdo */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="max-w-6xl mx-auto h-full">
            
            {view === "catalog" && <CourseCatalog />}
            
            {view === "onboarding" && (
              <div className="animate-fade-in max-w-3xl mx-auto">
                <Onboarding onComplete={handleCreateNew} />
              </div>
            )}
            
            {view === "dashboard" && activeEnv && (
              <div className="animate-fade-in h-full">
                <TutorDashboard profile={activeEnv.profile} />
              </div>
            )}

            {/* Nova tela de Aulas Assistidas (Mock) */}
            {view === "watched" && (
              <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in py-20">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Nenhuma aula concluída ainda</h2>
                <p className="text-slate-400 max-w-md">
                  Seu histórico de aulas finalizadas aparecerá aqui. Volte ao catálogo ou converse com seu Tutor para começar a estudar!
                </p>
                <button 
                  onClick={() => setView("catalog")}
                  className="mt-8 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}