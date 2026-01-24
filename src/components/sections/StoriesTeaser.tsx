"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/all";
import AppIcon from "@/components/ui/AppIcon";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, Draggable);

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
    const containerRef = useRef<HTMLDivElement>(null);
    const proxyRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const storiesCount = stories.length;
        const cards = gsap.utils.toArray(".story-card") as HTMLElement[];

        // Configuration for the seamless loop
        const spacing = 0.3; // Spacing between cards (stagger)
        const snap = gsap.utils.snap(spacing);

        // Set initial state of cards
        gsap.set(cards, { xPercent: 400, opacity: 0, scale: 0.8 });

        const animateFunc = (element: HTMLElement) => {
            const tl = gsap.timeline();
            tl.fromTo(element,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false }
            ).fromTo(element,
                { xPercent: 450 },
                { xPercent: -450, duration: 1, ease: "none", immediateRender: false },
                0
            );
            return tl;
        };

        const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);
        const playhead = { offset: 0 };
        const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());

        const scrub = gsap.to(playhead, {
            offset: 0,
            onUpdate() {
                seamlessLoop.time(wrapTime(playhead.offset));
                // Sync active index for UI dots
                const normalizedOffset = wrapTime(playhead.offset) / seamlessLoop.duration();
                const currentIdx = Math.round(normalizedOffset * storiesCount) % storiesCount;
                setActiveIndex(currentIdx);
            },
            duration: 0.5,
            ease: "power3",
            paused: true
        });

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            onUpdate(self) {
                if (self.isActive) {
                    scrub.vars.offset = self.progress * seamlessLoop.duration();
                    scrub.invalidate().restart();
                }
            }
        });

        const draggable = Draggable.create(proxyRef.current, {
            type: "x",
            trigger: containerRef.current,
            inertia: true,
            onPress() {
                this.startOffset = playhead.offset;
            },
            onDrag() {
                playhead.offset = this.startOffset + (this.startX - this.x) * 0.001;
                scrub.invalidate().restart();
            },
            onDragEnd() {
                scrollToOffset(playhead.offset);
            }
        })[0];

        function scrollToOffset(offset: number) {
            const snappedTime = snap(offset);
            gsap.to(playhead, {
                offset: snappedTime,
                duration: 0.6,
                ease: "power3.out",
                onUpdate: scrub.vars.onUpdate
            });
        }

        // Helper function to build the loop
        function buildSeamlessLoop(items: HTMLElement[], spacing: number, animateFunc: (el: HTMLElement) => gsap.core.Timeline) {
            const overlap = Math.ceil(1 / spacing);
            const startTime = items.length * spacing + 0.5;
            const loopTime = (items.length + overlap) * spacing + 1;
            const rawSequence = gsap.timeline({ paused: true });
            const seamlessLoop = gsap.timeline({
                paused: true,
                repeat: -1,
                onRepeat() {
                    this._time === this._dur && (this._tTime += this._dur - 0.01);
                }
            });
            const l = items.length + overlap * 2;
            let time, i, index;

            for (i = 0; i < l; i++) {
                index = i % items.length;
                time = i * spacing;
                rawSequence.add(animateFunc(items[index]), time);
            }

            rawSequence.time(startTime);
            seamlessLoop.to(rawSequence, {
                time: loopTime,
                duration: loopTime - startTime,
                ease: "none"
            }).fromTo(rawSequence, { time: overlap * spacing + 1 }, {
                time: startTime,
                duration: startTime - (overlap * spacing + 1),
                immediateRender: false,
                ease: "none"
            });
            return seamlessLoop;
        }

        return () => {
            trigger.kill();
            draggable.kill();
            seamlessLoop.kill();
        };
    }, []);

    return (
        <section ref={sectionRef} className="section-padding bg-brown text-white relative overflow-hidden" id="stories">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gold/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-emerald/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-container relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center min-h-[600px]">
                    <div className="stories-header flex-1 space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.2em] mx-auto lg:mx-0">
                            <AppIcon name="auto_awesome" size={14} /> The AFLEWO Spirit
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            HEIRS OF <br />
                            <span className="text-gold uppercase">GLORY</span>
                        </h2>
                        <p className="text-white/60 text-xl font-medium leading-relaxed italic max-w-md mx-auto lg:mx-0">
                            "Behind every worship night is a story of transformation. From the hidden prayers of volunteers to the global echoes of our anthem."
                        </p>

                        <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                            <div className="flex gap-3">
                                {stories.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? "w-10 bg-gold" : "w-1.5 bg-white/20"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/stories"
                            className="press-scale inline-flex items-center gap-4 bg-gold text-brown px-12 py-5 rounded-lg font-black uppercase tracking-tighter hover:brightness-110 transition-all shadow-glow"
                        >
                            Read All Stories <AppIcon name="arrow_forward" size={20} />
                        </Link>
                    </div>

                    <div ref={containerRef} className="flex-1 w-full h-[500px] relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing">
                        <div ref={proxyRef} className="absolute invisible" />
                        <ul className="cards relative w-full h-full list-none p-0 m-0">
                            {stories.map((story, i) => (
                                <li key={i} className="story-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px]">
                                    <div className="glass-card-elevated p-10 md:p-12 relative overflow-hidden group rounded-[2rem] border-white/5 bg-brown/40 backdrop-blur-3xl shadow-2xl">
                                        <AppIcon name="format_quote" size={80} className="absolute top-8 right-8 text-gold/10 group-hover:text-gold/20 transition-colors duration-500" />

                                        <div className="relative z-10 space-y-8">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest">
                                                    {story.chapter}
                                                </span>
                                            </div>

                                            <p className="text-xl md:text-2xl font-black tracking-tight text-white leading-snug">
                                                "{story.content}"
                                            </p>

                                            <div className="flex justify-between items-end border-t border-white/5 pt-8">
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
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </section>
    );
}
