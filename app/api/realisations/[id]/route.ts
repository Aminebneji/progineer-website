import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
    const realisation = await prisma.realisation.findUnique({ where: { id: params.id } });

    if (!realisation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(realisation);

    }catch (error){
        console.error(error);
        return
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try{
    const body = await request.json();

    const updated = await prisma.realisation.update({
        where: { id: params.id },
        data: {
            title: body.title,
            description: body.description,
            imageUrl: body.imageUrl,
        },
    });
    return NextResponse.json(updated);
    }catch (error){
        console.error(error);
        return
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try{

    await prisma.realisation.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });

    }catch (error){
        console.error(error);
        return
    }
}
