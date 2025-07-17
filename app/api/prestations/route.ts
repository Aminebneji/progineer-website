import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/prestations
export async function GET() {
    try {
        const prestations = await prisma.prestation.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(prestations);
    } catch (error) {
        console.error("Erreur GET prestations :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST /api/prestations
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            title,
            slug,
            categorie,
            description,
            icon,
            imageUrl,
            services,
            published,
            order,
            seoTitle,
            seoDescription,
            seoKeywords,
            seoImage,
        } = body;

        const prestation = await prisma.prestation.create({
            data: {
                title,
                slug,
                categorie,
                description,
                icon,
                imageUrl,
                services: Array.isArray(services) ? services.map((s: string) => s.trim()) : (services ?? "").split(",").map((s: string) => s.trim()),
                published: Boolean(published),
                order: order ? Number(order) : undefined,
                seoTitle,
                seoDescription,
                seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : (seoKeywords ?? "").split(",").map((kw: string) => kw.trim()),
                seoImage: imageUrl ?? seoImage,
            },
        });

        return NextResponse.json(prestation);
    } catch (error) {
        console.error("Erreur POST prestation :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
