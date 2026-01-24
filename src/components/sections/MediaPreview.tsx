"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AppIcon from "@/components/ui/AppIcon";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface MediaItem {
    title: string;
    category: string;
    year: string;
    image: string;
    size: "large" | "medium" | "small";
    type: "photo" | "video" | "documentary";
    views?: string;
    chapter?: string;
}

const mediaItems: MediaItem[] = [
    {
        title: "The Altar of 15,000",
        category: "Main Event",
        year: "2024",
        image: "/archival-1.jpg",
        size: "large",
        type: "video",
        views: "25K",
        chapter: "Nairobi"
    },
    {
        title: "Night of Worship",
        category: "Coastal Revival",
        year: "2016",
        image: "/archival-2.jpg",
        size: "small",
        type: "photo",
        views: "8K",
        chapter: "Mombasa"
    },
    {
        title: "A Decade of Grace",
        category: "Documentary",
        year: "2014",
        image: "/mission-1.jpg",
        size: "medium",
        type: "documentary",
        views: "50K",
        chapter: "Continental"
    },
    {
        title: "Coast Revival",
        category: "Historical",
        year: "2009",
        image: "/archival-2.jpg",
        size: "small",
        type: "photo",
        views: "5K",
        chapter: "Mombasa"
    }
];

export default function MediaPreview() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
        const item = itemsRef.current[index];
        if (!item) return;

        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const moveX = (e.clientX - centerX) * 0.08;
        const moveY = (e.clientY - centerY) * 0.08;

        gsap.to(item, {
            x: moveX,
            y: moveY,
            scale: 1.02,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
        });
    }, []);

    const handleMouseLeave = useCallback((index: number) => {
        const item = itemsRef.current[index];
        if (!item) return;

        gsap.to(item, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)",
            overwrite: "auto"
        });
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".media-header", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                },
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: "expo.out"
            });

            gsap.from(".bento-item", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
                scale: 0.9,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "expo.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const getTypeIcon = (type: string, size: number = 24) => {
        if (type === "video" || type === "documentary") {
            return <AppIcon name="play_arrow" size={size} />;
        }
        return <AppIcon name="visibility" size={size} />;
    };

    return (
        <section ref={sectionRef} className="section-padding bg-background relative" id="media">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-container relative z-10">
                <div className="media-header flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.2em]">
                            <AppIcon name="calendar_month" size={12} /> The Archive
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            THE SOUND <br />
                            <span className="text-gold uppercase">OF HEAVEN</span>
                        </h2>
                        <p className="text-foreground/50 max-w-md font-medium text-center md:text-left">
                            20 years of worship captured — from the first gathering to today{"'"}s continental movement
                        </p>
                    </div>
                    <Link
                        href="/media"
                        className="press-scale flex items-center gap-3 px-6 py-3 glass-card rounded-full text-gold font-black uppercase tracking-widest text-xs hover:bg-gold hover:text-brown transition-all"
                    >
                        Explore Gallery <AppIcon name="arrow_forward" size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[180px] gap-4">
                    {mediaItems.map((item, i) => (
                        <Link
                            href="/media"
                            key={i}
                            ref={(el) => { itemsRef.current[i] = el; }}
                            onMouseMove={(e) => handleMouseMove(e, i)}
                            onMouseLeave={() => handleMouseLeave(i)}
                            className={`bento-item relative rounded-lg overflow-hidden glass-card border-white/5 group cursor-pointer
                                ${item.size === "large" ? "md:col-span-2 md:row-span-2" : ""}
                                ${item.size === "medium" ? "md:col-span-2 md:row-span-1" : ""}
                                ${item.size === "small" ? "md:col-span-1 md:row-span-1" : ""}
                            `}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 rounded-full bg-gold/20 backdrop-blur-sm text-gold text-[9px] font-black uppercase tracking-widest">
                                            {item.category}
                                        </span>
                                        {item.chapter && (
                                            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/70 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                                <AppIcon name="location_on" size={10} /> {item.chapter}
                                            </span>
                                        )}
                                    </div>
                                    {item.views && (
                                        <span className="flex items-center gap-1 text-white/50 text-[10px] font-black">
                                            <AppIcon name="visibility" size={12} /> {item.views}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <span className="text-gold text-[10px] font-black uppercase tracking-widest">{item.year}</span>
                                        <h3 className={`font-black text-white mt-1 ${item.size === "large" ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
                                            }`}>
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <button className="p-3 bg-gold rounded-full text-brown flex items-center justify-center hover:scale-110 transition-transform">
                                            {getTypeIcon(item.type, item.size === "small" ? 16 : 24)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Photos", value: "5,000+", icon: "visibility" },
                        { label: "Videos", value: "200+", icon: "play_arrow" },
                        { label: "Years Archived", value: "20", icon: "calendar_month" },
                        { label: "Chapters", value: "10", icon: "location_on" }
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 rounded-2xl text-center group hover:border-gold/20 transition-colors">
                            <AppIcon name={stat.icon} size={24} className="mx-auto text-gold mb-3 group-hover:scale-110 transition-transform" />
                            <div className="text-2xl font-black text-white">{stat.value}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
