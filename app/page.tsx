"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Onboarding from "../components/Onboarding";
import TutorDashboard from "../components/TutorDashboard"; // Importamos o novo Dashboard
import { UserProfile } from "../types/profile";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<"loading" | "onboarding" | "dashboard">("loading");
  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("cefis_token");
    const storedProfile = localStorage.getItem("cefis_profile");

    if (!token) {
      router.push("/login");
    } else if (!storedProfile) {
      setUserEmail(localStorage.getItem("cefis_user_email") || "");
      setStep("onboarding");
    } else {
      setUserEmail(localStorage.getItem("cefis_user_email") || "");
      setProfile(JSON.parse(storedProfile));
      setStep("dashboard");
    }
  }, [router]);

  const handleProfileComplete = (data: UserProfile) => {
    localStorage.setItem("cefis_profile", JSON.stringify(data));
    setProfile(data);
    setStep("dashboard");
  };

  if (step === "loading") return <div className="min-h-screen bg-slate-950"></div>;

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <header className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
            AI Tutor Engine // CEFIS
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block">{userEmail}</span>
            <button 
              onClick={() => { localStorage.clear(); router.push("/login"); }}
              className="text-red-400 text-sm font-bold underline hover:text-red-300"
            >
              Sair
            </button>
          </div>
        </header>

        <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 min-h-[400px]">
          {step === "onboarding" ? (
            <Onboarding onComplete={handleProfileComplete} />
          ) : (
            // Quando tiver perfil, carrega o Tutor passando os dados
            profile && <TutorDashboard profile={profile} /> 
          )}
        </section>

      </div>
    </main>
  );
}