import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function handleServerError(error: unknown) {
  console.error(error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const article = await prisma.article.findUnique({ where: { id: params.id } });

    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(article);
  } catch (error) {
    console.error(error);
    return handleServerError(error);
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    const updated = await prisma.article.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        imageUrl: body.imageUrl,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        seoKeywords: body.seoKeywords.split(",").map((kw: string) => kw.trim()),
        seoImage: body.imageUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return handleServerError(error);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.article.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return handleServerError(error);
  }
}
