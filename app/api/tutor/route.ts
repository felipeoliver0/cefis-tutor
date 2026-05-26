import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, age, learningStyle, studyTime, studyPeriod, history } = body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key não configurada" }, { status: 500 });
    }

    // Caminho da pasta de cursos
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
              
              // Busca vídeo e legenda na pasta lessons/
              const lessonsDir = path.join(coursePath, 'lessons');
              if (fs.existsSync(lessonsDir)) {
                const lessonFolders = fs.readdirSync(lessonsDir);
                if (lessonFolders.length > 0) {
                  const lessonId = lessonFolders[0]; // Pega a primeira aula
                  const lessonPath = path.join(lessonsDir, lessonId);
                  
                  // Pega details.json da aula
                  const lessonDetailPath = path.join(lessonPath, 'details.json');
                  if (fs.existsSync(lessonDetailPath)) {
                    const lessonData = JSON.parse(fs.readFileSync(lessonDetailPath, 'utf-8'));
                    const sources = lessonData.stream_sources || [];
                    const hdSource = sources.find((s: any) => s.quality === "hd") || sources[0];
                    if (hdSource) courseData.firstLessonVideo = hdSource.link_secure;
                  }

                  // Pega arquivo de legenda .vtt
                  const filesInLesson = fs.readdirSync(lessonPath);
                  const vttFile = filesInLesson.find(f => f.endsWith('.vtt'));
                  if (vttFile) courseData.subtitlePath = path.join(lessonPath, vttFile);
                }
              }
              allCourses.push(courseData);
            } catch (e) { console.error(`Erro ao ler curso ${folderId}`, e); }
          }
        }
      }
    }

    const searchTerm = (subject || "").toLowerCase();
    const matchedCourses = allCourses.filter(c =>
      (c.title?.toLowerCase().includes(searchTerm)) ||
      (c.keywords?.toLowerCase().includes(searchTerm)) ||
      (c.summary?.toLowerCase().includes(searchTerm))
    ).slice(0, 3);

    let coursesPromptInfo = matchedCourses.map(c => 
      `TÍTULO: ${c.title} | RESUMO: ${c.summary}`
    ).join("\n");

    const systemPrompt = `Você é um Tutor de IA especialista da CEFIS.
PERFIL: ${subject}, ${age} anos, Estilo: ${learningStyle}, Tempo: ${studyTime}.
CURSOS CEFIS RELEVANTES: ${coursesPromptInfo || "Nenhum curso específico encontrado."}
DIRETRIZES: Responda como um professor particular, recomende os cursos acima se relevantes e mantenha um histórico de conversa útil.`;

    const messagesToSend = [{ role: "system", content: systemPrompt }, ...(history || [])];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messagesToSend,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return NextResponse.json({ 
      tutorResponse: data.choices[0].message.content,
      recommendedCourses: matchedCourses
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}