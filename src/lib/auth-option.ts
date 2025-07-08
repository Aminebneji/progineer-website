import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email et mot de passe requis");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("Utilisateur non trouvé ou mot de passe manquant");
                }

                const isValid = await compare(credentials.password, user.password);
                if (!isValid) return null;

                return user;
            },
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
            }
            return token
        },
        session({ session, token }) {

            if (session?.user && token?.id && token?.role) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }

            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}
