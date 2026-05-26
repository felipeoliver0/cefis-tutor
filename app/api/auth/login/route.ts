// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { cpf, email } = await req.json();
    
    // Aqui você mantém a lógica que comunica com o backend da CEFIS
    // Como o SDK é front-end, a API aqui faz a validação de proxy
    return NextResponse.json({ success: true, token: "token_mock_valido" });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}