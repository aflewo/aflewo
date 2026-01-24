"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Users, Music, Handshake, Heart } from "lucide-react";

const tracks = [
    { title: "Music & Choir", desc: "Join the mass choir or instrumental team. Requires registration and auditions.", icon: <Music size={32} /> },
    { title: "Production & Media", desc: "Helping in videography, sound engineering, and digital storytelling.", icon: <Users size={32} /> },
    { title: "Hospitality & Logistics", desc: "Ensuring every worshipper feels at home and every event runs smoothly.", icon: <Heart size={32} /> },
    { title: "Partners & Sponsors", desc: "For corporate and individual tracks looking to support the vision.", icon: <Handshake size={32} /> },
];

export default function JoinPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".track-card", {
                y: 50,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "power3.out",
                delay: 0.5
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="bg-background min-h-screen">
            <Navbar />

            <section className="pt-40 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] rounded-full bg-gold/5 blur-[120px] -z-10" />
                <div className="max-container flex flex-col items-center text-center space-y-8">
                    <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">Engagement</span>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                        JOIN THE <br /><span className="text-gold">MOVEMENT</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-foreground/60 font-medium max-w-2xl mx-auto leading-relaxed">
                        AFLEWO is built by volunteers, partners, and the faithful commitment of thousands.
                        Find your place in the sound of heaven.
                    </p>
                </div>
            </section>

            <section className="section-padding">
                <div className="max-container space-y-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tracks.map((track, i) => (
                            <div key={i} className="track-card glass-card p-10 space-y-6 group hover:border-gold/30 transition-all cursor-pointer rounded-lg">
                                <div className="text-gold group-hover:scale-110 transition-transform duration-500">{track.icon}</div>
                                <h3 className="text-2xl font-black tracking-tighter">{track.title}</h3>
                                <p className="text-foreground/50 text-sm font-bold leading-relaxed">{track.desc}</p>
                                <div className="pt-4">
                                    <button className="text-[10px] font-black uppercase tracking-widest text-gold opacity-60 group-hover:opacity-100 transition-opacity">Apply Now &gt;</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="py-20 border-y border-white/5">
                        <div className="text-center space-y-12">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">OUR CORE <span className="text-gold">PILLARS</span></h2>
                            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                                {["Hope", "Unity", "Music", "Prayer", "Word", "Leadership", "Excellence"].map((pillar) => (
                                    <div key={pillar} className="px-6 py-3 glass-card rounded-full text-xs font-black uppercase tracking-widest text-white/60 hover:text-gold hover:border-gold/30 transition-all">
                                        {pillar}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-background/50">
                <div className="max-container flex flex-col md:flex-row items-center gap-20">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-5xl font-black tracking-tighter">PARTNER WITH <br /><span className="text-gold">AFLEWO</span></h2>
                        <div className="space-y-6">
                            <p className="text-foreground/60 text-lg font-medium leading-relaxed font-sans-aflewo italic">
                                "Partnering with us means powering a prophetic house that stands for unity across the continent."
                            </p>
                            <div className="glass-card p-8 space-y-4 rounded-lg border-gold/10 shadow-xl">
                                <h4 className="font-black text-gold uppercase tracking-widest text-xs">M-Pesa Support</h4>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-2xl font-black tracking-tighter">
                                    <span>PAYBILL: 4186935</span>
                                    <span className="text-gold bg-gold/10 px-4 py-1 rounded-lg">AFLEWO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
