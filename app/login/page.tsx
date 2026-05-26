// app/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ cpf: "", email: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulando autenticação para permitir o seu acesso imediato
    localStorage.setItem("cefis_token", "token_valido_hackathon");
    localStorage.setItem("cefis_user_email", formData.email);
    
    // Redireciona para a Home
    router.push("/");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Acesso CEFIS</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="CPF" required
            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input 
            type="email" placeholder="E-mail" required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-4 rounded-xl text-white font-bold hover:bg-blue-500 transition-all"
          >
            {loading ? "Autenticando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}