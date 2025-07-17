import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/articles
export async function GET() {
    const articles = await prisma.article.findMany({
        orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(articles);
}

// POST /api/articles
export async function POST(req: Request) {
    const body = await req.json();
    const { title, description, imageUrl, content, seoTitle, seoDescription, seoKeywords } = body;

    const newArticle = await prisma.article.create({
        data: {
            title,
            description,
            content,
            imageUrl,
            seoTitle: seoTitle ?? title,
            seoDescription: seoDescription ?? description,
            seoKeywords: Array.isArray(body.seoKeywords) ? body.seoKeywords.map((kw: string) => kw.trim()) : (body.seoKeywords ?? "").split(",").map((kw: string) => kw.trim()).filter(Boolean), seoImage: imageUrl,
        },
    });

    return NextResponse.json(newArticle);
}