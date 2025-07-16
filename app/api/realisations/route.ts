import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/realisations
export async function GET() {
    const realisations = await prisma.realisation.findMany({
        orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(realisations);
}

// POST /api/realisations
export async function POST(req: Request) {
    const body = await req.json();
    const { title, description, content, imageUrl } = body;

    const newRealisation = await prisma.realisation.create({
        data: {
            title,
            description,
            imageUrl,
        },
    });

    return NextResponse.json(newRealisation);
}