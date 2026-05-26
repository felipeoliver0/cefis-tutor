// app/api/tutor/route.ts (DEBUG MODE)
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const genAI = new GoogleGenerativeAI(apiKey);

    // Listar modelos disponíveis para diagnóstico
    const models = await genAI.listModels();
    console.log("MODELOS DISPONÍVEIS NA SUA CONTA:", JSON.stringify(models.models, null, 2));

    return NextResponse.json({ 
      debug: "Verifique os logs da Vercel no painel para ver a lista de modelos disponíveis." 
    });

  } catch (error: any) {
    console.error("ERRO DE DIAGNÓSTICO:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}