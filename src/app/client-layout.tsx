"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import AIAssistant from "@/components/AIAssistant";

/**
 * ClientLayout — wraps children with the preloader animation.
 * Separated from RootLayout so RootLayout can remain a server component
 * and export Next.js metadata.
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

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
