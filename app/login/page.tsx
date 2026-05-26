"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ cpf: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Faz a autenticação
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        
        // 2. Salva o Token
        localStorage.setItem("cefis_token", "logado");

        // 3. IDENTIFICAÇÃO DO USUÁRIO
        // Se a sua API de login já retornar o nome (data.name), use ele!
        // Caso contrário, faremos a chamada da API que você mostrou no print:
        
        const identifyRes = await fetch("https://api.cefis.email/customers/identify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
             // Ajuste os campos conforme sua documentação de API
             cpf: formData.cpf 
          })
        });

        if (identifyRes.ok) {
          const userData = await identifyRes.json();
          // SALVA O NOME E EMAIL NO LOCALSTORAGE PARA A HOME LER
          localStorage.setItem("cefis_user_name", userData.name || "Usuário");
          localStorage.setItem("cefis_user_email", userData.email || "email@exemplo.com");
        } else {
          // Fallback caso a identificação falhe
          localStorage.setItem("cefis_user_name", "Usuário");
        }

        router.push("/");
      } else {
        alert("Falha na autenticação. Verifique seu CPF e Senha.");
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
            placeholder="CPF" 
            required
            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
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