"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight, Calendar, MapPin, Eye } from "lucide-react";

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
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const magneticRefs = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc }[]>([]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
        if (!magneticRefs.current[index]) return;
        const item = itemsRef.current[index];
        if (!item) return;

        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        magneticRefs.current[index].x(x * 0.03);
        magneticRefs.current[index].y(y * 0.03);
    }, []);

    const handleMouseLeave = useCallback((index: number) => {
        if (!magneticRefs.current[index]) return;
        magneticRefs.current[index].x(0);
        magneticRefs.current[index].y(0);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            itemsRef.current.forEach((item, index) => {
                if (item) {
                    magneticRefs.current[index] = {
                        x: gsap.quickTo(item, "x", { duration: 0.6, ease: "power3.out" }),
                        y: gsap.quickTo(item, "y", { duration: 0.6, ease: "power3.out" })
                    };
                }
            });

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

    const getTypeIcon = (type: string) => {
        if (type === "video" || type === "documentary") {
            return <Play size={24} fill="currentColor" stroke="none" />;
        }
        return <Eye size={24} />;
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
                            <Calendar size={12} /> The Archive
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                            THE SOUND <br />
                            <span className="text-gold">OF HEAVEN</span>
                        </h2>
                        <p className="text-foreground/50 max-w-md font-medium">
                            20 years of worship captured. From the first gathering to today's continental movement.
                        </p>
                    </div>
                    <Link
                        href="/media"
                        className="press-scale flex items-center gap-3 px-6 py-3 glass-card rounded-full text-gold font-black uppercase tracking-widest text-xs hover:bg-gold hover:text-brown transition-all"
                    >
                        Explore Gallery <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[180px] gap-4">
                    {mediaItems.map((item, i) => (
                        <Link
                            href="/media"
                            key={i}
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
                                                <MapPin size={10} /> {item.chapter}
                                            </span>
                                        )}
                                    </div>
                                    {item.views && (
                                        <span className="flex items-center gap-1 text-white/50 text-[10px] font-black">
                                            <Eye size={12} /> {item.views}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <span className="text-gold text-[10px] font-black uppercase tracking-widest">{item.year}</span>
                                        <h3 className={`font-black text-white mt-1 ${item.size === "large" ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
                                            }`}>
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <button className="p-4 bg-gold rounded-full text-brown flex items-center justify-center hover:scale-110 transition-transform">
                                            {getTypeIcon(item.type)}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/30 rounded-lg transition-colors duration-500 pointer-events-none" />
                        </Link>
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Photos", value: "5,000+", icon: Eye },
                        { label: "Videos", value: "200+", icon: Play },
                        { label: "Years Archived", value: "20", icon: Calendar },
                        { label: "Chapters", value: "10", icon: MapPin }
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 rounded-2xl text-center group hover:border-gold/20 transition-colors">
                            <stat.icon className="mx-auto text-gold mb-3 group-hover:scale-110 transition-transform" size={24} />
                            <div className="text-2xl font-black text-white">{stat.value}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
