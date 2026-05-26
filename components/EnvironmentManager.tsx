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
    const updated = envs.filter(e => e.id !== id);
    setEnvs(updated);
    localStorage.setItem("cefis_environments", JSON.stringify(updated));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Seus Ambientes de Estudo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {envs.map((env) => (
          <div key={env.id} className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white">{env.name}</h3>
              <p className="text-xs text-slate-400">{env.profile.subject}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onSelect(env)} className="text-blue-400">Abrir</button>
              <button onClick={() => deleteEnv(env.id)} className="text-red-400">X</button>
            </div>
          </div>
        ))}
        
        {/* Botão para criar novo */}
        <button onClick={() => onSelect({ id: 'new', name: '', profile: {} as any })} 
                className="p-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 hover:border-blue-500 hover:text-blue-500">
          + Novo Ambiente
        </button>
      </div>
    </div>
  );
}   