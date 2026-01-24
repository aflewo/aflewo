"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import AppIcon from "@/components/ui/AppIcon";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(".hero-content > *", {
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "expo.out"
            });

            tl.from(".hero-btn", {
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)"
            }, "-=0.6");

            gsap.to(".hero-video", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                },
                y: 100,
                opacity: 0.3,
                scale: 1.1
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background"
        >
            {/* Immersive Video Layer */}
            <div className="hero-video absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-105"
                >
                    <source src="/hero-bg.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="max-container relative z-20 text-center hero-content">
                <div className="space-y-4 mb-10">
                    <span className="block text-gold font-black uppercase tracking-[0.6em] text-[10px] md:text-xs">
                        EST. 2004 — The Prophetic House
                    </span>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                        AFRICA <br />
                        LET{"'"}S <span className="text-gold">WORSHIP</span>
                    </h1>
                    <p className="text-white/60 text-lg md:text-2xl font-medium tracking-tight max-w-2xl mx-auto italic leading-relaxed">
                        "One God. One People. One Africa. Stirring up hope in Jesus through a united voice."
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    <Link href="/media" className="hero-btn press-scale bg-white text-brown px-12 py-5 rounded-full font-black uppercase tracking-tighter flex items-center gap-3 group hover:bg-gold transition-all">
                        <AppIcon name="play_arrow" size={20} className="group-hover:scale-110 transition-transform" />
                        Watch Archive
                    </Link>
                    <Link href="#about" className="hero-btn press-scale glass-card-elevated px-12 py-5 rounded-full font-black uppercase tracking-tighter text-white hover:bg-white/10 transition-all border-white/20">
                        Our Vision
                    </Link>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
                    <AppIcon name="keyboard_arrow_down" size={32} className="text-white" />
                </div>
            </div>

            {/* Ambient Overlays */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </section>
    );
}
