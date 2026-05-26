"use client";
import { useState, useEffect } from "react";
import { UserProfile } from "../types/profile";
import { availableCourses } from "../data/courses"; // Importa os cursos reais

export default function TutorDashboard({ profile }: { profile: UserProfile }) {
  // ... (mantenha a lógica da IA que já está funcionando) ...

  // Novo Sistema de Recomendação Inteligente
  const subjectTerm = profile.subject.toLowerCase();
  
  const recommendedCourses = availableCourses.filter(course => {
    const titleMatch = course.title.toLowerCase().includes(subjectTerm);
    const keywordMatch = course.keywords.toLowerCase().includes(subjectTerm);
    return titleMatch || keywordMatch;
  });

  return (
    <div className="space-y-10">
      
      {/* ... (Renderização do Texto da IA) ... */}

      {/* Biblioteca de Cursos Dinâmica */}
      <section className="animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-6">Trilhas Recomendadas na CEFIS</h3>
        
        {recommendedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => {
              
              // Pega o vídeo em HD (se existir) da primeira aula
              const firstLesson = course.lessons[0];
              const hdVideoUrl = firstLesson?.stream_sources.find(s => s.quality === "hd")?.link_secure || 
                                 firstLesson?.stream_sources[0]?.link_secure;

              return (
                <div key={course.id} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all flex flex-col">
                  {/* Banner do Curso */}
                  <div className="relative h-40 w-full">
                    <img src={course.banner} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-bold">
                      {course.lessons.length} Aula(s)
                    </div>
                  </div>
                  
                  {/* Informações */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h4 className="font-bold text-lg text-white mb-1 line-clamp-2">{course.title}</h4>
                    
                    {/* Instrutor */}
                    <div className="flex items-center gap-2 mb-4 mt-2">
                      <img src={course.teacher.avatar} alt={course.teacher.name} className="w-6 h-6 rounded-full" />
                      <span className="text-sm text-slate-400">{course.teacher.name}</span>
                    </div>

                    <p className="text-sm text-slate-400 mb-6 line-clamp-3">{course.summary}</p>
                    
                    {/* Botão de Ação usando a URL segura do JSON */}
                    <div className="mt-auto">
                      <a 
                        href={hdVideoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block w-full text-center bg-slate-800 hover:bg-blue-600 py-3 rounded-xl font-bold text-white transition-colors"
                      >
                        Assistir Aula 1
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 border border-dashed border-slate-700 rounded-2xl text-center">
            <p className="text-slate-400">
              Ainda não mapeamos cursos de <strong className="text-white">{profile.subject}</strong> no catálogo local.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}