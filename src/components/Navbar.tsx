"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!mounted) return null;

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
            isScrolled ? "py-4" : "py-8"
        )}>
            <div className={cn(
                "max-w-6xl mx-auto rounded-lg transition-all duration-700 flex items-center justify-between px-6 py-4",
                isScrolled ? "glass-card-elevated shadow-2xl" : "bg-transparent"
            )}>
                {/* Brand Logo - PNG Variant */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-500">
                        <Image
                            src="/brand/AFLEWO LOGO 1-Photoroom.png"
                            alt="AFLEWO"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "relative text-[10px] font-black uppercase tracking-[0.3em] transition-all",
                                    isActive ? "text-gold" : "text-foreground/50 hover:text-gold"
                                )}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-active"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-3 rounded-lg glass-card text-gold hover:bg-gold hover:text-brown transition-all border border-white/5"
                    >
                        <AppIcon name={theme === "dark" ? "light-mode" : "dark-mode"} size={18} />
                    </button>

                    <Link
                        href="/join"
                        className="hidden sm:block press-scale bg-gold text-brown px-8 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-glow hover:brightness-110 transition-all"
                    >
                        Join Altar
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-3 rounded-lg glass-card text-foreground/60 hover:text-gold transition-colors border border-white/5"
                    >
                        <AppIcon name={isMobileMenuOpen ? "close" : "menu"} size={20} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 bg-background/98 backdrop-blur-3xl z-[60] flex flex-col items-center justify-center gap-12 transition-all duration-700",
                isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
            )}>
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-8 right-8 p-4 rounded-full glass-card text-gold hover:rotate-90 transition-all duration-500"
                >
                    <AppIcon name="close" size={24} />
                </button>

                <div className="flex flex-col items-center gap-4">
                    <Image
                        src="/brand/AFLEWO LOGO 1-Photoroom.png"
                        alt="AFLEWO"
                        width={60}
                        height={60}
                        className="object-contain"
                    />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold/60">EST. 2004</span>
                </div>

                <div className="flex flex-col items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-4xl font-black uppercase tracking-[0.4em] text-foreground/40 hover:text-gold transition-all hover:scale-105"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6 mt-12">
                    <button className="press-scale bg-gold text-brown px-16 py-6 rounded-lg font-black text-xs uppercase tracking-[0.3em] shadow-glow">
                        Register Now
                    </button>
                    <div className="flex gap-4">
                        <AppIcon name="public" size={20} className="text-white/20" />
                        <AppIcon name="favorite" size={20} className="text-white/20" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
