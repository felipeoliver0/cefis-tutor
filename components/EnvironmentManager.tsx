"use client";
import { useState, useEffect } from "react";
import { LearningEnvironment } from "../types/profile";

export default function EnvironmentManager({ onSelect }: { onSelect: (env: LearningEnvironment) => void }) {
  const [envs, setEnvs] = useState<LearningEnvironment[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cefis_environments");
    if (saved) setEnvs(JSON.parse(saved));
  }, []);

  const deleteEnv = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este ambiente?")) {
      const updated = envs.filter(e => e.id !== id);
      setEnvs(updated);
      localStorage.setItem("cefis_environments", JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-4">Seus Ambientes de Estudo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {envs.map((env) => (
          <div 
            key={env.id} 
            className="group relative p-6 bg-slate-900 rounded-2xl border border-slate-700 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors">{env.name}</h3>
              <p className="text-sm text-slate-400 mt-1 line-clamp-1">Foco: {env.profile.subject}</p>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              {/* Botão ABRIR com cursor-pointer e efeito de clique (active:scale-95) */}
              <button 
                onClick={() => onSelect(env)} 
                className="cursor-pointer px-6 py-2.5 bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white rounded-xl font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <span>Abrir Ambiente</span>
                <span>→</span>
              </button>
              
              {/* Botão EXCLUIR com cursor-pointer e efeito de clique */}
              <button 
                onClick={() => deleteEnv(env.id)} 
                className="cursor-pointer p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all hover:scale-110 active:scale-90" 
                title="Excluir ambiente"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
        
        {/* Card de NOVO AMBIENTE com cursor-pointer explícito */}
        <button 
          onClick={() => onSelect({ id: 'new', name: '', profile: {} as any })} 
          className="cursor-pointer group p-6 border-2 border-dashed border-slate-700 rounded-2xl min-h-[160px] flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-500 hover:text-blue-400 hover:bg-slate-900/50 transition-all active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-blue-600/20 flex items-center justify-center transition-all group-active:scale-90">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
          </div>
          <span className="font-semibold text-lg">Criar Novo Ambiente</span>
        </button>
      </div>
    </div>
  );
}