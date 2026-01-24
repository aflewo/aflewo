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
                y: 40,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "power3.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="leadership" ref={containerRef} className="section-padding bg-brown/5 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_center,var(--gold)_0%,transparent_70%)]" />

            <div className="max-container relative z-10">
                <div className="text-center mb-20 space-y-6">
                    <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">Governance & Oversight</span>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter">THE <span className="text-gold">COUNCIL</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leadership.map((leader, i) => (
                        <div key={i} className="leader-card glass-card p-10 rounded-2xl group border-white/5 hover:border-gold/30 transition-all text-center md:text-left">
                            <div className="space-y-6">
                                <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center text-gold mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-500 border border-gold/20">
                                    <AppIcon name={leader.icon} size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-black tracking-tighter group-hover:text-gold transition-colors">{leader.name}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{leader.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
