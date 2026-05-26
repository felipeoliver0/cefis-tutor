// app/api/tutor/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRelevantCEFISContext } from "../../utils/readCourses";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal, experience, timeAvailable, learningStyle } = body;

    if (!goal || !experience) {
      return NextResponse.json({ error: "Objetivo e experiência são obrigatórios." }, { status: 400 });
    }

    // Busca no sistema local os dados reais do acervo CEFIS via RAG
    const cefisContext = getRelevantCEFISContext(goal);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Você é um tutor de aprendizado de inteligência artificial da plataforma CEFIS.
      Gere um diagnóstico curto das lacunas do aluno e um plano estruturado para o perfil abaixo:
      - Objetivo: ${goal}
      - Nível: ${experience}
      - Tempo: ${timeAvailable}
      - Estilo: ${learningStyle}

      ACERVO DISPONÍVEL DA CEFIS:
      ${cefisContext}

      Regra estrita: Escreva o plano direto em formato de texto Markdown fluido, recomendando explicitamente as aulas e cursos retornados no ACERVO DA CEFIS acima.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Mapeamento dinâmico para simular ou vincular o card na vitrine
    const isComms = goal.toLowerCase().includes("comunica") || goal.toLowerCase().includes("corporativ");
    
    // Salva o histórico completo da Trilha gerada no Banco de Dados Postgres (Usando cast 'as any' para ignorar o TS local enquanto o npx roda)
    const savedPlan = await (prisma as any).studyPlan.create({
      data: {
        goal,
        experience,
        timeAvailable,
        learningStyle,
        diagnostic: text,
        modules: {
          create: isComms ? [
            {
              title: "Comunicação Corporativa Eficaz",
              duration: "2h 45min",
              lessonTitle: "Apresentação e Introdução",
              lessonId: 488225,
              badge: "Conteúdo Oficial CEFIS"
            }
          ] : [
            {
              title: "Desenvolvimento de Soft Skills",
              duration: "4h 20min",
              lessonTitle: "Comunicação e Alinhamento",
              lessonId: 101,
              badge: "Recomendado"
            }
          ]
        }
      },
      include: { modules: true }
    });

    return NextResponse.json({ 
      success: true, 
      tutorResponse: savedPlan.diagnostic,
      courses: savedPlan.modules,
      planId: savedPlan.id
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro na API do Tutor:", errorMessage);
    return NextResponse.json({ error: "Falha ao gerar e salvar o plano de estudos." }, { status: 500 });
  }
}