import { hash } from "bcryptjs";
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { email, password, name } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword: string = await hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role: 'USER',
        }
    });

    return NextResponse.json({ success: true });
}
