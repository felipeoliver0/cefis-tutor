// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Se você já criou a pasta types/profile.ts, descomente a linha abaixo
// import { UserProfile } from "@/types/profile";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<"loading" | "onboarding" | "dashboard">("loading");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("cefis_token");
    const profile = localStorage.getItem("cefis_profile");

    if (!token) {
      router.push("/login");
    } else if (!profile) {
      setStep("onboarding");
    } else {
      setUserEmail(localStorage.getItem("cefis_user_email") || "");
      setStep("dashboard");
    }
  }, [router]);

  const handleProfileComplete = (data: any) => {
    localStorage.setItem("cefis_profile", JSON.stringify(data));
    setStep("dashboard");
  };

  if (step === "loading") return <div className="min-h-screen bg-slate-950"></div>;

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <h1 className="text-xl font-bold text-white">AI Tutor Engine // CEFIS</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{userEmail}</span>
            <button 
              onClick={() => { localStorage.clear(); router.push("/login"); }}
              className="text-red-400 text-xs font-bold underline"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Renderização condicional por estado */}
        {step === "onboarding" ? (
          <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
            <h2 className="text-2xl font-bold mb-6 text-white">Vamos configurar seu perfil</h2>
            {/* Aqui entraria o seu componente de Onboarding */}
            <button 
              onClick={() => handleProfileComplete({ status: 'completed' })}
              className="w-full bg-blue-600 py-4 rounded-xl text-white font-bold"
            >
              Finalizar Perfil (Simulado)
            </button>
          </section>
        ) : (
          <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 min-h-[400px]">
            <h2 className="text-2xl font-bold mb-6 text-white">Dashboard do Aluno</h2>
            <p>Seu plano de estudos personalizado aparecerá aqui.</p>
          </section>
        )}
      </div>
    </main>
  );
}