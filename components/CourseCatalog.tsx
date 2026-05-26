"use client";
import { useState, useEffect, useMemo } from "react";

export default function CourseCatalog() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  
  // Novo estado para o "Modo Cinema" (Modal)
  const [activeCourse, setActiveCourse] = useState<any | null>(null);

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

  // Inteligência para extrair a categoria pelo seu JSON (Separado por Ponto e Vírgula)
  const getCategoryName = (course: any) => {
    if (course.keywords) {
      const firstKeyword = course.keywords.split(';')[0].trim();
      if (firstKeyword) {
        // Deixa a primeira letra maiúscula para ficar bonito na aba
        return firstKeyword.charAt(0).toUpperCase() + firstKeyword.slice(1);
      }
    }
    return "Gerais";
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    courses.forEach(course => cats.add(getCategoryName(course)));
    return ["Todos", ...Array.from(cats)].sort();
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (activeCategory === "Todos") return courses;
    return courses.filter(course => getCategoryName(course) === activeCategory);
  }, [courses, activeCategory]);

  // Função que roda quando o vídeo termina!
  const handleVideoEnded = (course: any) => {
    const watched = JSON.parse(localStorage.getItem("cefis_watched") || "[]");
    
    // Verifica se já não está na lista para não duplicar
    if (!watched.find((c: any) => c.id === course.id)) {
      localStorage.setItem("cefis_watched", JSON.stringify([...watched, course]));
    }
    
    alert(`Parabéns! Você concluiu a aula do curso: ${course.title}. Ele foi adicionado às suas Aulas Assistidas.`);
    setActiveCourse(null); // Fecha o modal
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-fade-in">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium">Carregando catálogo da CEFIS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative">
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Catálogo de Aulas</h2>
        <p className="text-slate-400">Selecione uma categoria e clique para assistir em tela cheia.</p>
      </div>
      
      {/* ABAS DE CATEGORIA */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${
              activeCategory === cat 
                ? "bg-blue-600 text-white border border-blue-500" 
                : "bg-slate-900 border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {cat} {cat === "Todos" && <span className="ml-2 bg-slate-800/50 px-2 py-0.5 rounded-md text-xs">{courses.length}</span>}
          </button>
        ))}
      </div>

      {/* GRID DE CURSOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="group flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300">
            
            <div 
              className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer border-b border-slate-800"
              onClick={() => {
                if (course.hasLessons && course.firstLessonVideo) setActiveCourse(course);
              }}
            >
              <img src={course.banner} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
              
              {/* Ícone de Play */}
              {course.hasLessons && course.firstLessonVideo && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 bg-blue-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)] transform group-hover:scale-110 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </div>
                </div>
              )}
              
              <div className="absolute top-3 left-3">
                <span className="bg-slate-900/90 backdrop-blur-md text-[10px] text-slate-300 px-2.5 py-1 rounded-md font-bold uppercase shadow-sm border border-slate-700/50">
                  {getCategoryName(course)}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-slate-400 mb-6 line-clamp-2 flex-grow">{course.summary}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-800">
                {course.hasLessons && course.firstLessonVideo ? (
                  <button onClick={() => setActiveCourse(course)} className="w-full py-2.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-blue-500/20">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Assistir Aula
                  </button>
                ) : (
                  <span className="w-full py-2.5 flex justify-center items-center gap-2 text-slate-500 text-xs font-bold uppercase bg-slate-900/50 rounded-xl border border-slate-800">
                    Indisponível
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL DE VÍDEO (TELA GRANDE) ================= */}
      {activeCourse && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-fade-in">
          <div className="w-full max-w-6xl bg-slate-950 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Cabeçalho do Modal */}
            <div className="flex justify-between items-center p-4 border-b border-slate-800">
              <h3 className="text-white font-bold text-lg line-clamp-1 pr-8">{activeCourse.title}</h3>
              <button onClick={() => setActiveCourse(null)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer absolute right-4 top-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Player de Vídeo Gigante */}
            <div className="w-full bg-black flex-1 flex items-center justify-center min-h-[400px]">
              <video 
                controls 
                autoPlay 
                crossOrigin="anonymous" 
                className="w-full h-full max-h-[70vh] object-contain"
                onEnded={() => handleVideoEnded(activeCourse)} // SALVA AO TERMINAR
              >
                <source src={activeCourse.firstLessonVideo} type="video/mp4" />
                {activeCourse.subtitlePath && (
                  <track kind="captions" src={`/api/subtitle?path=${encodeURIComponent(activeCourse.subtitlePath)}`} srcLang="pt-br" label="Português" default />
                )}
              </video>
            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-sm">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Assista até o final para contabilizar nos seus assistidos.
              </span>
              <button onClick={() => handleVideoEnded(activeCourse)} className="text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer text-xs">
                (Dev Mode: Marcar como visto)
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}