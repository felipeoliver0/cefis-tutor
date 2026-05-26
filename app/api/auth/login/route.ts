// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cpf, email } = body;

    // Conecta na API oficial da CEFIS
    const response = await fetch("https://api.cefis.com.br/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cpf, email }),
    });

    const data = await response.json();

    // VALIDAÇÃO REAL: Só prossegue se a API da CEFIS retornar status 200/OK
    if (!response.ok) {
      return NextResponse.json({ error: "Credenciais inválidas no sistema CEFIS" }, { status: 401 });
    }

    // Se passou, retorna o token real da API deles
    return NextResponse.json({ success: true, token: data.token });

  } catch (error) {
    return NextResponse.json({ error: "Erro de conexão com o servidor" }, { status: 500 });
  }
}