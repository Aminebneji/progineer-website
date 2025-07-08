"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        })

        if (res?.error) {
            setError("Identifiants invalides.")
        } else {
            router.push("/")
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-[350px] p-4">
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit">Se connecter</Button>
                    </form>
                    <p>pas de compte ? <Link href={"/register"}>inscrivez vous</Link> !</p>
                </CardContent>
            </Card>
        </div>
    )
}
