"use client";
import { useState, useEffect } from "react";

export default function CourseCatalog() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Catálogo Completo</h2>
          <p className="text-slate-400">Explore todos os cursos disponíveis na plataforma.</p>
        </div>
        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-700">
          {courses.length} Cursos
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="group flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300">
            
            {/* Capa do Curso (Banner) */}
            <div className="relative h-40 w-full overflow-hidden bg-black">
              <img 
                src={course.banner} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
            
            {/* Informações */}
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {course.title}
              </h3>
              
              {course.teacher && (
                <div className="flex items-center gap-2 mb-3">
                  <img src={course.teacher.avatar} alt={course.teacher.name} className="w-5 h-5 rounded-full" />
                  <span className="text-xs text-slate-400">{course.teacher.name}</span>
                </div>
              )}
              
              <p className="text-sm text-slate-400 mb-6 line-clamp-2 flex-grow">
                {course.summary}
              </p>
              
              {/* Status */}
              <div className="mt-auto pt-4 border-t border-slate-800">
                {course.hasLessons ? (
                  <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Aulas Disponíveis
                  </span>
                ) : (
                  <span className="text-slate-500 text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-600"></span> Em breve
                  </span>
                )}
              </div>
            </div>

          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-500">Nenhum curso encontrado na pasta de arquivos.</p>
          </div>
        )}
      </div>
    </div>
  );
}