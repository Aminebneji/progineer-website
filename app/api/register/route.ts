import { hash } from "bcryptjs";
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { email, password, name, telephone } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 });
    }

    const frenchPhoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
    if (!frenchPhoneRegex.test(telephone)) {
        return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 });
    }

    const existingPhone = await prisma.user.findFirst({ where: { telephone } });
    if (existingPhone) {
        return NextResponse.json({ error: 'Numéro de téléphone déjà utilisé' }, { status: 400 });
    }

    const hashedPassword: string = await hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            name,
            telephone,
            password: hashedPassword,
            role: 'USER',
        }
    });

    return NextResponse.json({ success: true });
}
