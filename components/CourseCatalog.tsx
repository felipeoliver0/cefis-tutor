"use client";
import { useState, useEffect, useMemo } from "react";

export default function CourseCatalog() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

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

  // Função inteligente para extrair a categoria do JSON do curso (cobre vários padrões CEFIS)
  const getCategoryName = (course: any) => {
    if (course.category && typeof course.category === 'string') return course.category;
    if (course.category && course.category.name) return course.category.name;
    if (Array.isArray(course.categories) && course.categories.length > 0) return course.categories[0].name;
    if (course.keywords) return course.keywords.split(',')[0].trim();
    return "Geral";
  };

  // Agrupa e lista as categorias únicas
  const categories = useMemo(() => {
    const cats = new Set<string>();
    courses.forEach(course => {
      cats.add(getCategoryName(course));
    });
    return ["Todos", ...Array.from(cats)].sort();
  }, [courses]);

  // Filtra os cursos baseados na categoria ativa
  const filteredCourses = useMemo(() => {
    if (activeCategory === "Todos") return courses;
    return courses.filter(course => getCategoryName(course) === activeCategory);
  }, [courses, activeCategory]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-fade-in">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium">Carregando catálogo da CEFIS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* CABEÇALHO DO CATÁLOGO */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Catálogo de Aulas</h2>
        <p className="text-slate-400">Selecione uma categoria para explorar os conteúdos.</p>
      </div>
      
      {/* ABAS DE CATEGORIA (Scroll horizontal se houver muitas) */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setPlayingVideoId(null); // Para o vídeo ao trocar de aba
            }}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${
              activeCategory === cat 
                ? "bg-blue-600 text-white border border-blue-500" 
                : "bg-slate-900 border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {cat} 
            {cat === "Todos" && <span className="ml-2 bg-slate-800/50 px-2 py-0.5 rounded-md text-xs">{courses.length}</span>}
          </button>
        ))}
      </div>

      {/* GRID DE CURSOS FILTRADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="group flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300">
            
            {/* ÁREA DE MÍDIA */}
            {playingVideoId === course.id && course.firstLessonVideo ? (
              
              // PLAYER DE VÍDEO (Corrigido para object-contain e sem cortar a tela)
              <div className="relative bg-black aspect-video w-full flex items-center justify-center border-b border-slate-800">
                <video 
                  controls 
                  autoPlay 
                  crossOrigin="anonymous" 
                  className="w-full h-full object-contain"
                >
                  <source src={course.firstLessonVideo} type="video/mp4" />
                  {course.subtitlePath && (
                    <track kind="captions" src={`/api/subtitle?path=${encodeURIComponent(course.subtitlePath)}`} srcLang="pt-br" label="Português" default />
                  )}
                </video>
              </div>

            ) : (

              // CAPA DO CURSO
              <div 
                className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer border-b border-slate-800"
                onClick={() => {
                  if (course.hasLessons && course.firstLessonVideo) {
                    setPlayingVideoId(course.id);
                  }
                }}
              >
                <img 
                  src={course.banner} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                
                {/* Ícone de Play */}
                {course.hasLessons && course.firstLessonVideo && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 bg-blue-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)] transform group-hover:scale-110 transition-transform">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </div>
                  </div>
                )}
                
                {/* Selo Categoria e Legenda */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-slate-900/90 backdrop-blur-md text-[10px] text-slate-300 px-2.5 py-1 rounded-md font-bold uppercase shadow-sm border border-slate-700/50">
                    {getCategoryName(course)}
                  </span>
                </div>
                {course.subtitlePath && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-600/90 backdrop-blur-md text-[10px] text-white px-2.5 py-1 rounded-md font-bold shadow-sm">CC</span>
                  </div>
                )}
              </div>
            )}
            
            {/* INFORMAÇÕES DO CURSO */}
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {course.title}
              </h3>
              
              {course.teacher && (
                <div className="flex items-center gap-2 mb-4">
                  <img src={course.teacher.avatar} alt={course.teacher.name} className="w-6 h-6 rounded-full object-cover border border-slate-700" />
                  <span className="text-xs text-slate-400 font-medium">{course.teacher.name}</span>
                </div>
              )}
              
              <p className="text-sm text-slate-400 mb-6 line-clamp-2 flex-grow">
                {course.summary}
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-800">
                {course.hasLessons && course.firstLessonVideo ? (
                  <button 
                    onClick={() => setPlayingVideoId(course.id)}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      playingVideoId === course.id 
                        ? "bg-slate-800 text-blue-400 border border-slate-700" 
                        : "bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 hover:border-blue-500"
                    }`}
                  >
                    {playingVideoId === course.id ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                        Assistindo...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        Assistir Aula
                      </>
                    )}
                  </button>
                ) : (
                  <span className="w-full py-2.5 flex justify-center items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-900/50 rounded-xl border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-slate-700"></span> Indisponível
                  </span>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
      
      {/* ESTADO VAZIO (Caso uma categoria não tenha cursos, improvável mas seguro) */}
      {filteredCourses.length === 0 && (
        <div className="py-16 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <p className="text-slate-400 font-medium text-lg">Nenhum curso encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
}