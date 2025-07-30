'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Card, CardContent } from '@/components/ui/card';

export default function RegisterPage() {
    const router: AppRouterInstance = useRouter();
    const [form, setForm] = useState({ email: '', password: '', name: '', telephone: '' });

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        const res: Response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(form),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) router.push('/login');
        else alert('Inscription échouée');
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-[350px] p-4">
                <CardContent>
                    <form onSubmit={handleRegister} className="max-w-sm mx-auto mt-10 space-y-4">
                        <Input placeholder="Nom" onChange={event => setForm({ ...form, name: event.target.value })} />
                        <Input placeholder="Email (ex: john.doe@email.com)" onChange={event => setForm({ ...form, email: event.target.value })} />
                        <Input type="tel" placeholder="Téléphone (ex: 0612345678)" pattern="^(\+33|0)[1-9](\d{2}){4}$" onChange={event => setForm({ ...form, telephone: event.target.value })} />
                        <Input type="password" placeholder="Mot de passe" onChange={event => setForm({ ...form, password: event.target.value })} />
                        <Button type="submit">S'inscrire</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
