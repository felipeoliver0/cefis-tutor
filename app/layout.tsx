// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Tutor | CEFIS",
  description: "Hackathon de Inovação em Aprendizado CEFIS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-blue-500/30`}>
        
        {/* Cabeçalho High-Tech */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* O container com w-32 h-10 trava a logo para nunca explodir de tamanho */}
              <div className="relative w-32 h-10 flex items-center">
                <Image
                  src="/logo-cefis-w.svg"
                  alt="Logo CEFIS"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>
              <div className="hidden sm:flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                <span className="text-sm font-bold text-blue-400 tracking-widest uppercase">
                  AI Tutor Engine
                </span>
              </div>
            </div>
            
            <nav className="text-xs font-mono text-slate-400 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700 shadow-inner">
              HACKATHON_2026 // SYSTEM_ONLINE
            </nav>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-6 flex flex-col mt-4">
          {children}
        </main>

        {/* Rodapé Tech */}
        <footer className="bg-slate-950 border-t border-slate-800/80 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
            <div className="relative w-10 h-10 opacity-30 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/simbolo-solo-cefis.svg"
                alt="Símbolo CEFIS"
                fill
                className="object-contain invert"
              />
            </div>
            <p className="text-slate-500 text-xs font-mono text-center max-w-md">
              Acreditamos que a educação muda trajetórias. 
              <br />Desenvolvido para o Hackathon CEFIS.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}