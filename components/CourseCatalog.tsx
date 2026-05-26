"use client";
import { useState, useEffect } from "react";

export default function CourseCatalog() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null); // Estado para controlar qual vídeo está tocando

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-fade-in">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium">Carregando catálogo da CEFIS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Catálogo Completo</h2>
          <p className="text-slate-400">Explore todos os cursos disponíveis na plataforma.</p>
        </div>
        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-700 shadow-sm">
          {courses.length} Cursos
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="group flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300">
            
            {/* ÁREA DE MÍDIA: Mostra o Vídeo OU a Capa (Banner) */}
            {playingVideoId === course.id && course.firstLessonVideo ? (
              
              // PLAYER DE VÍDEO
              <div className="relative bg-black aspect-video w-full flex items-center justify-center animate-fade-in">
                <video 
                  controls 
                  autoPlay 
                  crossOrigin="anonymous" 
                  className="w-full h-full object-cover"
                >
                  <source src={course.firstLessonVideo} type="video/mp4" />
                  {course.subtitlePath && (
                    <track 
                      kind="captions" 
                      src={`/api/subtitle?path=${encodeURIComponent(course.subtitlePath)}`} 
                      srcLang="pt-br" 
                      label="Português" 
                      default 
                    />
                  )}
                </video>
              </div>

            ) : (

              // CAPA DO CURSO COM BOTÃO DE PLAY
              <div 
                className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer"
                onClick={() => {
                  if (course.hasLessons && course.firstLessonVideo) {
                    setPlayingVideoId(course.id);
                  }
                }}
              >
                <img 
                  src={course.banner} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                
                {/* Degradê escuro para destacar o play e o selo CC */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                
                {/* Ícone de Play Centralizado (só aparece se tiver aula) */}
                {course.hasLessons && course.firstLessonVideo && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 bg-blue-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)] transform group-hover:scale-110 transition-transform">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                )}

                {/* Selo de Legenda (CC) */}
                <div className="absolute top-3 right-3">
                  {course.subtitlePath && (
                    <span className="bg-green-600/90 backdrop-blur-md text-[10px] text-white px-2.5 py-1 rounded-full font-bold shadow-sm">CC</span>
                  )}
                </div>
              </div>
            )}
            
            {/* INFORMAÇÕES DO CURSO */}
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {course.title}
              </h3>
              
              {course.teacher && (
                <div className="flex items-center gap-2 mb-3">
                  <img src={course.teacher.avatar} alt={course.teacher.name} className="w-5 h-5 rounded-full object-cover border border-slate-700" />
                  <span className="text-xs text-slate-400 font-medium">{course.teacher.name}</span>
                </div>
              )}
              
              <p className="text-sm text-slate-400 mb-6 line-clamp-2 flex-grow">
                {course.summary}
              </p>
              
              {/* Botão de Ação / Status */}
              <div className="mt-auto pt-4 border-t border-slate-800">
                {course.hasLessons && course.firstLessonVideo ? (
                  <button 
                    onClick={() => setPlayingVideoId(course.id)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    {playingVideoId === course.id ? "Assistindo..." : "Assistir Aula"}
                  </button>
                ) : (
                  <span className="w-full py-2.5 flex justify-center items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-900/50 rounded-xl border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-slate-700"></span> Conteúdo Indisponível
                  </span>
                )}
              </div>
            </div>

          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-slate-600"><rect x="2" y="2" width="20" height="20" rx="2.5" ry="2.5"></rect><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>
            <p className="text-slate-400 font-medium text-lg">Nenhum curso encontrado na pasta.</p>
          </div>
        )}
      </div>
    </div>
  );
}