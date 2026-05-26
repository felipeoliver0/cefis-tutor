import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, age, learningStyle, studyTime, studyPeriod } = body;

    const apiKey = process.env.GROQ_API_KEY;
    
    // Diagnóstico rápido
    if (!apiKey) {
      return NextResponse.json({ error: "ERRO: GROQ_API_KEY não encontrada no servidor." }, { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Você é um tutor especializado da CEFIS." },
          { role: "user", content: `Crie um plano de estudos para: ${subject}. Perfil: ${age} anos, estilo ${learningStyle}, ${studyTime} por dia, período ${studyPeriod}.` }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // ISSO VAI MOSTRAR O ERRO REAL NA SUA TELA
      return NextResponse.json({ 
        error: `API Groq retornou erro ${response.status}: ${JSON.stringify(data)}` 
      }, { status: response.status });
    }

    return NextResponse.json({ tutorResponse: data.choices[0].message.content });

  } catch (error: any) {
    return NextResponse.json({ error: `Erro no servidor: ${error.message}` }, { status: 500 });
  }
}