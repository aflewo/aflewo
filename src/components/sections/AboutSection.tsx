"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AppIcon from "@/components/ui/AppIcon";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
    { year: "2004", title: "The Birth", desc: "Sing Africa alumni birth the vision at CITAM Karen.", icon: "auto_awesome" },
    { year: "2007", title: "Nyayo Stadium", desc: "A massive shift in scale, uniting thousands in worship.", icon: "groups" },
    { year: "2013", title: "Winners' Chapel", desc: "Moving to East Africa's largest indoor facility.", icon: "location_home" },
    { year: "2024", title: "20-Year Legacy", desc: "Heirs of Glory celebrating two decades of worship.", icon: "military_tech" }
];

export default function AboutSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".milestone-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="section-padding bg-background relative overflow-hidden">
            <div className="max-container relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    <div className="lg:w-1/2 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.2em]">
                            <AppIcon name="explore" size={12} /> The Journey of Altars
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            HEIRS OF <br /> <span className="text-gold">GLORY.</span>
                        </h2>
                        <p className="text-foreground/60 text-xl font-medium leading-relaxed italic border-l-2 border-gold/30 pl-8">
                            "AFLEWO is not an event. It is a movement of unity, intercession, and the relentless pursuit of God{"'"}s presence across independent African nations."
                        </p>
                    </div>

                    <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {milestones.map((m, i) => (
                            <div key={i} className="milestone-card glass-card p-8 rounded-2xl group hover:border-gold/30 transition-all border border-white/5 bg-brown/10">
                                <div className="p-4 bg-gold/10 text-gold rounded-xl mb-6 w-fit group-hover:scale-110 transition-transform">
                                    <AppIcon name={m.icon} size={28} />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-gold font-black text-xs tracking-widest uppercase">{m.year}</span>
                                    <h3 className="text-2xl font-black tracking-tighter">{m.title}</h3>
                                    <p className="text-sm text-foreground/40 font-medium leading-loose">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Abstract Background Element */}
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[150px] -z-10" />
        </section>
    );
}
