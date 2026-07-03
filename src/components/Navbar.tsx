"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

const links = [
    { name: "About",    href: "/about"    },
    { name: "Media",    href: "/media"    },
    { name: "Stories",  href: "/stories"  },
    { name: "Join",     href: "/join"     },
    { name: "Alumni",   href: "/alumni"   },
    { name: "Chapters", href: "/#chapters"},
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll, { passive: true });

        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsSignedIn(!!session);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setIsSignedIn(!!session);
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

    if (!mounted) return null;

    const authLink = isSignedIn
        ? { name: "Portal",  href: "/portal" }
        : { name: "Sign In", href: "/auth"   };

    const allLinks = [...links, authLink];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 px-4 md:px-6 ${
                isScrolled ? "mt-2 md:mt-4" : "mt-0"
            }`}
            aria-label="Main navigation"
        >
            <div
                className={`max-w-6xl mx-auto rounded-full transition-all duration-700 flex items-center justify-between px-5 py-3 md:px-8 md:py-3.5 ${
                    isScrolled
                        ? "glass-card-elevated shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-white/10"
                        : "bg-transparent border-transparent"
                }`}
            >
                {/* Brand Logo */}
                <Link
                    href="/"
                    aria-label="AFLEWO Home"
                    className="flex items-center gap-3 group"
                    onClick={(e) => {
                        if (pathname === "/") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
                    }}
                >
                    <div className="relative w-9 h-9 md:w-11 md:h-11 group-hover:scale-110 transition-transform duration-300">
                        <Image
                            src="/brand/AFLEWO LOGO 1-Photoroom.png"
                            alt="AFLEWO"
                            fill
                            sizes="44px"
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href || (link.href.startsWith("/#") && pathname === "/");
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`relative px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.18em] transition-all duration-200 ${
                                    isActive
                                        ? "text-gold bg-gold/10"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {link.name}
                                {isActive && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Right — CTA + Portal/SignIn + Mobile toggle */}
                <div className="flex items-center gap-3">
                    {/* Connect CTA — desktop only */}
                    <Link
                        href="/join"
                        className="hidden sm:flex press-scale items-center bg-white text-brown px-6 py-2.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-glow hover:bg-gold transition-all duration-300"
                    >
                        Connect
                    </Link>

                    {/* Auth link — desktop */}
                    <Link
                        href={authLink.href}
                        className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-gold hover:border-gold/30 transition-all duration-200"
                    >
                        {authLink.name}
                    </Link>

                    {/* Mobile menu toggle */}
                    <button
                        type="button"
                        aria-label="Toggle navigation"
                        aria-expanded={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen((v) => !v)}
                        className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-[5px] hover:border-gold/30 transition-all duration-200"
                    >
                        {isMobileMenuOpen ? (
                            /* X icon */
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            /* Hamburger */
                            <>
                                <span className="block w-[20px] h-[1.5px] bg-white rounded-full" />
                                <span className="block w-[13px] h-[1.5px] bg-white rounded-full self-end mr-[3px]" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-background/95 backdrop-blur-2xl z-[190] flex flex-col items-center justify-center gap-7 transition-all duration-400 ${
                    isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={(e) => { if (e.target === e.currentTarget) setIsMobileMenuOpen(false); }}
            >
                {/* Close button */}
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-6 right-6 w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 transition-all"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {allLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href.startsWith("/#") && pathname === "/");
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-3xl font-black uppercase tracking-[0.25em] transition-all duration-200 hover:scale-105 ${
                                isActive ? "text-gold scale-105" : "text-white/60 hover:text-gold"
                            }`}
                        >
                            {link.name}
                        </Link>
                    );
                })}

                <Link
                    href="/join"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="press-scale mt-4 bg-white text-brown px-14 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-glow hover:bg-gold transition-all duration-300"
                >
                    Connect Now
                </Link>
            </div>
        </nav>
    );
}
