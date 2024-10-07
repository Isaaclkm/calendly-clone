import type { Metadata } from "next";
import localFont from "next/font/local";
import {Inter} from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({subsets: ["latin"], variable: "--font-sans"})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn("min-h-screen, bg-background font-sans anstiliased", 
            inter.variable)}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
