// app/api/download-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal, experience, diagnostic, modules } = body;

    // Monta o arquivo de texto estruturado simulando o documento oficial da CEFIS
    const documentBody = `
======================================================
     CEFIS AI TUTOR - CRONOGRAMA DE PLANO DE ESTUDO   
======================================================
Objetivo Alvo: ${goal || "Não especificado"}
Nível Operacional: ${experience || "Não especificado"}
Data de Emissão: ${new Date().toLocaleDateString("pt-BR")}

------------------------------------------------------
DIAGNÓSTICO DA IA:
------------------------------------------------------
${diagnostic || "Nenhum diagnóstico gerado."}

------------------------------------------------------
MÓDULOS RECOMENDADOS DA PLATAFORMA CEFIS:
------------------------------------------------------
${modules && modules.length > 0 
  ? modules.map((m: any, i: number) => `${i+1}. ${m.title}\n   Aula: ${m.lessonTitle} (ID: #${m.lessonId})\n`).join("\n")
  : "Nenhum módulo selecionado."
}
======================================================
   Foco nos resultados. Bons estudos! // CEFIS 2026   
======================================================
    `.trim();

    return new NextResponse(documentBody, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="Plano_Estudos_CEFIS.txt"`,
      },
    });

  } catch (error) {
    console.error("Erro ao exportar arquivo:", error);
    return NextResponse.json({ error: "Erro interno ao gerar o arquivo." }, { status: 500 });
  }
}