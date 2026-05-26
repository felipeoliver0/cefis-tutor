"use client";
import { useState } from "react";
import { UserProfile } from "@/types/profile";

export default function OnboardingForm({ onComplete }: { onComplete: (data: UserProfile) => void }) {
  const [formData, setFormData] = useState<UserProfile>({
    education: "Graduação",
    studyTime: "30 min/dia",
    period: "Noite",
    isEmployed: false
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Para criarmos seu plano, precisamos te conhecer melhor:</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select className="p-3 bg-slate-950 border border-slate-700 rounded-xl text-white" 
                onChange={(e) => setFormData({...formData, education: e.target.value})}>
          <option>Ensino Médio</option>
          <option>Graduação</option>
          <option>Pós-Graduação</option>
        </select>

        <select className="p-3 bg-slate-950 border border-slate-700 rounded-xl text-white"
                onChange={(e) => setFormData({...formData, studyTime: e.target.value})}>
          <option>15 min/dia</option>
          <option>30 min/dia</option>
          <option>1 hora/dia</option>
        </select>
      </div>

      <button 
        onClick={() => onComplete(formData)}
        className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold text-white transition-all"
      >
        Gerar Plano de Estudos Personalizado
      </button>
    </div>
  );
}