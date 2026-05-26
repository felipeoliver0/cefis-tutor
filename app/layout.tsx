// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tutor de Aprendizado CEFIS",
  description: "Hackathon de Inovação em Aprendizado CEFIS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        
        {/* Cabeçalho Global */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo-cefis.svg"
                alt="Logo CEFIS"
                width={110}
                height={35}
                priority
                className="h-auto w-auto"
              />
              <div className="h-6 w-px bg-slate-300"></div>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-wide">
                AI TUTOR
              </span>
            </div>
            <nav className="hidden md:block text-sm font-medium text-slate-500">
              Hackathon de Inovação 2026
            </nav>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 w-full max-w-6xl mx-auto p-6 flex flex-col mt-4">
          {children}
        </main>

        {/* Rodapé Global */}
        <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm mt-auto">
          <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-4">
            <Image
              src="/simbolo-solo-cefis.svg"
              alt="Símbolo CEFIS"
              width={40}
              height={40}
              className="opacity-50 hover:opacity-100 transition-opacity"
            />
            <p className="max-w-md mx-auto">
              Desenvolvido para o Hackathon CEFIS. Acreditamos que o conhecimento deve ser acessível a todos.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}