"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const partners = [
    { name: "Daystar University", logo: "/brand/daystar.png", role: "Founding Partner" },
    { name: "CITAM", logo: "/brand/citam.png", role: "Spiritual Partner" },
    { name: "Winners Chapel", logo: "/brand/winners.png", role: "Host Partner" },
    { name: "KBC", logo: "/brand/kbc.png", role: "Media Partner" },
];

export default function PartnersSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

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
            <div className="max-container flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                {partners.map((partner, i) => (
                    <div key={i} className="partner-logo flex flex-col items-center gap-2">
                        <div className="w-12 h-12 md:w-16 md:h-16 relative">
                            {/* Placeholder for actual logos */}
                            <div className="w-full h-full bg-white/20 rounded-lg animate-pulse" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/50">{partner.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
