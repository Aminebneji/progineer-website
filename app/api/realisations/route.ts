import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/realisations
export async function GET() {
  const realisations = await prisma.realisation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      prestation: true,
    },
  });
  return NextResponse.json(realisations);
}


// POST /api/realisations
export async function POST(req: Request) {
  const body = await req.json();
  const {
    title,
    description,
    imageUrl,
    localisation,
    prestation,
    seoTitle,
    seoDescription,
    seoKeywords,
  } = body;

  const foundPrestation = await prisma.prestation.findFirst({
    where: {
      categorie: {
        equals: prestation,
        mode: "insensitive",
      },
    },
  });

  if (!foundPrestation) {
    return NextResponse.json({ error: "Prestation not found" }, { status: 400 });
  }

  const newRealisation = await prisma.realisation.create({
    data: {
      title,
      description,
      imageUrl,
      localisation,
      prestationId: foundPrestation.id,
      seoTitle: seoTitle ?? title,
      seoDescription: seoDescription ?? description,
      seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : (seoKeywords ?? "").split(",").map((kw: string) => kw.trim()),
      seoImage: imageUrl,
    },
  });

  return NextResponse.json(newRealisation);
}