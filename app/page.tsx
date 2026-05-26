"use client";
import { useEffect, useState } from "react";
// Subindo um nível (..) para sair da pasta 'app' e entrar na pasta 'components'
import OnboardingForm from "../components/OnboardingForm";
import { UserProfile } from "../types/profile";

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Carrega o perfil do localStorage se existir
    const savedProfile = localStorage.getItem("cefis_profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setIsLoaded(true);
  }, []);

  const handleProfileComplete = (data: UserProfile) => {
    localStorage.setItem("cefis_profile", JSON.stringify(data));
    setProfile(data);
  };

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-[#0a0c10] p-6 text-slate-200">
      {/* ... Seu Header existente ... */}

      <div className="max-w-6xl mx-auto mt-8">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
          <h1 className="text-2xl font-bold text-white mb-6">Dashboard do Aluno</h1>
          
          {!profile ? (
            <OnboardingForm onComplete={handleProfileComplete} />
          ) : (
            <div className="text-green-400">
              <p>Perfil carregado com sucesso! Iniciando motor de IA...</p>
              {/* Aqui você chama seu componente de IA existente */}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}