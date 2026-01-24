"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import AppIcon from "@/components/ui/AppIcon";

const partners = [
    { name: "Winners' Chapel", role: "Host Partner", logo: "/partner-1.png" },
    { name: "Citam Karen", role: "Founding Altar", logo: "/partner-2.png" },
    { name: "Daystar", role: "Legacy Partner", logo: "/partner-3.png" },
    { name: "Kijabe", role: "Strategic Partner", logo: "/partner-4.png" }
];

export default function PartnersSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".partner-logo", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "power3.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="partners" ref={containerRef} className="py-20 bg-background border-y border-white/5">
            <div className="max-container">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">Prophetic Alignment</span>
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground/30 flex items-center justify-center gap-4">
                        <span className="w-12 h-px bg-white/10 hidden md:block" />
                        Strategic Partners In Worship
                        <span className="w-12 h-px bg-white/10 hidden md:block" />
                    </h3>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-opacity duration-700">
                    {partners.map((partner, i) => (
                        <div key={i} className="partner-logo flex flex-col items-center gap-4 group">
                            <div className="h-12 w-32 relative grayscale group-hover:grayscale-0 transition-all duration-500 flex items-center justify-center">
                                <span className="font-black text-white/50 group-hover:text-gold text-lg tracking-tighter uppercase">{partner.name}</span>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-gold/60 transition-colors">{partner.role}</span>
                        </div>
                    ))}
                    <div className="partner-logo flex flex-col items-center gap-4 group cursor-pointer">
                        <div className="p-4 bg-white/5 rounded-full border border-white/10 text-white/20 group-hover:bg-gold/10 group-hover:text-gold group-hover:border-gold/30 transition-all">
                            <AppIcon name="add" size={24} />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Become a Partner</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
