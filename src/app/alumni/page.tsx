"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Users, Heart, Star, Compass, ArrowRight, ShieldCheck } from "lucide-react";

const founders = [
    { name: "Sing Africa", role: "Founding Alumni", org: "Daystar University" },
    { name: "Hubert de Rogue Maura", role: "Chairman", org: "National Oversight" },
    { name: "CITAM Karen", role: "Host Partner", org: "2004 Inauguration" }
];

export default function AlumniPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".animate-fade", {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out"
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
                    <div className="animate-fade inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.3em]">
                        <Star size={14} /> The Legacy Circle
                    </div>
                    <h1 className="animate-fade text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                        ALUMNI <br /><span className="text-gold">SOCIETY</span>
                    </h1>
                    <p className="animate-fade text-xl md:text-2xl text-foreground/60 font-medium max-w-3xl mx-auto leading-relaxed">
                        Honoring the "Sing Africa" alumni from Daystar University who birthed the sound of heaven in 2004.
                    </p>
                </div>
            </section>

            {/* Origins */}
            <section className="section-padding bg-brown/20 relative">
                <div className="max-container grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8 animate-fade">
                        <h2 className="text-5xl font-black tracking-tighter">Birthed from <span className="text-gold">Sing Africa</span></h2>
                        <div className="space-y-6 text-lg text-white/50 font-medium leading-relaxed">
                            <p>
                                In 2004, a group of Daystar University alumni, members of the renowned "Sing Africa" choir, felt a divine burden to unite the body of Christ in Kenya through corporate worship.
                            </p>
                            <p>
                                What began as a small gathering at CITAM Karen has transformed into a continental movement, touching lives across Kenya, Tanzania, and Rwanda.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="glass-card p-6 rounded-lg space-y-2 flex-1 min-w-[200px]">
                                <Compass className="text-gold" size={24} />
                                <h4 className="font-black text-white text-sm">Visionaries</h4>
                                <p className="text-white/40 text-xs">Sing Africa Alumni</p>
                            </div>
                            <div className="glass-card p-6 rounded-lg space-y-2 flex-1 min-w-[200px]">
                                <Heart className="text-gold" size={24} />
                                <h4 className="font-black text-white text-sm">Founding Venue</h4>
                                <p className="text-white/40 text-xs">CITAM Karen (2004)</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden glass-card-elevated border-gold/20 animate-fade">
                        <Image
                            src="/mission-1.jpg"
                            alt="The Founding"
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* Hall of Fame */}
            <section className="section-padding">
                <div className="max-container">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-5xl font-black tracking-tighter">Legacy <span className="text-gold">Leaders</span></h2>
                        <p className="text-white/40 uppercase tracking-widest text-[10px] font-black">Recognizing the pioneers of the movement</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {founders.map((founder, i) => (
                            <div key={i} className="animate-fade glass-card-elevated p-8 rounded-lg border-white/5 text-center group hover:border-gold/30 transition-all">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-gold group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={32} />
                                </div>
                                <h4 className="text-xl font-black text-white">{founder.name}</h4>
                                <p className="text-gold text-[10px] font-black uppercase tracking-widest mt-2">{founder.role}</p>
                                <p className="text-white/30 text-[10px] uppercase font-bold mt-1">{founder.org}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding">
                <div className="max-container glass-card rounded-lg p-16 text-center space-y-8 border-gold/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gold/5 blur-[100px] -z-10" />
                    <h2 className="text-5xl font-black tracking-tighter">ARE YOU AN <span className="text-gold">ALUMNUS?</span></h2>
                    <p className="max-w-xl mx-auto text-white/50 font-medium">
                        If you served in the AFLEWO choir, band, or production teams in previous years, we want to reconnect with you as we celebrate our 22nd season.
                    </p>
                    <button className="press-scale px-12 py-5 bg-gold text-brown rounded-lg font-black uppercase tracking-widest hover:brightness-110 transition-all inline-flex items-center gap-4">
                        Update Your Profile <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            <Footer />
        </main>
    );
}
