"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // Ajustado para 'identifier' para aceitar tanto CPF quanto E-mail
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Autenticação
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviamos 'identifier' como o CPF ou E-mail
        body: JSON.stringify({
          cpf: formData.identifier, // Ajuste a chave se o seu backend esperar 'email' ou 'identifier'
          password: formData.password
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("cefis_token", "logado");

        // 2. Busca o nome do usuário para o Dashboard
        // A API de identificação vai confirmar o nome real do usuário
        const identifyRes = await fetch("https://api.cefis.email/customers/identify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
             // Se o seu backend aceitar o identifier como chave, ajuste aqui
             cpf: formData.identifier 
          })
        });

        if (identifyRes.ok) {
          const userData = await identifyRes.json();
          localStorage.setItem("cefis_user_name", userData.name || "Usuário");
          localStorage.setItem("cefis_user_email", userData.email || "");
        } else {
          localStorage.setItem("cefis_user_name", "Usuário");
        }

        router.push("/");
      } else {
        alert("Falha na autenticação. Verifique seus dados.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Acesso CEFIS</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="CPF ou E-mail" 
            required
            onChange={(e) => setFormData({...formData, identifier: e.target.value})}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
          />
          <input 
            type="password" 
            placeholder="Senha" 
            required
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
          />
          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl text-white font-bold transition-all cursor-pointer disabled:bg-slate-700"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}