import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import "./globals.css";
import ReactQueryProvider from "@/providers/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "N3XA Support Agent",
  description: "AI-powered customer support app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ReactQueryProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground`}
        >
          <nav className="w-full p-4 sm:p-6 border-b border-white/[.145] bg-background">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="font-bold text-lg sm:text-xl font-[family-name:var(--font-geist-mono)]">
                N3XA Support
              </div>
              <div className="flex gap-3 sm:gap-4 text-sm sm:text-base">
                <Link
                  href="/chat"
                  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#ccc] font-medium h-9 sm:h-10 px-4 sm:px-5"
                >
                  Support Chat
                </Link>
                <Link
                  href="/admin-dashboard"
                  className="rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent font-medium h-9 sm:h-10 px-4 sm:px-5"
                >
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </nav>
          <main className="mx-auto">{children}</main>
        </body>
      </ReactQueryProvider>
    </html>
  );
}
