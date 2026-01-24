"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import AppIcon from "@/components/ui/AppIcon";

const leadership = [
    { name: "Hubert de Rogue Maura", role: "Chairman / Team Leader", icon: "verified_user" },
    { name: "Timothy Kaberia", role: "Founder / Visionary", icon: "public" },
    { name: "Philip Kitoto", role: "Pastoral Advisor", icon: "forum" },
    { name: "Tom Otieno", role: "Pastoral Advisor", icon: "favorite" },
    { name: "Nairobi Team", role: "Music & Logistics", icon: "music_note" },
    { name: "Summit Council", role: "Oversight", icon: "groups" }
];

export default function LeadershipSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".leader-card", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                },
                scale: 0.9,
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
        <section id="leadership" ref={containerRef} className="section-padding bg-brown/5 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_center,var(--gold)_0%,transparent_70%)]" />

            <div className="max-container relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-12 mb-20 text-center md:text-left">
                    <div className="space-y-6">
                        <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">The Chosen Ones</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                            AFLEWO <br /><span className="text-gold">SUMMIT</span>
                        </h2>
                    </div>
                    <p className="max-w-md text-foreground/50 font-bold text-sm uppercase tracking-widest leading-relaxed">
                        Leading the movement through interdenominational wisdom and prophetic stewardship.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leadership.map((leader, i) => (
                        <div
                            key={i}
                            className="leader-card group relative p-10 glass-card-elevated rounded-lg hover:border-gold/30 transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl -z-10 group-hover:bg-gold/10 transition-colors" />

                            <div className="space-y-6">
                                <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-500 border border-gold/20">
                                    <AppIcon name={leader.icon} size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-black tracking-tighter group-hover:text-gold transition-colors">{leader.name}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{leader.role}</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gold/60">AFLEWO 2026 Leadership</span>
                                <div className="w-2 h-2 rounded-full bg-gold/30 group-hover:bg-gold animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
