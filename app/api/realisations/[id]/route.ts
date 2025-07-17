import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function handleServerError(error: unknown) {
  console.error(error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const realisation = await prisma.realisation.findUnique({ where: { id: params.id } });

    if (!realisation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(realisation);
  } catch (error) {
    console.error(error);
    return handleServerError(error);
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    const updated = await prisma.realisation.update({
      where: { id: params.id },
      data: {
        ...body,
        services: Array.isArray(body.services) ? body.services.map((s: string) => s.trim()) : (body.services ?? "").split(",").map((s: string) => s.trim()),
        seoKeywords: Array.isArray(body.seoKeywords) ? body.seoKeywords : (body.seoKeywords ?? "").split(",").map((kw: string) => kw.trim()),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur PUT prestation :", error);
    return handleServerError(error);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.realisation.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
