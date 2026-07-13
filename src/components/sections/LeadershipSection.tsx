"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import SvgIcon from "@/components/ui/SvgIcon";

gsap.registerPlugin(ScrollTrigger);

const leaders = [
    { name: "Timothy Kaberia", role: "Visionary & Founder", image: "/leaders/timothy.jpg" },
    { name: "Ruguru", role: "Legacy Architect", image: "/leaders/ruguru.jpg" },
    { name: "Hubert Maura", role: "Board Chair", image: "/leaders/hubert.jpg" },
];

export default function LeadershipSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".leader-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                stagger: 0.15,
                duration: 1,
                ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="section-padding bg-background" id="leadership">
            <div className="max-container">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                    <h2 className="text-5xl font-black tracking-tighter">THE <span className="text-gold">STEWARDS.</span></h2>
                    <p className="text-foreground/40 max-w-xs font-bold text-sm uppercase tracking-widest">Guiding the prophetic vision since inception.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {leaders.map((leader, i) => (
                        <div key={i} className="leader-card group cursor-pointer">
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-card-elevated border-white/5 bg-brown/20 mb-6">
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 z-10" />
                                <div className="absolute inset-0 flex items-center justify-center text-white/5">
                                    <SvgIcon name="person" size={120} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black">{leader.name}</h3>
                            <p className="text-gold text-[10px] font-black uppercase tracking-widest mt-1">{leader.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
