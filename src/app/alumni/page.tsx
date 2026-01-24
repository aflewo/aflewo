"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import AppIcon from "@/components/ui/AppIcon";

const founders = [
    { name: "Timothy Kaberia", role: "Founding Visionary", org: "Daystar Alumni" },
    { name: "Hubert de Rogue Maura", role: "National Chairman", org: "AFLEWO Summit" },
    { name: "Ruguru", role: "Name Proposer", org: "Legacy Member" },
    { name: "Philip Kitoto", role: "Spiritual Father", org: "ICC Nairobi" },
    { name: "Tom Otieno", role: "Pastoral Advisor", org: "ACK Christ Church" }
];

export default function AlumniPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".animate-fade", {
                opacity: 0,
                y: 40,
                stagger: 0.1,
                duration: 1.2,
                ease: "expo.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="bg-background min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="pt-40 pb-24 px-6 relative overflow-hidden text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gold/5 blur-[120px] -z-10" />
                <div className="max-container space-y-8">
                    <div className="animate-fade inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
                        <AppIcon name="auto_awesome" size={14} /> The Legacy Circle
                    </div>
                    <h1 className="animate-fade text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white">
                        ALUMNI <br /><span className="text-gold">SOCIETY</span>
                    </h1>
                    <p className="animate-fade text-xl md:text-2xl text-foreground/40 font-medium max-w-3xl mx-auto leading-relaxed">
                        Honoring the "Sing Africa" alumni from Daystar University who birthed the sound of heaven in 2004.
                    </p>
                </div>
            </section>

            {/* Origins */}
            <section className="section-padding bg-brown/5 relative">
                <div className="max-container grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-10 animate-fade">
                        <div className="space-y-4">
                            <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px]">Since 1996</span>
                            <h2 className="text-5xl font-black tracking-tighter text-white">Birthed from <br /><span className="text-gold">Sing Africa</span></h2>
                        </div>
                        <div className="space-y-6 text-lg text-foreground/60 font-medium leading-relaxed">
                            <p>
                                Sing Africa has been in ministry since 1996 under Daystar University Christian Fellowship. In October 2003, alumni from different generations sought to create a united front for the church.
                            </p>
                            <p>
                                In 2004, God directed these visionaries to fulfill the call for Kenya to be a cradle of prayer for the nations. A leader named Ruguru suggested the name "Africa Let's Worship" — AFLEWO was born.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="glass-card p-8 rounded-lg space-y-3">
                                <AppIcon name="milestone" className="text-gold" size={24} />
                                <h4 className="font-black text-white text-sm uppercase">7,000+ ALUMNI</h4>
                                <p className="text-white/30 text-xs">Spread across the Continent</p>
                            </div>
                            <div className="glass-card p-8 rounded-lg space-y-3">
                                <AppIcon name="public" className="text-gold" size={24} />
                                <h4 className="font-black text-white text-sm uppercase">8+ CHAPTERS</h4>
                                <p className="text-white/30 text-xs">Unified in One Vision</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden glass-card-elevated border-white/5 animate-fade group">
                        <Image
                            src="/mission-1.jpg"
                            alt="The Founding Generation"
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-background to-transparent">
                            <p className="text-white font-black uppercase tracking-widest text-[10px]">CITAM Karen (2004) - The Inception</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hall of Fame */}
            <section className="section-padding">
                <div className="max-container">
                    <div className="text-center mb-24 space-y-6">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">Legacy <span className="text-gold">Leaders</span></h2>
                        <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-black">Recognizing the pioneers of the prophetic house</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {founders.map((founder, i) => (
                            <div key={i} className="animate-fade glass-card-elevated p-10 rounded-lg border-white/5 text-center group hover:border-gold/30 transition-all duration-500">
                                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-brown transition-all duration-500 border border-gold/20">
                                    <AppIcon name="verified_user" size={40} />
                                </div>
                                <h4 className="text-2xl font-black text-white">{founder.name}</h4>
                                <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mt-3">{founder.role}</p>
                                <p className="text-white/20 text-[9px] uppercase font-bold mt-2 tracking-widest">{founder.org}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alumni Registry CTA */}
            <section className="section-padding px-6">
                <div className="max-container glass-card rounded-lg p-16 md:p-24 text-center space-y-10 border-gold/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gold/5 blur-[120px] -z-10 group-hover:bg-gold/10 transition-colors" />
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white">ARE YOU AN <br /><span className="text-gold">ALUMNUS?</span></h2>
                    <p className="max-w-2xl mx-auto text-foreground/40 font-medium text-lg leading-relaxed">
                        If you served in the AFLEWO choir, band, or production teams in previous years, your story is part of the Eternal Record. Reconnect with the movement as we celebrate 22 seasons.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="press-scale w-full sm:w-auto px-16 py-6 bg-gold text-brown rounded-lg font-black uppercase tracking-widest hover:brightness-110 transition-all inline-flex items-center justify-center gap-4 shadow-glow">
                            Update Your Profile <AppIcon name="arrow_forward" size={20} />
                        </button>
                        <button className="press-scale w-full sm:w-auto px-16 py-6 glass-card text-white rounded-lg font-black uppercase tracking-widest hover:bg-white/10 transition-all inline-flex items-center justify-center gap-4">
                            Alumni Portal <AppIcon name="public" size={20} />
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
