"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Quote, Heart, MessageCircle, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const narrativeStories = [
    {
        title: "The Altar of 2004",
        desc: "It began with a few graduates from Daystar University, seeking God for a united Africa. We didn't have a stadium; we had a promise.",
        author: "Sing Africa Alumni",
        image: "/archival-1.jpg"
    },
    {
        title: "Thousands in the Rain",
        desc: "October 3rd, 2025. Winners' Chapel was filled despite a heavy downpour. It wasn't about the weather; it was about the Grace for Wholeness.",
        author: "Nairobi Chapter",
        image: "/mission-1.jpg"
    },
    {
        title: "Healing in Kigali",
        desc: "In 2014, as Rwanda commemorated 20 years, AFLEWO Kigali raised a sound of reconciliation. Music became the bridge to healing.",
        author: "Kigali Team",
        image: "/archival-2.jpg"
    }
];

export default function StoriesPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".story-section", {
                scrollTrigger: {
                    trigger: ".story-section",
                    start: "top 80%",
                    scrub: 1,
                },
                y: 100,
                opacity: 0,
            });

            // Text reveal
            gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((text) => {
                gsap.from(text, {
                    scrollTrigger: {
                        trigger: text,
                        start: "top 85%",
                    },
                    y: 20,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out"
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="bg-background min-h-screen">
            <Navbar />

            {/* Stories Hero */}
            <section className="pt-40 pb-24 px-6 relative overflow-hidden">
                <div className="max-container">
                    <div className="max-w-4xl space-y-8">
                        <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">Testimonies</span>
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                            ECHOES OF <br /><span className="text-gold">GRACE.</span>
                        </h1>
                        <p className="text-2xl text-foreground/60 font-medium leading-relaxed font-serif-spiritual italic">
                            "AFLEWO is not just an event; it's a tapestry of thousands of voices, each with a story of how worship changed their world."
                        </p>
                    </div>
                </div>
            </section>

            {/* Immersive Narrative Scroll */}
            <section className="pb-32">
                {narrativeStories.map((story, i) => (
                    <div key={i} className="story-section min-h-[80vh] flex items-center border-b border-white/5 py-24 px-6 md:px-0">
                        <div className={`max-container flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-20 items-center`}>
                            <div className="flex-1 space-y-8">
                                <Quote className="text-gold opacity-20" size={64} />
                                <h2 className="reveal-text text-5xl md:text-7xl font-black tracking-tighter leading-tight">{story.title}</h2>
                                <p className="reveal-text text-xl text-foreground/60 font-medium leading-loose font-serif-spiritual">
                                    "{story.desc}"
                                </p>
                                <div className="reveal-text flex items-center gap-4 pt-8">
                                    <div className="w-12 h-px bg-gold" />
                                    <span className="text-gold text-[10px] font-black uppercase tracking-widest">{story.author}</span>
                                </div>
                            </div>
                            <div className="flex-1 w-full aspect-square rounded-[3rem] overflow-hidden glass-card-elevated group border-white/10">
                                <Image
                                    src={story.image}
                                    alt={story.title}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Submission CTA */}
            <section className="section-padding bg-primary text-primary-foreground text-center">
                <div className="max-container space-y-12">
                    <Sparkles className="mx-auto text-gold" size={48} />
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">WHAT'S YOUR <span className="text-gold">AFLEWO STORY?</span></h2>
                    <p className="max-w-2xl mx-auto text-white/60 text-lg font-medium">
                        Whether you were in the choir in 2004 or attended for the first time in 2025, we want to hear how God has moved in your life through worship.
                    </p>
                    <button className="press-scale bg-white text-brown px-12 py-5 rounded-full font-black uppercase tracking-tighter hover:bg-gold transition-all">
                        Share Your Story
                    </button>

                    <div className="flex justify-center gap-12 pt-12 border-t border-white/5 opacity-40">
                        <div className="flex flex-col items-center gap-2">
                            <Heart size={24} />
                            <span className="text-[10px] font-black uppercase">7,000+ Alumni</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <MessageCircle size={24} />
                            <span className="text-[10px] font-black uppercase">Thousands of Stories</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
