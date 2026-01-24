"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import AppIcon from "@/components/ui/AppIcon";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
    { title: "Unity", desc: "Bringing the diverse church of Africa into a single, cohesive voice of worship.", icon: "groups" },
    { title: "Hope", desc: "Stirring up the expectation of God's goodness across the 'prophetic house' of Africa.", icon: "auto_awesome" },
    { title: "Excellence", desc: "Presenting our worship with the highest standard of musical and logistical skill.", icon: "verified" },
    { title: "Intercession", desc: "Standing in the gap for nations like DR Congo, Nigeria, and South Sudan.", icon: "favorite" },
];

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".about-hero-text", {
                y: 100,
                opacity: 0,
                duration: 1.5,
                ease: "expo.out"
            });

            gsap.from(".pillar-card", {
                scrollTrigger: {
                    trigger: ".pillars-grid",
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "power3.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="bg-background min-h-screen">
            <Navbar />

            {/* Subpage Hero */}
            <section className="relative pt-40 pb-24 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 blur-3xl bg-gold/20 -z-10" />
                <div className="max-container">
                    <div className="about-hero-text max-w-4xl space-y-8">
                        <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">Our Identity</span>
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                            THE VISION <br />
                            <span className="text-gold">BEHIND THE ALTAR.</span>
                        </h1>
                        <p className="text-2xl text-foreground/60 font-medium leading-relaxed font-serif-spiritual italic">
                            AFLEWO (Africa Let{"'"}s Worship) is a movement birthed from the heart of Daystar University alumni,
                            committed to raising an annual altar of worship and prayer for the nations of Africa.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Bento */}
            <section className="section-padding">
                <div className="max-container grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card-elevated p-12 space-y-6 md:mt-12">
                        <h3 className="text-gold font-black uppercase tracking-widest text-xs">The Mission</h3>
                        <h2 className="text-4xl font-black tracking-tight">PURSUING UNITY <span className="text-gold">IN WORSHIP.</span></h2>
                        <p className="text-foreground/60 font-medium leading-loose text-lg">
                            To stir up hope in Jesus through annual large-scale musical and prayer events from a united church front across Africa.
                            Since 2004, we have provided a platform where denominations fade, and the name of Jesus is exalted.
                        </p>
                    </div>
                    <div className="bg-primary text-primary-foreground p-12 rounded-[2rem] space-y-6">
                        <h3 className="text-gold font-black uppercase tracking-widest text-xs">The Vision</h3>
                        <h2 className="text-4xl font-black tracking-tight text-white">A PROPHETIC <span className="text-gold">HOUSE.</span></h2>
                        <p className="text-white/60 font-medium leading-loose text-lg">
                            To see all of Africa seeing itself through the eyes of its Maker. We aim to achieve this through corporate worship,
                            establishing local chapters that maintain the pulse of intercession in every major African city.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="section-padding bg-background/50" id="pillars">
                <div className="max-container">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                        <h2 className="text-5xl font-black tracking-tighter">OUR GUIDING <span className="text-gold">PILLARS.</span></h2>
                        <p className="text-foreground/50 max-w-xs font-bold text-sm uppercase tracking-widest">The foundation of every AFLEWO experience.</p>
                    </div>

                    <div className="pillars-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pillars.map((pillar, i) => (
                            <div key={i} className="pillar-card glass-card p-10 space-y-6 hover:-translate-y-2 transition-transform duration-500 rounded-[2rem]">
                                <div className="text-gold"><AppIcon name={pillar.icon} size={32} /></div>
                                <h3 className="text-2xl font-black">{pillar.title}</h3>
                                <p className="text-foreground/60 text-sm font-medium leading-relaxed">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Founders Context */}
            <section className="section-padding overflow-hidden relative">
                <div className="max-container flex flex-col md:flex-row items-center gap-20">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-5xl font-black tracking-tighter">THE SING AFRICA <br /><span className="text-gold">LEGACY.</span></h2>
                        <p className="text-foreground/60 text-lg font-medium leading-relaxed">
                            Birthed in October 2003, the alumni of Sing Africa sought to create a united front for the church.
                            Under the leadership of Timothy Kaberia and Ruguru, the phrase &quot;Africa Let&apos;s Worship&quot; became our anthem.
                        </p>
                        <div className="flex items-center gap-4 py-4 border-y border-white/5">
                            <div className="w-12 h-12 rounded-full overflow-hidden grayscale relative">
                                <Image src="/mission-1.jpg" alt="Sing Africa" fill className="object-cover" />
                            </div>
                            <p className="text-gold text-[10px] font-black uppercase tracking-widest">Daystar University Christian Fellowship Ministries</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full aspect-square rounded-full border border-gold/20 flex items-center justify-center p-12 relative animate-breathe">
                        <div className="w-full h-full rounded-full overflow-hidden relative grayscale opacity-40">
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            >
                                <source src="/hero-bg.mp4" type="video/mp4" />
                            </video>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-9xl font-black text-gold/20 select-none">20+</div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
