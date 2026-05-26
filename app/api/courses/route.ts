import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
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
              
              const lessonsDir = path.join(coursePath, 'lessons');
              if (fs.existsSync(lessonsDir)) {
                const lessonFolders = fs.readdirSync(lessonsDir);
                if (lessonFolders.length > 0) {
                  courseData.hasLessons = true;
                  const lessonPath = path.join(lessonsDir, lessonFolders[0]);
                  
                  // Pega o vídeo HD
                  const lessonDetailPath = path.join(lessonPath, 'details.json');
                  if (fs.existsSync(lessonDetailPath)) {
                    const lessonData = JSON.parse(fs.readFileSync(lessonDetailPath, 'utf-8'));
                    const sources = lessonData.stream_sources || [];
                    const hdSource = sources.find((s: any) => s.quality === "hd") || sources[0];
                    if (hdSource) courseData.firstLessonVideo = hdSource.link_secure;
                  }

                  // Pega a legenda VTT
                  const filesInLesson = fs.readdirSync(lessonPath);
                  const vttFile = filesInLesson.find(f => f.endsWith('.vtt'));
                  if (vttFile) courseData.subtitlePath = path.join(lessonPath, vttFile);
                } else {
                  courseData.hasLessons = false;
                }
              }

              allCourses.push(courseData);
            } catch (e) {
              console.error(`Erro ao ler curso na pasta ${folderId}`, e);
            }
          }
        }
      }
    }

    return NextResponse.json({ courses: allCourses });
  } catch (error: any) {
    return NextResponse.json({ error: `Erro no servidor: ${error.message}` }, { status: 500 });
  }
}