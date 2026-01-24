"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import AppIcon from "@/components/ui/AppIcon";

const links = [
    { name: "About", href: "/about" },
    { name: "Media", href: "/media" },
    { name: "Stories", href: "/stories" },
    { name: "Join", href: "/join" },
    { name: "Alumni", href: "/alumni" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
            isScrolled ? "mt-2 md:mt-4" : "mt-0"
        )}>
            <div className={cn(
                "max-w-6xl mx-auto rounded-full transition-all duration-700 flex items-center justify-between px-6 py-3 md:px-8 md:py-4",
                isScrolled ? "glass-card-elevated shadow-lg" : "bg-transparent"
            )}>
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform duration-500">
                        <Image
                            src="/brand/AFLEWO LOGO 1-Photoroom.png"
                            alt="AFLEWO"
                            fill
                            className="object-contain"
                        />
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1 xl:gap-2">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group",
                                    isActive
                                        ? "text-gold bg-gold/5"
                                        : "text-white/60 hover:text-white"
                                )}
                            >
                                {link.name}
                                {isActive && (
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-4">
                    <button className="hidden sm:block press-scale bg-white text-brown px-6 md:px-8 py-2 md:py-3 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-glow hover:bg-gold transition-all">
                        Connect
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-white hover:text-gold transition-colors"
                    >
                        <AppIcon name={isMobileMenuOpen ? "close" : "menu"} size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 bg-background/95 backdrop-blur-xl z-[60] flex flex-col items-center justify-center gap-8 transition-all duration-500",
                isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-8 right-8 p-2 text-white/50 hover:text-gold transition-colors"
                >
                    <AppIcon name="close" size={32} />
                </button>

                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                                "text-3xl font-black uppercase tracking-[0.3em] transition-all hover:scale-110",
                                isActive ? "text-gold scale-110" : "text-white/60 hover:text-gold"
                            )}
                        >
                            {link.name}
                        </Link>
                    );
                })}

                <button className="press-scale bg-white text-brown px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-glow mt-8">
                    Connect Now
                </button>
            </div>
        </nav>
    );
}
