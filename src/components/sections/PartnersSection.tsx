"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const initialPartners = [
    { name: "Daystar University", logo: "/brand/daystar.png", role: "Founding Partner" },
    { name: "CITAM", logo: "/brand/citam.png", role: "Spiritual Partner" },
    { name: "Winners Chapel", logo: "/brand/winners.png", role: "Host Partner" },
    { name: "KBC", logo: "/brand/kbc.png", role: "Media Partner" },
];

export default function PartnersSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [partners, setPartners] = useState(initialPartners);

    useEffect(() => {
        const fetchPartners = async () => {
            const { data, error } = await supabase.from('partners').select('*').order('sort_order', { ascending: true });
            if (data && !error && data.length > 0) {
                setPartners(data.map(d => ({
                    name: d.name,
                    role: d.role || '',
                    logo: d.logo || '/brand/citam.png'
                })));
            }
        };
        fetchPartners();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".partner-logo", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                },
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-20 bg-background border-y border-white/5 overflow-hidden">
            <div className="max-container">
                <div className="text-center mb-10">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Trusted Partners</span>
                </div>
                <div className="flex flex-wrap justify-center items-stretch gap-4 md:gap-6">
                    {partners.map((partner, i) => (
                        <div
                            key={i}
                            className="partner-logo group flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-gold/20 transition-all duration-500 cursor-default min-w-[160px]"
                            style={{
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                            }}
                        >
                            {/* Logo area with initials fallback behind */}
                            <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center bg-white/5 border border-white/8 group-hover:border-gold/20 transition-colors duration-500 relative">
                                {/* Initials badge — always rendered, image sits on top */}
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white/30 tracking-tighter pointer-events-none select-none" aria-hidden="true">
                                    {partner.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                                </span>
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    fill
                                    sizes="56px"
                                    className="object-contain opacity-50 group-hover:opacity-80 transition-opacity duration-500 p-1.5 relative z-10"
                                />
                            </div>
                            {/* Name */}
                            <p className="text-[11px] font-black uppercase tracking-wider text-white/40 group-hover:text-white/70 transition-colors duration-300 text-center leading-tight">
                                {partner.name}
                            </p>
                            {/* Role tag */}
                            <span className="text-[8px] font-black uppercase tracking-widest text-gold/40 group-hover:text-gold/70 transition-colors duration-300 px-2 py-0.5 rounded-full border border-gold/10 group-hover:border-gold/25">
                                {partner.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
