"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {cn} from '@/lib/utils'
import {Toaster} from "sonner";
import {ThemeProvider} from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/common/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" className="h-full">
      <body
        className={cn(geistSans.variable, geistMono.variable, "antialiased", "h-full")}
      >
      <SessionProvider>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
           <Navbar/>
            {children}
      <Toaster/>
        </ThemeProvider>
          </SessionProvider>
      </body>
    </html>
  );
}
