"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";

export default function MobileNavbar() {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "ADMIN";

    return (
        <div className="flex w-full justify-between items-center">
            <Link href="/" className="font-semibold text-lg">Home</Link>
            <div className="flex items-center gap-2">
                <ModeToggle />
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="top" className="p-4">
                        <SheetHeader>
                            <SheetTitle className="text-left text-lg">Menu</SheetTitle>
                        </SheetHeader>

                        <nav className="mt-4 grid gap-3">
                            <Link href="/" className="text-sm" onClick={() => document.body.click()}>
                                Accueil
                            </Link>

                            <Link href="/realisations" className="text-sm" onClick={() => document.body.click()}>
                                Réalisations
                            </Link>

                            {isAdmin && (
                                <div className="mt-2">
                                    <p className="text-xs text-muted-foreground mb-1">Admin</p>
                                    <div className="grid gap-1 pl-2 text-sm">
                                        <Link href="/admin/articles" onClick={() => document.body.click()}>Articles</Link>
                                        <Link href="/admin/realisations" onClick={() => document.body.click()}>Réalisations</Link>
                                        <Link href="/admin/prestations" onClick={() => document.body.click()}>Prestations</Link>
                                        <Link href="/admin/users" onClick={() => document.body.click()}>Utilisateurs</Link>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 flex flex-col gap-1 text-sm">
                                {session ? (
                                    <>
                                        <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => signOut()}
                                            className="w-fit"
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Link href="/login" onClick={() => document.body.click()}>
                                        Login
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
