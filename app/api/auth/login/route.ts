// app/login/page.tsx
"use client";
import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    // Carrega o SDK da CEFIS dinamicamente
    const script = document.createElement("script");
    script.src = "https://api.cefis.email/notifications/sdks/webSdk.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ... restante do seu formulário