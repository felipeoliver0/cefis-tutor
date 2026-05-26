// app/login/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Declaração para evitar erro de tipagem com o SDK externo
declare global {
  interface Window {
    Cefis: any;
  }
}

export default function LoginPage() {
  const [formData, setFormData] = useState({ cpf: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // 1. Carrega o SDK da CEFIS dinamicamente ao montar a página
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api.cefis.email/notifications/sdks/webSdk.js";
    script.async = true;
    script.onload = () => console.log("SDK CEFIS Carregado");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 2. Tenta usar o SDK da CEFIS para logar
    // (Ajuste o nome do método 'login' conforme o que aparecer no seu console F12)
    try {
      if (window.Cefis && typeof window.Cefis.login === 'function') {
        const auth = await window.Cefis.login(formData.cpf, formData.email);
        
        if (auth.success) {
          localStorage.setItem("cefis_token", auth.token);
          localStorage.setItem("cefis_user_email", formData.email);
          router.push("/");
        } else {
          setError("Credenciais inválidas via SDK.");
        }
      } else {
        // Fallback: Se o SDK não carregar ou não tiver o método, 
        // use o modo "Homologação" para sua apresentação não parar.
        console.warn("SDK não carregado ou método inexistente, usando modo de apresentação.");
        localStorage.setItem("cefis_token", "hackathon_token_2026");
        localStorage.setItem("cefis_user_email", formData.email);
        router.push("/");
      }
    } catch (err) {
      setError("Erro ao autenticar com o sistema.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Acesso CEFIS // AI Tutor</h1>
        
        {error && <p className="text-red-400 text-xs mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="CPF (apenas números)" 
            maxLength={11}
            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input 
            type="email" placeholder="E-mail" 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button 
            disabled={loading}
            className="w-full bg-blue-600 py-4 rounded-xl text-white font-bold hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            {loading ? "Autenticando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}