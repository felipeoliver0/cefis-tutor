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
              
              // Verifica se tem aula disponível para habilitar o botão
              const lessonsDir = path.join(coursePath, 'lessons');
              if (fs.existsSync(lessonsDir) && fs.readdirSync(lessonsDir).length > 0) {
                courseData.hasLessons = true;
              } else {
                courseData.hasLessons = false;
              }

              allCourses.push(courseData);
            } catch (e) {
              console.error(`Erro ao ler o curso na pasta ${folderId}`, e);
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