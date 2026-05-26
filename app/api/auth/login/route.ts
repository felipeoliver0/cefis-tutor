// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { cpf, email } = await req.json();

    // Aqui você substitui pela URL oficial da API da CEFIS que eles te forneceram
    const response = await fetch("https://api.cefis.com.br/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cpf, email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: "Credenciais inválidas ou CPF não encontrado." }, { status: 401 });
    }

    // Retorna os dados do usuário e o token de autenticação
    return NextResponse.json({ success: true, user: data.user, token: data.token });

  } catch (error) {
    return NextResponse.json({ error: "Erro de conexão com o servidor CEFIS." }, { status: 500 });
  }
}