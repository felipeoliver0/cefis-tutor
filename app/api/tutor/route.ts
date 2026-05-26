// app/api/tutor/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const genAI = new GoogleGenerativeAI(apiKey);

    // Forçamos a API para a versão 'v1', que é a estável e garantida no nível gratuito
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" }, 
      { apiVersion: 'v1' } 
    );

    const result = await model.generateContent("Olá, teste de conexão.");
    const response = await result.response;
    
    return NextResponse.json({ 
      success: true, 
      message: response.text() 
    });

  } catch (error: any) {
    // Retorna o erro detalhado para a tela para confirmarmos se o 404 sumiu
    return NextResponse.json({ 
      error: error.message,
      // Se ainda houver 404, o console da Vercel terá o log da tentativa de URL completa
    }, { status: 500 });
  }
}