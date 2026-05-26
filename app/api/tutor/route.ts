// app/api/tutor/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const genAI = new GoogleGenerativeAI(apiKey);

    // Tentativa direta com o modelo base. O SDK vai injetar o 'v1' automaticamente.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent("Diga 'Olá mundo'");
    const response = await result.response;
    
    return NextResponse.json({ 
      success: true, 
      message: response.text() 
    });

  } catch (error: any) {
    // Isso vai capturar o erro REAL e retornar para a tela para nós
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}