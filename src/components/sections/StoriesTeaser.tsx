"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Link from "next/link";
import AppIcon from "@/components/ui/AppIcon";

interface Story {
    content: string;
    name: string;
    role: string;
    stat: string;
    year?: string;
    chapter?: string;
}

const stories: Story[] = [
    {
        content: "AFLEWO 2025 has been refreshing, empowering and full of God's presence. Thousands came despite the rain, unified in worship.",
        name: "Winners' Chapel Testimony",
        role: "Host Partner",
        stat: "10K+ Attended",
        year: "2025",
        chapter: "Nairobi"
    },
    {
        content: "Since 2004, the vision of corporate worship has birthed 10 chapters across Kenya, Tanzania and Rwanda. The movement grows.",
        name: "Hubert de Rogue Maura",
        role: "Chairman",
        stat: "10 Chapters",
        year: "2004-2026",
        chapter: "Continental"
    },
    {
        content: "The Prayer Circle in Mombasa has transformed my spiritual life. Every night at 9PM, we gather virtually and heaven touches earth.",
        name: "Mombasa Prayer Circle",
        role: "Member Testimony",
        stat: "365 Nights/Year",
        year: "2025",
        chapter: "Mombasa"
    },
    {
        content: "Being part of the 1,000-voice choir in Nakuru was life-changing. The unity, the power, the presence—it's indescribable.",
        name: "Nakuru Choir Member",
        role: "Volunteer",
        stat: "1,000 Voices",
        year: "2024",
        chapter: "Nakuru"
    }
];

export default function StoriesTeaser() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Simple and robust GSAP horizontal scroll
            const cards = gsap.utils.toArray(".story-card") as HTMLElement[];
            if (!cards.length) return;

            // Initial positioning
            gsap.set(cards, { xPercent: 100, opacity: 0 });
            gsap.set(cards[0], { xPercent: 0, opacity: 1 });

            let currentIndex = 0;
            let isAnimating = false;

            const gotoStory = (index: number) => {
                if (isAnimating || index === currentIndex) return;
                isAnimating = true;

                const direction = index > currentIndex ? 1 : -1;
                const outgoing = cards[currentIndex];
                const incoming = cards[index];

                setActiveIndex(index);

                const tl = gsap.timeline({
                    onComplete: () => {
                        isAnimating = false;
                        currentIndex = index;
                    }
                });

                tl.to(outgoing, {
                    xPercent: -100 * direction,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.inOut"
                });

                tl.fromTo(incoming,
                    { xPercent: 100 * direction, opacity: 0 },
                    { xPercent: 0, opacity: 1, duration: 0.8, ease: "power3.inOut" },
                    0
                );
            };

            const handleNext = () => {
                const next = (currentIndex + 1) % stories.length;
                gotoStory(next);
            };

            const handlePrev = () => {
                const prev = (currentIndex - 1 + stories.length) % stories.length;
                gotoStory(prev);
            };

            // Save to refs for button access
            (window as any).nextStory = handleNext;
            (window as any).prevStory = handlePrev;

            // Header animations
            gsap.from(".stories-header", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                x: -60,
                opacity: 0,
                duration: 1.2,
                ease: "expo.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="section-padding bg-brown text-white relative overflow-hidden" id="stories">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gold/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-emerald/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-container relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center min-h-[600px]">
                    <div className="stories-header flex-1 space-y-8 lg:sticky lg:top-32">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.2em]">
                            <AppIcon name="auto_awesome" size={14} /> The AFLEWO Spirit
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            HEIRS OF <br />
                            <span className="text-gold">GLORY</span>
                        </h2>
                        <p className="text-white/60 text-xl font-medium leading-relaxed font-sans-aflewo italic max-w-md">
                            &quot;Behind every worship night is a story of transformation. From the hidden prayers of volunteers to the global echoes of our anthem.&quot;
                        </p>

                        <div className="flex items-center gap-4 pt-4">
                            <button
                                onClick={() => (window as any).prevStory?.()}
                                className="p-4 rounded-full glass-card hover:bg-white/10 transition-colors"
                            >
                                <AppIcon name="arrow_back_ios" size={20} className="translate-x-1" />
                            </button>
                            <div className="flex gap-2">
                                {stories.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-2 rounded-full transition-all duration-500 ${i === activeIndex ? "w-8 bg-gold" : "w-2 bg-white/20"
                                            }`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => (window as any).nextStory?.()}
                                className="p-4 rounded-full glass-card hover:bg-white/10 transition-colors"
                            >
                                <AppIcon name="arrow_forward_ios" size={20} />
                            </button>
                        </div>

                        <Link
                            href="/stories"
                            className="press-scale inline-flex items-center gap-4 bg-gold text-brown px-10 py-5 rounded-lg font-black uppercase tracking-tighter hover:brightness-110 transition-all shadow-glow"
                        >
                            Read All Stories <AppIcon name="arrow_forward" size={20} />
                        </Link>
                    </div>

                    <div className="flex-1 w-full h-[500px] relative overflow-hidden flex items-center justify-center">
                        <div className="cards relative w-full h-full">
                            {stories.map((story, i) => (
                                <div
                                    key={i}
                                    className={`story-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] transition-opacity duration-300 ${i === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                                >
                                    <div className="glass-card-elevated p-10 md:p-12 relative overflow-hidden group rounded-[2rem] border-white/5 bg-brown/40 backdrop-blur-3xl shadow-2xl">
                                        <AppIcon name="format_quote" size={80} className="absolute top-8 right-8 text-gold/10 group-hover:text-gold/20 transition-colors duration-500" />

                                        <div className="relative z-10 space-y-8">
                                            <div className="flex items-center gap-3">
                                                {story.chapter && (
                                                    <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest">
                                                        {story.chapter}
                                                    </span>
                                                )}
                                                {story.year && (
                                                    <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                                                        {story.year}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                                                &quot;{story.content}&quot;
                                            </p>

                                            <div className="flex justify-between items-end border-t border-white/10 pt-8">
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-gold uppercase tracking-widest text-xs">
                                                        {story.name}
                                                    </h4>
                                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                                        {story.role}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gold/10">
                                                    <AppIcon name="favorite" size={16} className="text-gold" />
                                                    <span className="text-xs font-black text-gold">{story.stat}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
