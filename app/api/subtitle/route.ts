import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("path"); // Recebe o caminho completo do arquivo

  if (!filePath || !fs.existsSync(filePath)) {
    return new NextResponse("Arquivo não encontrado", { status: 404 });
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  return new NextResponse(fileContent, {
    headers: {
      "Content-Type": "text/vtt",
    },
  });
}