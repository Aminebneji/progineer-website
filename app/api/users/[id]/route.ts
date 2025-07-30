import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { email, name, telephone, role, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user) {
        return errorResponse("Utilisateur introuvable", 404);
    }

    const validationError = await validateUserData(email, telephone, params.id);
    if (validationError) {
        return errorResponse(validationError, 400);
    }

    const updateData: any = { email, name, telephone, role };

    if (password?.trim()) {
        updateData.password = await hash(password, 10);
    }

    const updated = await prisma.user.update({
        where: { id: params.id },
        data: updateData,
    });

    return NextResponse.json(updated);
}

async function validateUserData(email: string, telephone: string, userId: string): Promise<string | null> {
    const emailUsed = await prisma.user.findFirst({
        where: { email, NOT: { id: userId } },
    });
    if (emailUsed) return "Email déjà utilisé par un autre utilisateur";

    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
    if (!phoneRegex.test(telephone)) return "Numéro de téléphone invalide";

    const phoneUsed = await prisma.user.findFirst({
        where: { telephone, NOT: { id: userId } },
    });
    if (phoneUsed) return "Téléphone déjà utilisé";

    return null;
}

function errorResponse(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}
