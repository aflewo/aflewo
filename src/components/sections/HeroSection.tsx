"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import AppIcon from "@/components/ui/AppIcon";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Entrance
            gsap.fromTo(
                ".hero-title",
                { opacity: 0, y: 100, rotateX: 45 },
                { opacity: 1, y: 0, rotateX: 0, duration: 1.5, ease: "power4.out", delay: 0.5 }
            );

            gsap.fromTo(
                ".hero-sub",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1.2 }
            );

            gsap.fromTo(
                ".hero-btn",
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", delay: 1.5, stagger: 0.2 }
            );

            // Scroll Video Zoom
            if (videoRef.current) {
                gsap.to(videoRef.current, {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    },
                    scale: 1.2,
                    opacity: 0.6
                });
            }
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
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-80 media-mask"
                >
                    <source src="/hero-bg.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
            </div>

            {/* Premium Typography Layer */}
            <div ref={contentRef} className="relative z-10 text-center px-6 max-w-6xl">
                <div className="inline-flex items-center gap-3 px-4 py-2 glass-card rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-8 animate-breathe">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                    </span>
                    Live from Winners{"'"} Chapel
                </div>

                <h1 className="hero-title text-7xl md:text-9xl font-black tracking-tighter text-white leading-[0.85] perspective-1000 mb-8">
                    AFRICA <br />
                    <span className="text-gradient-gold">LET{"'"}S WORSHIP</span>
                </h1>

                <p className="hero-sub text-xl md:text-2xl text-white/70 font-medium max-w-2xl mx-auto mb-12 leading-relaxed font-serif-spiritual">
                    One God. One People. One Africa. <br />
                    Stirring up hope in Jesus through a united voice since 2004.
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    <Link href="/media" className="hero-btn press-scale bg-white text-brown px-12 py-5 rounded-full font-black uppercase tracking-tighter flex items-center gap-3 group hover:bg-gold transition-all">
                        <AppIcon name="play_arrow" size={20} className="group-hover:scale-110 transition-transform" />
                        Watch Archive
                    </Link>
                    <Link href="#about" className="hero-btn press-scale glass-card-elevated px-12 py-5 rounded-full font-black uppercase tracking-tighter text-white hover:bg-white/10 transition-all border-white/20">
                        Our Vision
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
                <span className="text-[10px] font-black tracking-widest uppercase">Scroll to Discover</span>
                <div className="w-[2px] h-12 bg-gradient-to-b from-white to-transparent" />
            </div>
        </section>
    );
}
