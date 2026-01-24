"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import AppIcon from "@/components/ui/AppIcon";
import { cn } from "@/lib/utils";

const tracks = [
    { title: "Voice & Choir", desc: "Join the mass choir of 1,000+ voices. Auditions required for the national and regional chapters.", icon: "music_note" },
    { title: "Band & Orchestra", desc: "For skilled instrumentalists ready to create the sound of heaven with professional excellence.", icon: "stars" },
    { title: "Production & Media", desc: "Videography, sound engineering, photography, and digital storytelling for the archive.", icon: "photo_camera" },
    { title: "Ushering & Logistics", desc: "Be the face of the movement, ensuring every worshipper is welcomed in the Spirit.", icon: "favorite" },
    { title: "Security & Safety", desc: "Stewarding the physical space so that the spiritual atmosphere remains undisturbed.", icon: "shield" },
    { title: "Corporate Partners", desc: "Align your organization with the continental worship and prayer agenda.", icon: "handshake" },
];

export default function JoinPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".track-card", {
                y: 50,
                opacity: 0,
                stagger: 0.1,
                duration: 1.2,
                ease: "expo.out",
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="pt-40 pb-24 px-6 relative overflow-hidden text-center">
                <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] rounded-full bg-gold/5 blur-[150px] -z-10" />
                <div className="max-container space-y-10">
                    <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px]">Service & Stewardship</span>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white">
                        THE <span className="text-gold">ALTAR</span> <br /> IS OPEN
                    </h1>
                    <p className="text-xl md:text-2xl text-foreground/40 font-medium max-w-3xl mx-auto leading-relaxed italic">
                        AFLEWO is built on the sacrifice of thousands who believe in Uniting the Continent in Worship. Find your place in the Prophetic House.
                    </p>
                </div>
            </section>

            {/* Service Tracks */}
            <section className="section-padding">
                <div className="max-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tracks.map((track, i) => (
                            <div key={i} className="track-card glass-card-elevated p-10 space-y-8 group hover:border-gold/30 transition-all cursor-pointer rounded-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-2xl group-hover:bg-gold/10 transition-colors" />
                                <div className="text-gold group-hover:scale-110 transition-transform duration-500">
                                    <AppIcon name={track.icon} size={32} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black tracking-tighter text-white uppercase">{track.title}</h3>
                                    <p className="text-foreground/40 text-sm font-bold leading-relaxed">{track.desc}</p>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gold hover:gap-5 transition-all">
                                        Express Interest <AppIcon name="arrow_forward" size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pillars */}
                    <div className="mt-32 py-24 border-y border-white/5">
                        <div className="text-center space-y-16">
                            <div className="space-y-4">
                                <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px]">What guides us</span>
                                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase">THE SEVEN <span className="text-gold">PILLARS</span></h2>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                                {["Hope", "Unity", "Music", "Prayer", "Word", "Leadership", "Excellence"].map((pillar) => (
                                    <div key={pillar} className="px-10 py-5 glass-card rounded-lg text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-gold hover:border-gold/30 transition-all cursor-default">
                                        {pillar}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partnership Focus */}
            <section className="section-padding bg-brown/5 relative overflow-hidden">
                <div className="max-container grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px]">Kingdom Alignment</span>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase">PARTNER <br />WITH <span className="text-gold">US</span></h2>
                        </div>
                        <p className="text-foreground/50 text-xl font-medium leading-relaxed italic border-l-4 border-gold pl-8 py-2">
                            "Partnering with AFLEWO means powering a house of prayer that covers the African Continent from dawn till dusk."
                        </p>
                        <div className="glass-card-elevated p-10 space-y-6 rounded-lg border-gold/10 shadow-2xl relative">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <AppIcon name="handshake" size={60} className="text-gold" />
                            </div>
                            <h4 className="font-black text-gold uppercase tracking-widest text-[11px]">Prophetic Stewardship</h4>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-3xl font-black tracking-tighter text-white">
                                    <span>M-PESA: 4186935</span>
                                    <span className="text-gold bg-gold/5 px-6 py-2 rounded-lg border border-gold/20">AFLEWO</span>
                                </div>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-loose">Supports Continental Expansion & Logistics</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-square rounded-[2rem] overflow-hidden glass-card-elevated border-white/5 bg-brown/20 flex flex-col justify-center p-12 gap-10">
                        <div className="space-y-4">
                            <h4 className="text-4xl font-black tracking-tighter text-white underline decoration-gold underline-offset-8 uppercase">Global Giving</h4>
                            <p className="text-foreground/40 font-bold text-sm uppercase tracking-widest mt-6">International Worshippers</p>
                        </div>
                        <div className="space-y-6">
                            <button className="w-full py-6 glass-card-elevated hover:bg-gold hover:text-brown transition-all rounded-lg font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 border border-white/5">
                                Give via PayPal <AppIcon name="arrow_forward" size={18} />
                            </button>
                            <button className="w-full py-6 glass-card-elevated hover:bg-gold hover:text-brown transition-all rounded-lg font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 border border-white/5">
                                Bank Transfers <AppIcon name="arrow_forward" size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
