// app/utils/readCourses.ts
import fs from 'fs';
import path from 'path';

export interface Lesson {
  id: number;
  title: string;
  duration: number;
  transcript: string;
}

export interface Course {
  courseId: string;
  courseTitle: string;
  lessons: Lesson[];
}

// Função para limpar o arquivo WEBVTT e extrair apenas o texto falado
function cleanVtt(vttString: string): string {
  return vttString
    .replace(/WEBVTT/g, '') // Remove cabeçalho
    .replace(/\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}/g, '') // Remove os timestamps (00:00:00.000 --> 00:00:06.000)
    .replace(/^\d+$/gm, '') // Remove números isolados das linhas (1, 2, 3...)
    .replace(/\n+/g, ' ') // Troca múltiplas quebras de linha por um espaço
    .trim();
}

// Lê as pastas aninhadas e monta o objeto estruturado
export function getAllCourses(): Course[] {
  const directoryPath = path.join(process.cwd(), 'data_courses');
  const coursesList: Course[] = [];

  try {
    if (!fs.existsSync(directoryPath)) return [];

    const courseFolders = fs.readdirSync(directoryPath);

    for (const courseFolder of courseFolders) {
      const coursePath = path.join(directoryPath, courseFolder);
      if (!fs.statSync(coursePath).isDirectory()) continue;

      // Lê o details.json geral do curso (se existir na raiz da pasta do curso)
      let courseTitle = courseFolder;
      const courseDetailsPath = path.join(coursePath, 'details.json');
      if (fs.existsSync(courseDetailsPath)) {
        const courseDetails = JSON.parse(fs.readFileSync(courseDetailsPath, 'utf-8'));
        if (courseDetails.title) courseTitle = courseDetails.title;
      }

      const lessonsList: Lesson[] = [];
      const lessonsDirPath = path.join(coursePath, 'lessons');

      if (fs.existsSync(lessonsDirPath)) {
        const lessonFolders = fs.readdirSync(lessonsDirPath);

        for (const lessonFolder of lessonFolders) {
          const lessonPath = path.join(lessonsDirPath, lessonFolder);
          if (!fs.statSync(lessonPath).isDirectory()) continue;

          let lessonData: Partial<Lesson> = { transcript: "" };

          // Lê o details.json da aula específica
          const lessonDetailsPath = path.join(lessonPath, 'details.json');
          if (fs.existsSync(lessonDetailsPath)) {
            const lessonDetails = JSON.parse(fs.readFileSync(lessonDetailsPath, 'utf-8'));
            lessonData.id = lessonDetails.id;
            lessonData.title = lessonDetails.title;
            lessonData.duration = lessonDetails.duration;
          }

          // Lê o arquivo de transcrição (procura por arquivo que termine com .vtt)
          const filesInLesson = fs.readdirSync(lessonPath);
          const vttFile = filesInLesson.find(f => f.endsWith('.vtt'));
          if (vttFile) {
            const vttPath = path.join(lessonPath, vttFile);
            const vttContent = fs.readFileSync(vttPath, 'utf-8');
            lessonData.transcript = cleanVtt(vttContent);
          }

          // Só adiciona a aula se conseguiu ler o ID e o título do JSON
          if (lessonData.id && lessonData.title) {
            lessonsList.push(lessonData as Lesson);
          }
        }
      }

      coursesList.push({
        courseId: courseFolder,
        courseTitle: courseTitle,
        lessons: lessonsList
      });
    }

    return coursesList;
  } catch (error) {
    console.error("Erro ao ler diretório de cursos data_courses:", error);
    return [];
  }
}

// Busca nas transcrições conteúdos que cruzam com o objetivo do aluno
export function getRelevantCEFISContext(userGoal: string): string {
  const allCourses = getAllCourses();
  
  // Extrai palavras maiores que 3 letras do objetivo para fazer a busca
  const keywords = userGoal.toLowerCase().split(' ').filter(w => w.length > 3);
  
  let contextStr = "Cursos e aulas reais da CEFIS disponíveis na plataforma que você DEVE recomendar no plano:\n\n";
  let foundAny = false;

  for (const course of allCourses) {
    let courseMatch = false;
    let courseContext = `Curso: ${course.courseTitle}\n`;

    for (const lesson of course.lessons) {
      const contentToSearch = (lesson.title + " " + lesson.transcript).toLowerCase();
      
      // Verifica se alguma palavra-chave do objetivo do usuário aparece na aula
      const isMatch = keywords.some(kw => contentToSearch.includes(kw));
      
      if (isMatch) {
        foundAny = true;
        courseMatch = true;
        // Pega um trecho curto de 250 caracteres da transcrição para provar à IA sobre o que a aula fala
        const snippet = lesson.transcript.substring(0, 250); 
        courseContext += `- Aula ID [${lesson.id}]: ${lesson.title}\n  Transcrição da aula: "${snippet}..."\n`;
      }
    }

    if (courseMatch) {
      contextStr += courseContext + "\n";
    }
  }

  if (!foundAny) {
    return "Nenhum conteúdo específico da CEFIS encontrado para as palavras-chave fornecidas. Crie o plano de estudos baseado no seu conhecimento geral.";
  }

  return contextStr; // Limite esse contexto no prompt final para não exceder tokens
}