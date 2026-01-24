"use client";

import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import "./globals.css";
import Preloader from "@/components/Preloader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} font-sans bg-background text-foreground antialiased selection:bg-gold/30 selection:text-white overflow-x-hidden`}
      >
        {loading && <Preloader onComplete={() => setLoading(false)} />}
        <div className={loading ? "opacity-0 invisible h-0" : "opacity-100 visible transition-all duration-1000 ease-out"}>
          {children}
        </div>
      </body>
    </html>
  );
}
