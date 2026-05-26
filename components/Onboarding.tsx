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
      <h2 className="text-xl font-bold text-white">Configuração de Perfil</h2>
      <select className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white" 
              onChange={(e) => setFormData({...formData, education: e.target.value})}>
        <option>Ensino Médio</option>
        <option>Graduação</option>
      </select>
      
      <button 
        onClick={() => onComplete(formData)}
        className="w-full bg-blue-600 py-4 rounded-xl font-bold text-white hover:bg-blue-500"
      >
        Finalizar Perfil
      </button>
    </div>
  );
}