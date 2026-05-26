// app/login/page.tsx
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
// ... dentro da sua função de login, onde você recebe a resposta da API:

  const response = await fetch("https://api.cefis.email/customers/identify", { 
      method: "POST", 
      // ... seus headers e body
  });

  const data = await response.json();

  if (data) {
      // ESTAS SÃO AS LINHAS QUE VOCÊ PRECISA ADICIONAR:
      localStorage.setItem("cefis_user_name", data.name); // Salva o "Felipe de Oliveira"
      localStorage.setItem("cefis_user_email", data.email || ""); // Salva o email
      
      // E depois o seu redirecionamento normal:
      router.push("/"); 
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Acesso CEFIS</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="CPF" required
            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white"
          />
          <input 
            type="password" placeholder="Senha" required
            onChange={(e) => setFormData({...formData, password: e.target.value})}
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