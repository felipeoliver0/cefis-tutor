"use client";
import { useState, useEffect } from "react";
import { UserProfile } from "../types/profile";

export default function TutorDashboard({ profile }: { profile: UserProfile }) {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Função que chama sua IA automaticamente ao carregar o dashboard
    const generateTutorPlan = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Enviamos o perfil inteiro para a IA usar no prompt
          body: JSON.stringify(profile), 
        });
        
        const data = await response.json();
        setResult(data.tutorResponse || "Nenhuma resposta gerada.");
      } catch (err) {
        setResult("Ocorreu um erro ao conectar com o Tutor de IA.");
      } finally {
        setLoading(false);
      }
    };

    // Só roda se ainda não tiver resultado
    if (!result) {
      generateTutorPlan();
    }
  }, [profile, result]);

  return (
    <div className="space-y-6">
      {/* Resumo do perfil selecionado */}
      <div className="flex flex-wrap gap-3 mb-6 border-b border-slate-800 pb-6">
        <span className="bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-300">🎯 {profile.subject}</span>
        <span className="bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-300">⏱️ {profile.studyTime}</span>
        <span className="bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-300">🌙 {profile.studyPeriod}</span>
        <span className="bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-300">🧠 {profile.learningStyle}</span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-400 font-medium">A IA está mapeando sua trajetória ideal...</p>
        </div>
      ) : (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <pre className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}