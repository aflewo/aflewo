"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
    {
        year: "2004",
        title: "The Birth",
        desc: "Inaugural event at CITAM Karen, birthed by the Sing Africa Alumni from Daystar University.",
        image: "/archival-1.jpg"
    },
    {
        year: "2007",
        title: "Nyayo Stadium",
        desc: "A massive shift in scale, uniting thousands in one of Kenya's primary national venues.",
        image: "/archival-2.jpg"
    },
    {
        year: "2013",
        title: "The Winners' Chapel Shift",
        desc: "Moving to the largest indoor facility in East Africa to handle over 15,000 worshippers.",
        image: "/mission-1.jpg"
    },
    {
        year: "2024",
        title: "Heirs of God’s Glory",
        desc: "Celebrating 20 years of the sound of heaven and the continental altars of worship.",
        image: "/archival-1.jpg"
    }
];

export default function AboutSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            timelineEvents.forEach((_, i) => {
                gsap.from(`.event-${i}`, {
                    scrollTrigger: {
                        trigger: `.event-${i}`,
                        start: "top 80%",
                        end: "top 20%",
                        toggleActions: "play none none reverse",
                    },
                    opacity: 0,
                    x: i % 2 === 0 ? -50 : 50,
                    duration: 1,
                    ease: "power2.out"
                });
            });

            // Parallax on image containers
            gsap.fromTo(".parallax-img",
                { yPercent: -10 },
                {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                    },
                    yPercent: 10
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="section-padding bg-background relative overflow-hidden" id="about">
            <div className="max-container">
                <div className="flex flex-col items-center text-center mb-24">
                    <div className="w-12 h-1 bg-gold mb-8" />
                    <h2 className="text-4xl md:text-6xl font-black mb-6">THE JOURNEY OF <span className="text-gold">ALTARS.</span></h2>
                    <p className="text-foreground/60 max-w-2xl font-medium text-lg leading-relaxed">
                        Since 2004, AFLEWO has been more than an event. It is a movement of unity, intercession, and the relentless pursuit of God's presence across Africa.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gold/20 hidden md:block" />

                    <div className="space-y-32 relative">
                        {timelineEvents.map((event, i) => (
                            <div
                                key={i}
                                className={`event-${i} flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-24`}
                            >
                                {/* Text Content */}
                                <div className="flex-1 text-center md:text-left space-y-6">
                                    <span className="text-6xl font-black text-gold/10 block mb-2">{event.year}</span>
                                    <h3 className="text-3xl font-bold tracking-tight">{event.title}</h3>
                                    <p className="text-foreground/60 leading-relaxed text-lg font-medium">
                                        {event.desc}
                                    </p>
                                </div>

                                {/* Image Content */}
                                <div className="flex-1 w-full aspect-[4/3] rounded-3xl overflow-hidden glass-card-elevated border-white/10 group relative">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 parallax-img scale-[1.25]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Decorative Text */}
            <div className="absolute -left-20 top-1/4 opacity-[0.02] pointer-events-none rotate-90 origin-left">
                <span className="text-[20rem] font-black uppercase tracking-tighter">Est. 2004</span>
            </div>
        </section>
    );
}
