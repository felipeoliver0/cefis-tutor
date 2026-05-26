// app/api/tutor/route.ts (Trecho a ser atualizado)
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // 1. ADICIONAMOS O "history" AQUI
    const { subject, age, learningStyle, studyTime, studyPeriod, history } = body; 
    const apiKey = process.env.GROQ_API_KEY;

    // ... (MANTENHA TODO O SEU CÓDIGO DE LER PASTAS E FILTRAR CURSOS AQUI) ...

    const systemPrompt = `Você é um Tutor de IA especialista da CEFIS.
PERFIL DO ALUNO: Objetivo: ${subject} | ${age} anos | Estilo: ${learningStyle} | Tempo: ${studyTime} | Horário: ${studyPeriod}.
CURSOS RELEVANTES CEFIS:
${coursesPromptInfo}

DIRETRIZES:
1. Seja encorajador, claro e direto.
2. Formate as respostas com Markdown para facilitar a leitura.
3. Se o aluno fizer perguntas sobre o plano ou sobre os cursos, ajude-o como um professor particular.`;

    // 2. LÓGICA DE HISTÓRICO DE CONVERSA
    const messagesToSend = [
      { role: "system", content: systemPrompt }
    ];

    if (history && history.length > 0) {
      // Se já tem conversa rolando, manda o histórico inteiro para a IA lembrar
      messagesToSend.push(...history);
    } else {
      // Se for a primeira vez, pede para gerar o plano
      messagesToSend.push({ role: "user", content: "Gere meu plano de estudos e indique os materiais agora." });
    }

    // 3. CHAMA O GROQ
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messagesToSend, // Usa as mensagens dinâmicas
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    return NextResponse.json({ 
      tutorResponse: data.choices[0].message.content,
      recommendedCourses: matchedCourses // Mantenha a devolução dos cursos!
    });

  } catch (error: any) {
    return NextResponse.json({ error: `Erro no servidor: ${error.message}` }, { status: 500 });
  }
}

    // 4. PREPARA O TEXTO PARA A IA
    let coursesPromptInfo = "Nenhum curso específico encontrado na base local. Recomende conceitos gerais.";
    if (matchedCourses.length > 0) {
      coursesPromptInfo = matchedCourses.map(c => 
        `TÍTULO: ${c.title} | RESUMO: ${c.summary}`
      ).join("\n");
    }

    const systemPrompt = `Você é um Tutor de IA especialista da plataforma CEFIS.
Sua missão é criar um plano de estudos personalizado.

PERFIL DO ALUNO: Objetivo: ${subject} | ${age} anos | Estilo: ${learningStyle} | Tempo: ${studyTime} | Horário: ${studyPeriod}.

AQUI ESTÃO OS CURSOS DA CEFIS RELEVANTES PARA ESTE ALUNO:
${coursesPromptInfo}

DIRETRIZES OBRIGATÓRIAS:
1. Crie um cronograma realista de estudos.
2. RECOMENDE FORTEMENTE os cursos da CEFIS listados acima, citando o título.
3. Formate com Markdown.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Gere meu plano de estudos.` }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    return NextResponse.json({ 
      tutorResponse: data.choices[0].message.content,
      recommendedCourses: matchedCourses // Envia os cursos e os links dos vídeos
    });

  } catch (error: any) {
    return NextResponse.json({ error: `Erro no servidor: ${error.message}` }, { status: 500 });
  }
}