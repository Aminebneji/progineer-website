"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";

function ListItem({title, children, href, ...props}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent"
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}

export default function Navbar() {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "ADMIN";

    return (
        <div className="flex justify-between items-center w-full px-4 py-2 border-b">
            <NavigationMenu>
                <NavigationMenuList className="flex items-center gap-4">
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/">Home</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Realisations</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-2 w-[300px] p-4">
                                <ListItem title="Dernières réalisations" href="/realisations">
                                    Nos derniers projets et chantiers livrés.
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {isAdmin && (
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="text-red-600 hover:text-red-800 font-semibold">
                                Admin
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-2 w-[300px] p-4">
                                    <ListItem title="Articles" href="/admin/articles">
                                        Gérer et modifier les articles du site.
                                    </ListItem>
                                    <ListItem title="Realisations" href="/admin/realisations">
                                        Gérer et modifier les realisation présentes sur le site.
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    )}
                </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-4">
                <ModeToggle />
                {session ? (
                    <>
                        <span className="text-sm text-muted-foreground">{session.user?.email}</span>
                        <Button variant="outline" size="sm" onClick={() => signOut()}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Link href="/login" className={navigationMenuTriggerStyle()}>
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
}
