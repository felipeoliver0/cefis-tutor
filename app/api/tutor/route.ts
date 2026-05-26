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

    // Busca no sistema de arquivos local os JSONs e VTTs da CEFIS que casam com o objetivo
    const cefisContext = getRelevantCEFISContext(goal);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Você é um tutor de aprendizado de inteligência artificial da plataforma CEFIS. 
      Sua missão é criar o melhor plano de estudos possível com base no perfil do usuário e no acervo de cursos da plataforma.

      PERFIL DO ALUNO:
      - Objetivo principal: ${goal}
      - Nível de experiência atual: ${experience}
      - Tempo disponível: ${timeAvailable || "Não especificado"}
      - Estilo de aprendizagem: ${learningStyle || "Não especificado"}

      ACERVO DA CEFIS RECUPERADO (Baseado no objetivo do aluno):
      ${cefisContext}

      Sua tarefa:
      1. Diagnóstico de lacunas: Avalie o nível do aluno e indique o que ele precisa dominar primeiro.
      2. Plano de estudos: Crie um plano de aprendizado estruturado em passos práticos. 
      3. Integração de Conteúdo: Você DEVE citar os Cursos e as Aulas Específicas do ACERVO DA CEFIS listado acima dentro do cronograma do plano de estudos, indicando os IDs das aulas para que ele estude o material oficial.

      Responda em um tom empático, direto e encorajador. Formate em Markdown usando títulos (##), listas e negritos para facilitar a leitura. Não adicione textos extras genéricos antes ou depois do plano.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, tutorResponse: text });

  } catch (error: any) {
    console.error("Erro na API do Tutor:", error);
    return NextResponse.json({ error: "Falha ao gerar o plano de estudos com IA." }, { status: 500 });
  }
}