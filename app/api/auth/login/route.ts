// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { cpf, password } = await req.json();

    const response = await fetch("https://cefis.com.br/auth/logon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: cpf,      // A API deles exige a chave 'email', mesmo sendo um CPF
        password: password 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erro de conexão" }, { status: 500 });
  }
}