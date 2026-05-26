// app/login/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ cpf: "", email: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api.cefis.email/notifications/sdks/webSdk.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação do login para garantir o funcionamento na demo
    localStorage.setItem("cefis_token", "demo_token");
    localStorage.setItem("cefis_user_email", formData.email);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Acesso CEFIS</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="CPF"
            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white"
          />
          <input 
            type="email" placeholder="E-mail"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white"
          />
          <button className="w-full bg-blue-600 py-4 rounded-xl text-white font-bold">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}