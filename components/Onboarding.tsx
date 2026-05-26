"use client";
import { useState } from "react";
import { UserProfile } from "../types/profile";

export default function Onboarding({ onComplete }: { onComplete: (data: UserProfile) => void }) {
  const [formData, setFormData] = useState<UserProfile>({
    age: "",
    learningStyle: "Visual e Prático",
    studyTime: "30 min/dia",
    studyPeriod: "Noite",
    subject: ""
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-2">Para criarmos seu plano, precisamos te conhecer melhor:</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">O que você quer estudar?</label>
          <input 
            type="text" 
            placeholder="Ex: Lógica de Programação, Marketing Digital..."
            required
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Sua Idade</label>
            <input 
              type="number" 
              placeholder="Ex: 25"
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Como prefere estudar?</label>
            <select 
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, learningStyle: e.target.value})}
            >
              <option>Visual e Prático (Vídeos/Mão na massa)</option>
              <option>Teórico e Leitura (Artigos/Livros)</option>
              <option>Auditivo (Podcasts/Aulas narradas)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Tempo diário</label>
            <select 
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, studyTime: e.target.value})}
            >
              <option>15 min/dia</option>
              <option>30 min/dia</option>
              <option>1 hora/dia</option>
              <option>Mais de 2 horas/dia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Melhor período</label>
            <select 
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, studyPeriod: e.target.value})}
            >
              <option>Manhã</option>
              <option>Tarde</option>
              <option>Noite</option>
              <option>Madrugada</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => onComplete(formData)}
          disabled={!formData.subject} // Só libera o botão se o objetivo estiver preenchido
          className="w-full mt-4 bg-blue-600 disabled:bg-slate-700 hover:bg-blue-500 py-4 rounded-xl font-bold text-white transition-all"
        >
          Gerar Plano de Estudos com IA
        </button>
      </div>
    </div>
  );
}