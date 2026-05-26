import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, age, learningStyle, studyTime, studyPeriod } = body;
    const apiKey = process.env.GROQ_API_KEY;

    // 1. APONTA PARA A PASTA "OUTPUT"
    // Caminho: /seu-projeto/courses/output
    const coursesDir = path.join(process.cwd(), 'courses', 'output');
    let allCourses: any[] = [];

    // 2. VASCULHA AS PASTAS DOS CURSOS (Ex: 4556, 4557...)
    if (fs.existsSync(coursesDir)) {
      const courseFolders = fs.readdirSync(coursesDir); // Lista as pastas dos IDs

      for (const folderId of courseFolders) {
        const coursePath = path.join(coursesDir, folderId);
        
        // Verifica se é realmente uma pasta
        if (fs.statSync(coursePath).isDirectory()) {
          // Tenta ler detail.json ou details.json (ajustando para evitar erros de digitação)
          const detailPath = path.join(coursePath, 'details.json');
          const detailPathAlt = path.join(coursePath, 'detail.json');
          
          const validDetailPath = fs.existsSync(detailPath) ? detailPath : (fs.existsSync(detailPathAlt) ? detailPathAlt : null);

          if (validDetailPath) {
            const fileData = fs.readFileSync(validDetailPath, 'utf-8');
            try {
              const parsed = JSON.parse(fileData);
              const courseData = parsed.data || parsed; // Pega o objeto interno se tiver "data"
              
              // 2.1 AGORA VAMOS PEGAR A AULA 1
              let videoLink = null;
              const lessonsDir = path.join(coursePath, 'lessons');
              
              if (fs.existsSync(lessonsDir)) {
                const lessonFolders = fs.readdirSync(lessonsDir);
                // Pega a primeira pasta de aula (ex: "1")
                if (lessonFolders.length > 0) {
                  const firstLessonPath = path.join(lessonsDir, lessonFolders[0], 'details.json');
                  if (fs.existsSync(firstLessonPath)) {
                    const lessonData = JSON.parse(fs.readFileSync(firstLessonPath, 'utf-8'));
                    // Busca a fonte de vídeo em HD
                    const sources = lessonData.stream_sources || [];
                    const hdSource = sources.find((s: any) => s.quality === "hd") || sources[0];
                    if (hdSource) {
                      videoLink = hdSource.link_secure;
                    }
                  }
                }
              }

              // Salva o link do vídeo direto no objeto do curso para facilitar
              courseData.firstLessonVideo = videoLink;
              allCourses.push(courseData);

            } catch (e) {
              console.error(`Erro ao ler o curso na pasta ${folderId}`, e);
            }
          }
        }
      }
    }

    // 3. FILTRA OS CURSOS RELEVANTES
    const searchTerm = subject.toLowerCase();
    const matchedCourses = allCourses.filter(c =>
      (c.title && c.title.toLowerCase().includes(searchTerm)) ||
      (c.keywords && c.keywords.toLowerCase().includes(searchTerm)) ||
      (c.summary && c.summary.toLowerCase().includes(searchTerm))
    ).slice(0, 3); // Limita a 3 recomendações

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