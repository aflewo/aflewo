"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import MenuToggle from "@/components/ui/MenuToggle";
import SvgIcon from "@/components/ui/SvgIcon";
import GlassSurface from "@/components/GlassSurface";
import { StaggeredMenu } from "@/components/StaggeredMenu";
import { motion } from "framer-motion";

const links = [
    { name: "About", href: "/about" },
    { name: "Media", href: "/media" },
    { name: "Testimonies", href: "/testimonies" },
    { name: "Join", href: "/join" },
];

const socialItems = [
    { label: "YouTube", link: "https://youtube.com/@aflewokeke" },
    { label: "Instagram", link: "https://instagram.com/aflewoke" },
    { label: "Facebook", link: "https://facebook.com/AFLEWOKE" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

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

    // Do not render navbar on certain routes (they have their own layouts)
    const hideNavbarRoutes = ["/auth", "/profile", "/admin"];
    if (hideNavbarRoutes.some((route) => pathname.startsWith(route))) return null;

    const authLink = isSignedIn
        ? { name: "Profile", href: "/profile" }
        : { name: "Sign In", href: "/auth" };

    const allLinks = [...links, authLink];

    const toggleMenu = () => setIsMobileMenuOpen((v) => !v);

    // Staggered menu items (desktop only)
    const staggeredItems = allLinks.map(l => ({
        label: l.name,
        ariaLabel: l.name,
        link: l.href,
    }));

    // Logo element reused across tiers
    const LogoImg = (
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
    );

    return (
        <>
            {/* ── DESKTOP (lg: 1280px+): StaggeredMenu fullscreen overlay ── */}
            <div className="hidden lg:block" aria-label="Desktop navigation">
                <StaggeredMenu
                    isFixed={true}
                    position="right"
                    colors={['hsl(20 14% 5%)', 'hsl(42 92% 28%)']}
                    items={staggeredItems}
                    socialItems={socialItems}
                    displaySocials={true}
                    displayItemNumbering={true}
                    menuButtonColor="rgba(255,255,255,0.8)"
                    openMenuButtonColor="#ffffff"
                    changeMenuColorOnOpen={true}
                    accentColor="hsl(42 92% 56%)"
                    closeOnClickAway={true}
                    logoElement={
                        <Link
                            href="/"
                            aria-label="AFLEWO Home"
                            className="flex items-center gap-3 group"
                            onClick={(e) => {
                                if (pathname === "/") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
                            }}
                        >
                            <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-300">
                                <Image
                                    src="/brand/AFLEWO LOGO 1-Photoroom.png"
                                    alt="AFLEWO"
                                    fill
                                    sizes="40px"
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                    }
                />
            </div>

            {/* ── TABLET + MOBILE (< lg: 1280px): Pill nav bar ── */}
            <nav
                className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 px-4 md:px-6 lg:hidden ${isScrolled ? "mt-2 md:mt-4" : "mt-0"
                    }`}
                aria-label="Main navigation"
            >
                <div
                    className={`max-w-6xl mx-auto rounded-full transition-all duration-700 flex items-center justify-between px-5 py-3 md:px-8 md:py-3.5 border ${isScrolled ? "border-white/10 shadow-[0_8px_32px_rgba(212,175,55,0.15)]" : "bg-transparent border-transparent"
                        } relative`}
                    style={isScrolled ? { willChange: "transform" } : {}}
                >
                    {isScrolled ? (
                        <GlassSurface
                            width="100%"
                            height="100%"
                            borderRadius={50}
                            borderWidth={0.07}
                            brightness={50}
                            opacity={0.93}
                            blur={16}
                            backgroundOpacity={0.1}
                            saturation={1}
                            displace={0.5}
                            distortionScale={-180}
                            redOffset={0}
                            greenOffset={10}
                            blueOffset={20}
                            className="absolute inset-0 rounded-full"
                            style={{ position: 'absolute', inset: 0, borderRadius: '50px', zIndex: 0 }}
                        />
                    ) : null}

                    {isScrolled && (
                        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/20 to-transparent z-0 pointer-events-none" />
                    )}

                    {/* Brand Logo */}
                    <div className="relative z-10">
                        {LogoImg}
                    </div>

                    {/* Tablet Links (md: 768px–1279px) — inline pill row */}
                    <div className="relative z-10 hidden md:flex items-center gap-1">
                        {links.map((link) => {
                            const isActive = pathname === link.href || (link.href.startsWith("/#") && pathname === "/");
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.18em] transition-colors duration-200 ${isActive
                                        ? "text-gold"
                                        : "text-white/60 hover:text-white"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-gold/10 rounded-full"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right — Auth + Connect (tablet) + Mobile toggle */}
                    <div className="relative z-10 flex items-center gap-3">
                        {/* Connect CTA — tablet only */}
                        <Link
                            href="/join"
                            aria-label="Connect"
                            className="hidden sm:flex md:flex lg:hidden press-scale items-center justify-center bg-white text-brown w-9 h-9 md:w-10 md:h-10 rounded-full shadow-glow hover:bg-gold hover:text-white transition-all duration-300"
                        >
                            <SvgIcon name="user_add" size={20} />
                        </Link>

                        {/* Auth link — tablet only */}
                        <Link
                            href={authLink.href}
                            aria-label={authLink.name}
                            className="hidden md:flex lg:hidden items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-gold hover:border-gold/30 transition-all duration-200"
                        >
                            <SvgIcon name={isSignedIn ? "user" : "login"} size={18} />
                        </Link>

                        {/* Mobile menu toggle (< md: 768px) */}
                        <div className="md:hidden flex items-center justify-center">
                            <MenuToggle isOpen={isMobileMenuOpen} onToggle={toggleMenu} />
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── MOBILE full-screen overlay (< md: 768px) ── */}
            <div
                className={`fixed inset-0 bg-background/95 backdrop-blur-2xl z-[190] flex flex-col items-center justify-center gap-7 transition-all duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={(e) => { if (e.target === e.currentTarget) setIsMobileMenuOpen(false); }}
            >
                {allLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href.startsWith("/#") && pathname === "/");
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-3xl font-black uppercase tracking-[0.25em] transition-all duration-200 hover:scale-105 ${isActive ? "text-gold scale-105" : "text-white/60 hover:text-gold"
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
        </>
    );
}
