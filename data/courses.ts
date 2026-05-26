import { CefisCourse } from "../types/course";

// Simulação de importação dos seus arquivos JSON reais
// No seu projeto, você pode fazer: import cursoComunicacao from '../courses/comunicacao/detail.json'
const rawCourseDetail = {
  // ... (cole o conteúdo do seu detail.json aqui para testar)
  "id": 4556,
  "title": "Comunicação Corporativa",
  "summary": "Curso prático focado em oratória e clareza...",
  "banner": "https://s3.cefis.cloud/cefiscdn/uploads-v3/a391a14a-61ab-4048-af26-bd41a15c3ddf-thumbnail.png",
  "keywords": "comunicação;comunicação assertiva;comunicação empresarial;comunicação estatégica",
  "teacher": {
    "name": "Solange Durães",
    "avatar": "https://cefis.com.br/assets/images/site/svg/user-icon.svg"
  }
};

const rawLessonDetail = {
  // ... (cole o conteúdo do json da aula aqui)
  "id": 488225,
  "title": "Apresentação",
  "stream_sources": [
    {
      "quality": "hd",
      "link_secure": "https://cdn2.cefis.com.br/vod/09fc72a6-f97b-4cff-8d23-e91cd279aacb/720.mp4"
    }
  ]
};

// Aqui montamos a lista de cursos unindo os dados e formatando
export const availableCourses: CefisCourse[] = [
  {
    id: rawCourseDetail.id,
    title: rawCourseDetail.title,
    subtitle: "curso prático",
    summary: rawCourseDetail.summary,
    banner: rawCourseDetail.banner,
    keywords: rawCourseDetail.keywords,
    teacher: rawCourseDetail.teacher,
    lessons: [
      {
        id: rawLessonDetail.id,
        title: rawLessonDetail.title,
        position: 1,
        duration: 20,
        stream_sources: rawLessonDetail.stream_sources as any
      }
    ]
  }
  // Adicione os outros cursos importados aqui seguindo o mesmo padrão
];