import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: 'USER' | 'ADMIN';
            email: string;
            name?: string | null;
        };
    }

    interface User {
        id: string;
        role: 'USER' | 'ADMIN';
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: 'USER' | 'ADMIN';
    }
}
