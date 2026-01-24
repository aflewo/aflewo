"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import AppIcon from "@/components/ui/AppIcon";

gsap.registerPlugin(ScrollTrigger);

const opportunities = [
    {
        title: "Volunteer",
        desc: "Join production, music, or hospitality teams. Be part of the 1,000+ volunteers that make AFLEWO happen.",
        icon: "groups",
        href: "/join?tab=volunteer",
        stat: "1,000+ Volunteers",
        color: "from-gold/20 to-gold/5"
    },
    {
        title: "Partner",
        desc: "Support the vision technically or financially. Become a pillar of continental worship.",
        icon: "volunteer_activism",
        href: "/join?tab=partner",
        stat: "50+ Partners",
        color: "from-emerald/20 to-emerald/5"
    },
    {
        title: "Testify",
        desc: "Share your AFLEWO story with the world. Let your testimony ignite hope in others.",
        icon: "forum",
        href: "/join?tab=testify",
        stat: "∞ Stories",
        color: "from-purple-500/20 to-purple-500/5"
    }
];

export default function JoinCTA() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".join-header", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            });

            gsap.from(".opportunity-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
                y: 60,
                opacity: 0,
                stagger: 0.15,
                duration: 1.2,
                ease: "expo.out"
            });

            const cards = gsap.utils.toArray('.opportunity-card') as HTMLElement[];
            cards.forEach(card => {
                const icon = card.querySelector('.card-icon');
                const stat = card.querySelector('.card-stat');
                const arrow = card.querySelector('.card-arrow');

                if (icon && stat && arrow) {
                    card.addEventListener('mouseenter', () => {
                        gsap.to(icon, { scale: 1.2, rotate: 5, duration: 0.4, ease: "back.out(1.7)" });
                        gsap.to(stat, { y: -5, opacity: 1, duration: 0.3, ease: "power2.out" });
                        gsap.to(arrow, { x: 10, duration: 0.3, ease: "power2.out" });
                    });

                    card.addEventListener('mouseleave', () => {
                        gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3, ease: "power2.out" });
                        gsap.to(stat, { y: 0, opacity: 0.6, duration: 0.3, ease: "power2.out" });
                        gsap.to(arrow, { x: 0, duration: 0.3, ease: "power2.out" });
                    });
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="join" className="section-padding bg-background relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/[0.03] rounded-full blur-[120px]" />
            </div>

            <div className="max-container relative z-10">
                <div className="join-header text-center space-y-8 mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.2em]">
                        <AppIcon name="favorite" size={14} /> Join the Movement
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter">
                        BE THE <span className="text-gradient-gold">VOICE.</span>
                    </h2>
                    <p className="text-foreground/40 text-lg md:text-xl font-medium tracking-tight max-w-2xl mx-auto italic">
                        "Your contribution is the pulse of the vision. Whether through service, sponsorship, or stories, you are AFLEWO."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {opportunities.map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className="opportunity-card press-scale block group"
                        >
                            <div className={`relative h-full glass-card-elevated p-10 rounded-2xl border-white/5 bg-gradient-to-br ${item.color} group-hover:border-gold/30 transition-all duration-500 overflow-hidden`}>
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <AppIcon name={item.icon} size={120} />
                                </div>

                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="card-icon p-4 rounded-2xl bg-gold/10 text-gold">
                                            <AppIcon name={item.icon} size={32} />
                                        </div>
                                        <div className="card-stat text-right opacity-60">
                                            <AppIcon name="auto_awesome" size={16} className="text-gold mb-1 ml-auto" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gold/80">
                                                {item.stat}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        <h3 className="text-3xl font-black tracking-tighter group-hover:text-gold transition-colors">{item.title}</h3>
                                        <p className="text-sm text-foreground/40 font-medium leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/5">
                                        <span className="text-gold font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
                                            Reveal Opportunity
                                            <AppIcon name="arrow_forward" size={16} className="card-arrow" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/join"
                        className="press-scale inline-flex items-center gap-4 bg-gold text-brown px-12 py-5 rounded-full font-black uppercase tracking-tighter hover:brightness-110 transition-all shadow-lg"
                    >
                        View All Opportunities <AppIcon name="arrow_forward" size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
