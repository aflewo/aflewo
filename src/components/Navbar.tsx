"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const navItems = [
    { label: "About",   href: "/about",   rotation: -6  },
    { label: "Media",   href: "/media",   rotation: 5   },
    { label: "Stories", href: "/stories", rotation: -5  },
    { label: "Join",    href: "/join",    rotation: 6   },
    { label: "Alumni",  href: "/alumni",  rotation: -6  },
    { label: "Chapters",href: "/#chapters",rotation: 5  },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const overlayRef   = useRef<HTMLDivElement>(null);
    const pillRefs     = useRef<(HTMLAnchorElement | null)[]>([]);
    const labelRefs    = useRef<(HTMLSpanElement | null)[]>([]);
    const lineRef1     = useRef<HTMLSpanElement>(null);
    const lineRef2     = useRef<HTMLSpanElement>(null);

    useEffect(() => { setMounted(true); }, []);

    // Animate open / close
    useEffect(() => {
        if (!mounted) return;
        const overlay = overlayRef.current;
        const pills   = pillRefs.current.filter(Boolean) as HTMLAnchorElement[];
        const labels  = labelRefs.current.filter(Boolean) as HTMLSpanElement[];
        const l1 = lineRef1.current;
        const l2 = lineRef2.current;

        if (isOpen) {
            // Lock scroll
            document.body.style.overflow = "hidden";

            gsap.set(overlay, { display: "flex", opacity: 0 });
            gsap.to(overlay,  { opacity: 1, duration: 0.3, ease: "power2.out" });

            gsap.set(pills,  { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
            gsap.set(labels, { y: 28, autoAlpha: 0 });

            pills.forEach((pill, i) => {
                const delay = i * 0.09 + (Math.random() * 0.04 - 0.02);
                gsap.to(pill,  { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.6)", delay });
                gsap.to(labels[i], { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out", delay: delay + 0.08 });
            });

            // Hamburger → X
            if (l1 && l2) {
                gsap.to(l1, { rotation: 45,  y: 3.75, duration: 0.35, ease: "power3.out" });
                gsap.to(l2, { rotation: -45, y: -3.75, duration: 0.35, ease: "power3.out" });
            }
        } else {
            document.body.style.overflow = "";

            if (l1 && l2) {
                gsap.to(l1, { rotation: 0, y: 0, duration: 0.3, ease: "power3.in" });
                gsap.to(l2, { rotation: 0, y: 0, duration: 0.3, ease: "power3.in" });
            }

            gsap.to(labels, { y: 28, autoAlpha: 0, duration: 0.18, ease: "power3.in" });
            gsap.to(pills,  {
                scale: 0, opacity: 0, duration: 0.22, ease: "power3.in",
                onComplete: () => gsap.set(overlay, { display: "none" })
            });
        }
    }, [isOpen, mounted]);

    // Close on route change
    useEffect(() => { setIsOpen(false); }, [pathname]);

    const close = useCallback(() => setIsOpen(false), []);

    if (!mounted) return null;

    return (
        <>
            {/* ── Fixed nav bar ── */}
            <nav
                className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-5 md:px-8 py-4 pointer-events-none"
                aria-label="Main navigation"
            >
                {/* Logo bubble */}
                <Link
                    href="/"
                    aria-label="AFLEWO Home"
                    className="pointer-events-auto relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5 flex items-center justify-center hover:border-gold/40 hover:scale-105 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                    onClick={(e) => {
                        if (pathname === "/") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
                    }}
                >
                    <Image
                        src="/brand/AFLEWO LOGO 1-Photoroom.png"
                        alt="AFLEWO"
                        fill
                        sizes="56px"
                        className="object-contain p-2"
                        priority
                    />
                </Link>

                {/* Hamburger bubble */}
                <button
                    type="button"
                    aria-label="Toggle navigation"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((v) => !v)}
                    className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center gap-[6px] hover:border-gold/40 hover:scale-105 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                >
                    <span ref={lineRef1} className="block w-[22px] h-[1.5px] bg-white rounded-full" style={{ transformOrigin: "center" }} />
                    <span ref={lineRef2} className="block w-[14px] h-[1.5px] bg-white rounded-full self-end mr-[4px]" style={{ transformOrigin: "center" }} />
                </button>
            </nav>

            {/* ── Full-screen pill overlay ── */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-[190] items-center justify-center bg-black/75 backdrop-blur-2xl"
                style={{ display: "none" }}
                onClick={(e) => { if (e.target === e.currentTarget) close(); }}
                aria-hidden={!isOpen}
            >
                <div className="w-full max-w-5xl mx-auto px-6 md:px-12">
                    {/* Pill grid */}
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mb-10" role="menu">
                        {navItems.map((item, i) => {
                            const isActive = pathname === item.href || (item.href.startsWith("/#") && pathname === "/");
                            return (
                                <li key={item.href} role="none" className="flex">
                                    <Link
                                        href={item.href}
                                        role="menuitem"
                                        ref={(el) => { pillRefs.current[i] = el; }}
                                        onClick={close}
                                        aria-label={item.label}
                                        aria-current={isActive ? "page" : undefined}
                                        className={`
                                            group w-full min-h-[110px] md:min-h-[130px] flex items-center justify-center
                                            rounded-[2.5rem] border backdrop-blur-xl
                                            text-sm md:text-base font-black uppercase tracking-[0.15em]
                                            transition-all duration-300
                                            ${isActive
                                                ? "bg-gold text-brown border-gold/60 shadow-[0_0_40px_rgba(251,191,36,0.3)]"
                                                : "bg-white/5 border-white/10 text-white hover:bg-gold hover:text-brown hover:border-gold/60 hover:shadow-[0_0_40px_rgba(251,191,36,0.2)]"
                                            }
                                        `}
                                        style={{
                                            transform: `rotate(${item.rotation}deg)`,
                                            willChange: "transform, opacity",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) gsap.to(e.currentTarget, { rotation: 0, scale: 1.04, duration: 0.3, ease: "power2.out" });
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) gsap.to(e.currentTarget, { rotation: item.rotation, scale: 1, duration: 0.35, ease: "power2.out" });
                                        }}
                                    >
                                        <span
                                            ref={(el) => { labelRefs.current[i] = el; }}
                                            className="block will-change-transform"
                                        >
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Connect CTA */}
                    <div className="flex justify-center">
                        <Link
                            href="/join"
                            onClick={close}
                            className="press-scale px-16 py-5 bg-white text-brown rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-gold transition-all duration-300 shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
                        >
                            Connect Now
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
