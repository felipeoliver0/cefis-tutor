// app/api/tutor/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRelevantCEFISContext } from "../../utils/readCourses";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal, experience, timeAvailable, learningStyle } = body;

    if (!goal || !experience) {
      return NextResponse.json({ error: "Objetivo e experiência são obrigatórios." }, { status: 400 });
    }

    // Busca no acervo local os dados reais do acervo CEFIS via RAG
    const cefisContext = getRelevantCEFISContext(goal);

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const prompt = `
      Você é um tutor de aprendizado de inteligência artificial da plataforma CEFIS.
      Gere um diagnóstico curto das lacunas do aluno e um plano estruturado para o perfil abaixo:
      - Objetivo: ${goal}
      - Nível: ${experience}
      - Tempo: ${timeAvailable}
      - Estilo: ${learningStyle}

      ACERVO DISPONÍVEL DA CEFIS:
      ${cefisContext}

      Regra estrita: Escreva o plano direto em formato de texto Markdown fluido, recomendando explicitamente as aulas e cursos retornados no ACERVO DA CEFIS acima. Indique os IDs das aulas para que ele estude o material oficial.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Mapeia dinamicamente os cards para a vitrine com base no objetivo digitado
    const isComms = goal.toLowerCase().includes("comunica") || goal.toLowerCase().includes("corporativ");
    const simulatedCourses = isComms ? [
      {
        id: "mod-1",
        title: "Comunicação Corporativa Eficaz",
        duration: "2h 45min",
        lessonTitle: "Apresentação e Introdução",
        lessonId: 488225,
        badge: "Conteúdo Oficial CEFIS"
      }
    ] : [
      {
        id: "mod-2",
        title: "Desenvolvimento de Soft Skills",
        duration: "4h 20min",
        lessonTitle: "Comunicação e Alinhamento",
        lessonId: 101,
        badge: "Recomendado"
      }
    ];

    return NextResponse.json({ 
      success: true, 
      tutorResponse: text,
      courses: simulatedCourses
    });

} catch (error: any) {
    // Log detalhado no painel de logs da Vercel
    console.error("ERRO DETALHADO:", error);
    
    // Retorna o erro real para a tela para sabermos o motivo (ex: quota, chave inválida, etc)
    return NextResponse.json(
      { error: error.message || "Erro desconhecido na API do Gemini" }, 
      { status: 500 }
    );
  }
}