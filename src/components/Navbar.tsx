"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AppIcon from "@/components/ui/AppIcon";

const links = [
    { name: "About", href: "/about" },
    { name: "Media", href: "/media" },
    { name: "Stories", href: "/stories" },
    { name: "Join", href: "/join" },
    { name: "Alumni", href: "/alumni" },
    { name: "Connect", href: "/#chapters" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!mounted) return null;

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-[50] transition-all duration-500 px-6",
                isScrolled ? "py-4 bg-background/80 backdrop-blur-xl border-b border-white/5" : "py-8 bg-transparent"
            )}
        >
            <div className="max-container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative w-10 h-10 group-hover:rotate-6 transition-transform duration-500">
                        <Image
                            src="/brand/AFLEWO LOGO 1-Photoroom.png"
                            alt="AFLEWO"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-white">AFLEWO</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "relative text-[10px] font-black uppercase tracking-[0.3em] transition-all py-2",
                                    isActive ? "text-gold" : "text-foreground/50 hover:text-gold"
                                )}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-active"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle - iOS Inspired */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-3 rounded-full glass-card text-gold hover:bg-gold hover:text-brown transition-all border border-white/10"
                    >
                        <AnimatePresence mode="wait">
                            {theme === "dark" ? (
                                <motion.div
                                    key="sun"
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <AppIcon name="light_mode" size={18} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="moon"
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <AppIcon name="dark_mode" size={18} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    <Link
                        href="/join"
                        className="hidden md:flex px-6 py-3 bg-gold text-brown rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-glow"
                    >
                        Connect Now
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-3 rounded-full glass-card text-foreground/60 hover:text-gold transition-colors border border-white/10"
                    >
                        <AppIcon name={isMobileMenuOpen ? "close" : "menu"} size={20} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu - iOS Style */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center p-10"
                    >
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-8 right-8 p-4 rounded-full glass-card text-gold hover:rotate-90 transition-all duration-500"
                        >
                            <AppIcon name="close" size={24} />
                        </button>

                        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                            {links.map((link, i) => {
                                const isActive = pathname === link.href;
                                return (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="w-full"
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "block text-center py-4 text-3xl font-black tracking-tighter transition-all uppercase",
                                                isActive ? "text-gold" : "text-foreground/40 hover:text-white"
                                            )}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                );
                            })}

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: links.length * 0.1 }}
                                className="w-full py-6 bg-gold text-brown rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-glow mt-8"
                            >
                                Register Now
                            </motion.button>
                            <div className="flex gap-6 mt-4">
                                <AppIcon name="public" size={24} className="text-white/20" />
                                <AppIcon name="favorite" size={24} className="text-white/20" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
