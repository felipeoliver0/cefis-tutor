export interface CefisStreamSource {
  quality: string;
  type: string;
  link_secure: string;
  height: number;
}

export interface CefisLesson {
  id: number;
  title: string;
  position: number;
  duration: number;
  stream_sources: CefisStreamSource[];
}

export interface CefisCourse {
  id: number;
  title: string;
  subtitle: string;
  summary: string;
  banner: string;
  keywords: string;
  teacher: {
    name: string;
    avatar: string;
  };
  lessons: CefisLesson[]; // A lista de aulas daquele curso
}