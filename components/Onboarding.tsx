"use client";
import { useState } from "react";

export default function Onboarding({ onComplete }: { onComplete: (data: any) => void }) {
  const [profile, setProfile] = useState({
    education: "Graduado",
    studyTime: "30 min/dia",
    period: "Noite",
    isEmployed: false
  });

  return (
    <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-3xl border border-slate-800">
      <h2 className="text-xl font-bold text-white mb-6">Complete seu Perfil</h2>
      <div className="space-y-4">
        <select className="w-full p-4 bg-slate-950 rounded-xl" onChange={(e) => setProfile({...profile, education: e.target.value})}>
          <option>Ensino Médio</option>
          <option>Graduação</option>
          <option>Pós-Graduação</option>
        </select>
        {/* Adicione os outros selects seguindo o mesmo padrão */}
        <button 
          onClick={() => onComplete(profile)}
          className="w-full bg-indigo-600 py-4 rounded-xl font-bold text-white"
        >
          Finalizar Configuração
        </button>
      </div>
    </div>
  );
}