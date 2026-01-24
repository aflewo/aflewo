"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import AppIcon from "@/components/ui/AppIcon";
import { chapters as chapterData } from "@/lib/chapters";

gsap.registerPlugin(ScrollTrigger);

export default function ChaptersSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<any>(null);
    const [qrChapter, setQrChapter] = useState<any>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
        const card = cardsRef.current[index];
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const moveX = (e.clientX - centerX) * 0.05;
        const moveY = (e.clientY - centerY) * 0.05;

        gsap.to(card, {
            x: moveX,
            y: moveY,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
        });
    }, []);

    const handleMouseLeave = useCallback((index: number) => {
        const card = cardsRef.current[index];
        if (!card) return;

        gsap.to(card, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)",
            overwrite: "auto"
        });
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".chapter-header", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            });

            gsap.from(".chapter-card", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                },
                y: 80,
                opacity: 0,
                stagger: 0.05,
                duration: 1.2,
                ease: "expo.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const getGridClasses = (name: string) => {
        const n = name.toLowerCase();
        if (n === "nairobi") return "md:col-span-2 md:row-span-2 min-h-[400px]";
        if (n === "mombasa" || n === "tanzania") return "md:col-span-2 md:row-span-1 min-h-[280px]";
        return "md:col-span-1 md:row-span-1 min-h-[280px]";
    };

    return (
        <section ref={containerRef} className="section-padding bg-background relative overflow-hidden" id="chapters">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gold/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gold/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-container relative z-10">
                <div className="chapter-header flex flex-col md:flex-row justify-between items-center md:items-end gap-12 mb-20 text-center md:text-left">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.2em] mx-auto md:mx-0">
                            <AppIcon name="location-city" size={12} /> The Prophetic House
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            CHAPTERS OF <br /><span className="text-gold">IDENTITY</span>
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4 items-center md:items-end">
                        <p className="text-foreground/50 max-w-sm font-bold text-sm uppercase tracking-widest leading-relaxed text-center md:text-right">
                            A continental network of worship, uniting 10+ major hubs across Africa
                        </p>
                        <Link href="https://whatsapp.com/channel/AFLEWO" className="press-scale inline-flex items-center gap-2 text-gold font-black uppercase tracking-widest text-[10px] hover:gap-4 transition-all">
                            Join our WhatsApp Channel <AppIcon name="forum" size={14} />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
                    {chapterData.map((chapter, i) => (
                        <div
                            key={chapter.slug}
                            ref={(el) => { cardsRef.current[i] = el; }}
                            className={`chapter-card glass-card-elevated p-8 md:p-10 flex flex-col justify-between group cursor-pointer transition-colors duration-500 relative overflow-hidden rounded-lg ${getGridClasses(chapter.name)}`}
                            onMouseMove={(e) => handleMouseMove(e, i)}
                            onMouseLeave={() => handleMouseLeave(i)}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${chapter.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/80">
                                                {chapter.status}
                                            </span>
                                            {chapter.slug === "mombasa" && (
                                                <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full">
                                                    <AppIcon name="radio" size={8} className="animate-pulse" /> Live
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={`font-black tracking-tighter group-hover:text-gold transition-colors ${chapter.slug === "nairobi" ? "text-5xl md:text-6xl" : "text-3xl"}`}>
                                            {chapter.name}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setQrChapter(chapter);
                                        }}
                                        className="p-3 glass-card bg-gold/10 border-gold/30 rounded-lg text-gold hover:bg-gold hover:text-brown transition-all"
                                    >
                                        <AppIcon name="qr-code-2" size={18} />
                                    </button>
                                </div>
                                <p className="text-foreground/40 text-sm font-medium leading-relaxed max-w-[300px]">
                                    {chapter.highlight}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-white/5 relative z-10 space-y-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/50">
                                        <AppIcon name="calendar-month" size={14} className="text-gold" />
                                        <span>EST. {chapter.established}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/50">
                                        <AppIcon name="location-on" size={14} className="text-gold" />
                                        <span className="truncate">{chapter.venue.split(",")[0]}</span>
                                    </div>
                                    {chapter.capacity && (
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/50">
                                            <AppIcon name="groups" size={14} className="text-gold" />
                                            <span>{chapter.capacity} Worshippers</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link
                                        href={`/chapters/${chapter.slug}`}
                                        className="press-scale flex-1 inline-flex items-center justify-between px-5 py-3 bg-gold text-brown rounded-lg font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all"
                                    >
                                        Explore Chapter <AppIcon name="arrow-forward" size={14} />
                                    </Link>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                    ))}
                </div>

                {/* HQ Section */}
                <div className="mt-16 glass-card-elevated p-8 md:p-12 rounded-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -z-10" />
                    <div className="flex items-center gap-8 text-center md:text-left flex-col md:flex-row">
                        <div className="p-6 rounded-lg bg-gold/10 text-gold border border-gold/20 shadow-glow">
                            <AppIcon name="public" size={40} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-3xl font-black tracking-tighter">Central Administration</h4>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold/60">
                                Connect with AFLEWO HQ for global partnerships
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 w-full md:w-auto justify-center">
                        <Link href="https://aflewo.org" className="px-10 py-5 glass-card rounded-lg font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                            aflewo.org
                        </Link>
                        <Link href="tel:*456*819867#" className="px-10 py-5 bg-gold text-brown rounded-lg font-black text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-glow">
                            M-Pesa: 819867
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modals or additional content can go here */}
        </section>
    );
}
