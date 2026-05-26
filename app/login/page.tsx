// app/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ cpf: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Função utilitária para validar CPF básico
  const isValidCPF = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, "");
    return cleaned.length === 11;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidCPF(formData.cpf)) {
      setError("Por favor, insira um CPF válido com 11 dígitos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("cefis_token", data.token); // Salva o token localmente
        router.push("/"); 
      } else {
        setError("Credenciais inválidas. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor CEFIS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Acesso CEFIS</h1>
        
        {error && <p className="text-red-400 text-xs mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="CPF (apenas números)" 
            maxLength={11}
            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input 
            type="email" 
            placeholder="E-mail corporativo" 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button 
            disabled={loading}
            className="w-full bg-blue-600 py-4 rounded-xl text-white font-bold hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            {loading ? "Validando acesso..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}