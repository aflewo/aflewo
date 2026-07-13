"use client";

import { useState, useEffect } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import AIAssistant from "@/components/AIAssistant";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * ClientLayout — wraps children with the preloader animation and global smooth scrolling.
 * Separated from RootLayout so RootLayout can remain a server component
 * and export Next.js metadata.
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [loading]);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div
        className={
          loading
            ? "opacity-0 invisible h-0 overflow-hidden"
            : "opacity-100 visible transition-all duration-1000 ease-out"
        }
      >
        <Navbar />
        {children}
        {/* AI assistant — rendered globally, always accessible */}
        <AIAssistant />
      </div>
    </>
  );
}
