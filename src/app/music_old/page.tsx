"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import AppIcon from "@/components/ui/AppIcon";

export default function MusicPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".reveal", {
                y: 100,
                opacity: 0,
                stagger: 0.1,
                duration: 1.5,
                ease: "expo.out"
            });

            // Subtle pulse on the central disc
            gsap.to(".music-disc", {
                scale: 1.05,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="bg-background min-h-screen relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[150px] -z-10 rounded-full" />

            <section className="pt-40 pb-32 px-6 flex flex-col items-center justify-center text-center">
                <div className="max-container space-y-12">
                    <div className="reveal inline-flex items-center gap-3 px-4 py-2 glass-card rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-4 border border-gold/20">
                        <AppIcon name="volume_up" size={14} /> Coming 2026
                    </div>

                    <h1 className="reveal text-7xl md:text-[12rem] font-black tracking-tighter leading-[0.8] mb-12 uppercase">
                        THE <br /><span className="text-gold">RELEASES.</span>
                    </h1>

                    <div className="reveal relative w-64 h-64 md:w-96 md:h-96 mx-auto mb-20">
                        <div className="music-disc absolute inset-0 rounded-full border border-gold/20 flex items-center justify-center">
                            <div className="w-1/2 h-1/2 rounded-full bg-gold/10 backdrop-blur-3xl flex items-center justify-center border border-gold/20">
                                <AppIcon name="mic" size={80} className="text-gold" />
                            </div>
                        </div>
                        {/* Orbiting particles */}
                        <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-gold animate-ping" />
                        <div className="absolute bottom-10 right-0 w-3 h-3 rounded-full bg-gold/40 animate-pulse" />
                    </div>

                    <div className="reveal max-w-2xl mx-auto space-y-10">
                        <p className="text-xl md:text-2xl text-foreground/50 font-medium leading-relaxed italic border-l-2 border-gold/30 pl-8">
                            "For two decades, we've sung the anthems of the global church. In 2026, we release the original sound of the AFLEWO movement."
                        </p>

                        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                            <button className="press-scale bg-gold text-brown px-16 py-6 rounded-full font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all shadow-glow">
                                Get Early Access
                            </button>
                            <button className="press-scale glass-card px-16 py-6 rounded-full font-black uppercase tracking-widest text-[10px] text-white border-white/20 hover:bg-white/10 transition-all">
                                View Studio Logs
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-background/50 border-t border-white/5">
                <div className="max-container grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="reveal space-y-6">
                        <AppIcon name="auto_awesome" className="text-gold" size={32} />
                        <h4 className="font-black uppercase tracking-widest text-xs">Authentic Sound</h4>
                        <p className="text-foreground/50 text-sm font-medium leading-relaxed">Recorded with the 1,000 voice choir legacy in mind.</p>
                    </div>
                    <div className="reveal space-y-6">
                        <AppIcon name="music_note" className="text-gold" size={32} />
                        <h4 className="font-black uppercase tracking-widest text-xs">Cultural Depth</h4>
                        <p className="text-foreground/50 text-sm font-medium leading-relaxed">Integrating traditional African rhythms with modern worship.</p>
                    </div>
                    <div className="reveal space-y-6">
                        <AppIcon name="volume_up" className="text-gold" size={32} />
                        <h4 className="font-black uppercase tracking-widest text-xs">Global Standards</h4>
                        <p className="text-foreground/50 text-sm font-medium leading-relaxed">World-class technical production in every track.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

