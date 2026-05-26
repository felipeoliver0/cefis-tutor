// app/api/tutor/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal } = body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Atualizado para um modelo ativo e recomendado
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Você é um tutor da plataforma CEFIS. Responda de forma curta e profissional." },
          { role: "user", content: `Crie um plano de estudos para: ${goal}` }
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro na API do Groq");
    }

    return NextResponse.json({ 
      success: true, 
      tutorResponse: data.choices[0].message.content 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}