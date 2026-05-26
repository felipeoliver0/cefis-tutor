// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Tentativa de login enviada:", body); // Isso vai aparecer nos logs da Vercel

    const response = await fetch("https://api.cefis.com.br/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Resposta da API CEFIS:", data); // Isso vai nos dizer o erro real

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Credenciais inválidas" }, { status: response.status });
    }

    return NextResponse.json({ success: true, user: data.user, token: data.token });

  } catch (error) {
    return NextResponse.json({ error: "Erro de conexão com o servidor CEFIS." }, { status: 500 });
  }
}