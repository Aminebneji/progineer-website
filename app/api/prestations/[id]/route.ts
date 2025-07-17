import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


function handleServerError(error: unknown) {
  console.error(error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}


export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  try {
    const prestation = await prisma.prestation.findUnique({ where: { id: resolvedParams.id } });
    if (!prestation) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(prestation);
  } catch (error) {
    console.error("Erreur GET prestation par ID :", error);
    handleServerError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;

  const body = await request.json();

  const updated = await prisma.prestation.update({
    where: { id: resolvedParams.id },
    data: {
      ...body,
      services: Array.isArray(body.services)
        ? body.services.map((s: string) => s.trim())
        : (body.services ?? "").split(",").map((s: string) => s.trim()),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  try {
    await prisma.prestation.delete({ where: { id: resolvedParams.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE prestation :", error);
    handleServerError(error);
  }
}
