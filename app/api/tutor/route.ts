// app/api/tutor/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal, experience, timeAvailable, learningStyle } = body;

    if (!goal || !experience) {
      return NextResponse.json({ error: "Objetivo e experiência são obrigatórios." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Você é um tutor de aprendizado de inteligência artificial altamente capacitado da plataforma CEFIS.
      O usuário forneceu o seguinte perfil para o onboarding:
      - Objetivo principal: ${goal}
      - Nível de experiência atual: ${experience}
      - Tempo disponível: ${timeAvailable || "Não especificado"}
      - Estilo de aprendizagem: ${learningStyle || "Não especificado"}

      Sua tarefa:
      1. Diagnóstico de lacunas: Identifique de forma direta o que o aluno ainda precisa aprender para atingir esse objetivo considerando seu nível atual.
      2. Plano de estudos: Crie um plano de aprendizado curto e estruturado.
      
      Responda em um tom encorajador, direto e formatado em Markdown, com cabeçalhos.
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