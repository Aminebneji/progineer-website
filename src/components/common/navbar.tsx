"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <NavigationMenu className="flex justify-between w-full px-4 py-2 border-b">
            <NavigationMenuList className="flex items-center gap-4">
                <NavigationMenuItem>
                    <NavigationMenuLink href="/">Home</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Realisations</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink href="/realisations">Last Realisations</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>

            <div className="flex items-center gap-2">
                <ModeToggle />
                {session ? (
                    <>
                        <span className="text-sm text-muted-foreground">{session.user?.email}</span>
                        <Button variant="outline" size="sm" onClick={() => signOut()}>Logout</Button>
                    </>
                ) : (
                    <NavigationMenuLink href="/login">Login</NavigationMenuLink>
                )}
            </div>
        </NavigationMenu>
    );
}
