import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. RECEBE OS DADOS DO ALUNO E O HISTÓRICO DE CHAT
    const { subject, age, learningStyle, studyTime, studyPeriod, history } = body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "ERRO: GROQ_API_KEY não encontrada no servidor." }, { status: 500 });
    }

    // 2. APONTA PARA A PASTA "OUTPUT" E LÊ OS CURSOS LOCAIS
    // Caminho esperado: /seu-projeto/courses/output
    const coursesDir = path.join(process.cwd(), 'courses', 'output');
    let allCourses: any[] = [];

    if (fs.existsSync(coursesDir)) {
      const courseFolders = fs.readdirSync(coursesDir);

      for (const folderId of courseFolders) {
        const coursePath = path.join(coursesDir, folderId);
        
        if (fs.statSync(coursePath).isDirectory()) {
          const detailPath = path.join(coursePath, 'details.json');
          const detailPathAlt = path.join(coursePath, 'detail.json');
          const validDetailPath = fs.existsSync(detailPath) ? detailPath : (fs.existsSync(detailPathAlt) ? detailPathAlt : null);

          if (validDetailPath) {
            const fileData = fs.readFileSync(validDetailPath, 'utf-8');
            try {
              const parsed = JSON.parse(fileData);
              const courseData = parsed.data || parsed; 
              
              // 2.1 BUSCA O VÍDEO DA PRIMEIRA AULA
              let videoLink = null;
              const lessonsDir = path.join(coursePath, 'lessons');
              
              if (fs.existsSync(lessonsDir)) {
                const lessonFolders = fs.readdirSync(lessonsDir);
                if (lessonFolders.length > 0) {
                  // Entra na primeira pasta de aula (ex: "1" ou "Apresentação")
                  const firstLessonPath = path.join(lessonsDir, lessonFolders[0], 'details.json');
                  if (fs.existsSync(firstLessonPath)) {
                    const lessonData = JSON.parse(fs.readFileSync(firstLessonPath, 'utf-8'));
                    
                    // Procura o vídeo em HD ou pega o primeiro disponível
                    const sources = lessonData.stream_sources || [];
                    const hdSource = sources.find((s: any) => s.quality === "hd") || sources[0];
                    if (hdSource) {
                      videoLink = hdSource.link_secure;
                    }
                  }
                }
              }

              // Salva o link no objeto
              courseData.firstLessonVideo = videoLink;
              allCourses.push(courseData);

            } catch (e) {
              console.error(`Erro ao ler o curso na pasta ${folderId}`, e);
            }
          }
        }
      }
    }

    // 3. FILTRA APENAS OS CURSOS RELEVANTES PARA O ASSUNTO (SUBJECT)
    const searchTerm = (subject || "").toLowerCase();
    const matchedCourses = allCourses.filter(c =>
      (c.title && c.title.toLowerCase().includes(searchTerm)) ||
      (c.keywords && c.keywords.toLowerCase().includes(searchTerm)) ||
      (c.summary && c.summary.toLowerCase().includes(searchTerm))
    ).slice(0, 3); // Limita a 3 cursos para a IA não se perder

    // 4. PREPARA AS INFORMAÇÕES DE CURSOS PARA A IA
    let coursesPromptInfo = "Nenhum curso específico encontrado na base local. Recomende conceitos gerais focados no objetivo do aluno.";
    if (matchedCourses.length > 0) {
      coursesPromptInfo = matchedCourses.map(c => 
        `TÍTULO: ${c.title} | RESUMO: ${c.summary}`
      ).join("\n");
    }

    // 5. CRIA O PROMPT DO SISTEMA
    const systemPrompt = `Você é um Tutor de IA especialista da plataforma educacional CEFIS.
Sua missão é criar planos de estudos práticos e auxiliar o aluno em suas dúvidas.

PERFIL DO ALUNO: 
- Objetivo: ${subject} 
- Idade: ${age} anos 
- Estilo de Aprendizado: ${learningStyle} 
- Tempo Diário: ${studyTime} 
- Horário Preferido: ${studyPeriod}

AQUI ESTÃO OS CURSOS DA CEFIS DISPONÍVEIS E RELEVANTES PARA ELE:
${coursesPromptInfo}

DIRETRIZES OBRIGATÓRIAS:
1. Formate suas respostas usando Markdown (negrito, listas, bullet points).
2. Se for a primeira mensagem, crie um cronograma de estudos que se encaixe no tempo diário do aluno.
3. Se houver cursos relevantes listados acima, recomende-os fortemente ao aluno em sua resposta, explicando como o curso vai ajudar.
4. Se o aluno fizer perguntas, aja como um professor particular, sendo claro e didático.
5. Seja sempre inspirador e motivador.`;

    // 6. MONTA A LISTA DE MENSAGENS (COM OU SEM HISTÓRICO)
    const messagesToSend: any[] = [
      { role: "system", content: systemPrompt }
    ];

    if (history && history.length > 0) {
      // Já existe uma conversa, empurra o histórico para a IA
      messagesToSend.push(...history);
    } else {
      // É a primeira geração, pede para criar o plano
      messagesToSend.push({ role: "user", content: `Por favor, gere meu plano de estudos focado em ${subject} e indique os materiais da CEFIS agora.` });
    }

    // 7. CHAMA A IA DO GROQ
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${apiKey}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messagesToSend,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        error: `API Groq retornou erro ${response.status}: ${JSON.stringify(data)}` 
      }, { status: response.status });
    }

    // 8. DEVOLVE A RESPOSTA E OS CURSOS PARA O FRONTEND
    return NextResponse.json({ 
      tutorResponse: data.choices[0].message.content,
      recommendedCourses: matchedCourses
    });

  } catch (error: any) {
    console.error("Erro interno na API do Tutor:", error);
    return NextResponse.json({ error: `Erro no servidor: ${error.message}` }, { status: 500 });
  }
}