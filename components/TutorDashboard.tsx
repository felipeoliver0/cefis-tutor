// components/TutorDashboard.tsx
"use client";
import { useState, useEffect } from "react";
import { UserProfile } from "../types/profile";

export default function TutorDashboard({ profile }: { profile: UserProfile }) {
  const [result, setResult] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateTutorPlan = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile), 
        });
        
        const data = await response.json();
        
        if (data.error) {
          setResult(`Erro: ${data.error}`);
        } else {
          setResult(data.tutorResponse || "Nenhuma resposta gerada.");
          setCourses(data.recommendedCourses || []);
        }
      } catch (err) {
        setResult("Ocorreu um erro ao conectar com o Tutor de IA.");
      } finally {
        setLoading(false);
      }
    };

    if (!result) {
      generateTutorPlan();
    }
  }, [profile, result]);

  return (
    <div className="space-y-10">
      {/* Exibição do Plano Gerado pela IA */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-400 font-medium">Analisando sua base de dados e criando seu plano...</p>
        </div>
      ) : (
        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Plano de Estudos Personalizado</h2>
          <pre className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed text-lg">
            {result}
          </pre>
        </div>
      )}

      {/* Seção de Cursos Recomendados */}
      {!loading && courses.length > 0 && (
        <section className="animate-fade-in border-t border-slate-800 pt-10">
          <h3 className="text-2xl font-bold text-white mb-8">Materiais recomendados na CEFIS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all flex flex-col shadow-lg">
                {/* Imagem do Curso */}
                <div className="relative h-48 w-full">
                  <img src={course.banner} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-white font-bold border border-white/10">
                    {course.lessonCount || 0} aulas
                  </div>
                </div>
                
                {/* Detalhes */}
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="font-bold text-xl text-white mb-3 line-clamp-2">{course.title}</h4>
                  
                  {course.teacher && (
                    <div className="flex items-center gap-3 mb-5">
                      <img src={course.teacher.avatar} alt={course.teacher.name} className="w-8 h-8 rounded-full border border-slate-600" />
                      <span className="text-sm text-slate-400 font-medium">{course.teacher.name}</span>
                    </div>
                  )}

                  <p className="text-sm text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                    {course.summary}
                  </p>
                  
                  {/* Botão de Ação */}
                  {course.firstLessonVideo && (
                    <a 
                      href={course.firstLessonVideo} 
                      target="_blank" 
                      rel="noreferrer"
                      className="mt-auto block w-full text-center bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-blue-500/20"
                    >
                      Assistir Aula 1
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}