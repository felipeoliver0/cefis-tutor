// app/api/download-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Interface para garantir a tipagem do m e do i no map, limpando o erro do TS
interface UIPlanModule {
  id: string;
  studyPlanId: string;
  title: string;
  duration: string;
  lessonTitle: string;
  lessonId: number;
  badge: string;
  isCompleted: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const planId = searchParams.get("planId");

    if (!planId) {
      return NextResponse.json({ error: "ID do plano ausente." }, { status: 400 });
    }

    // Usando cast 'as any' temporário para o TypeScript aceitar a chamada antes do npx prisma generate rodar 100% local
    const plan = await (prisma as any).studyPlan.findUnique({
      where: { id: planId },
      include: { modules: true }
    });

    if (!plan) {
      return NextResponse.json({ error: "Plano de estudos não encontrado." }, { status: 404 });
    }

    // Monta o arquivo de texto estruturado simulando o documento de estudos da CEFIS
    const documentBody = `
======================================================
     CEFIS AI TUTOR - CERTIFICADO DE PLANO DE ESTUDO   
======================================================
Objetivo Alvo: ${plan.goal}
Nível Operacional: ${plan.experience}
Disponibilidade Mapeada: ${plan.timeAvailable}
Estilo de Conteúdo: ${plan.learningStyle}
Data de Emissão: ${new Date(plan.createdAt).toLocaleDateString("pt-BR")}

------------------------------------------------------
DIAGNÓSTICO E CRONOGRAMA DA IA:
------------------------------------------------------
${plan.diagnostic}

------------------------------------------------------
CRONOGRAMA DE AULAS SINCRONIZADAS CEFIS:
------------------------------------------------------
${plan.modules.map((m: UIPlanModule, i: number) => `${i+1}. ${m.title}\n   Aula: ${m.lessonTitle} (ID: #${m.lessonId})\n   Status: [ ] Não Concluído`).join("\n")}

======================================================
   Foco nos resultados. Bons estudos! // CEFIS 2026   
======================================================
    `.trim();

    return new NextResponse(documentBody, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="Plano_Estudos_CEFIS_${planId.substring(0,6)}.txt"`,
      },
    });

  } catch (error) {
    console.error("Erro ao gerar arquivo para download:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}