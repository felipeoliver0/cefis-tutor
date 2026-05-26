// app/api/tutor/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Recebe as exatas variáveis que definimos no UserProfile
    const body = await req.json();
    const { subject, age, learningStyle, studyTime, studyPeriod } = body;

    // 2. Monta o "System Prompt" (A instrução mestre da IA)
    const systemPrompt = `Você é um Tutor de IA especialista da plataforma CEFIS.
Sua missão é criar um plano de estudos altamente personalizado e factível.

AQUI ESTÁ O PERFIL DO ALUNO:
- Objetivo de estudo (Assunto): ${subject}
- Idade do aluno: ${age} anos
- Estilo de aprendizagem: ${learningStyle}
- Tempo disponível: ${studyTime}
- Horário de estudo: ${studyPeriod}

DIRETRIZES OBRIGATÓRIAS PARA SUA RESPOSTA:
1. Comece parabenizando o aluno pela iniciativa de estudar ${subject}.
2. Crie um cronograma realista que caiba perfeitamente no tempo de ${studyTime}.
3. Como o aluno prefere o estilo "${learningStyle}", recomende formatos de conteúdo que combinem com isso (ex: se for visual, recomende vídeos/diagramas; se auditivo, podcasts).
4. Leve em consideração que ele estudará no período da ${studyPeriod} para dicas de foco.
5. Formate a resposta usando Markdown para ficar bonito (use negrito, listas e emojis).`;

    // 3. Faz a chamada para a API do Groq (Ajuste o modelo se precisar)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, // Certifique-se de que sua chave está no .env
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // Modelo de alta performance do Groq
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Por favor, crie meu plano de estudos para ${subject} agora.` }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // 4. Retorna a resposta da IA para o frontend
    if (data.choices && data.choices.length > 0) {
      return NextResponse.json({ tutorResponse: data.choices[0].message.content });
    } else {
      return NextResponse.json({ tutorResponse: "Erro: Não foi possível gerar o plano." });
    }

  } catch (error) {
    console.error("Erro na API Tutor:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}