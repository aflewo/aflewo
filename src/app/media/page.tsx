"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import AppIcon from "@/components/ui/AppIcon";

const archivalMedia = [
    { title: "Nairobi Live", year: "2024", type: "Video", src: "/hero-bg.mp4", thumb: "/archival-1.jpg", chapter: "Nairobi" },
    { title: "Mombasa Night", year: "2009", type: "Image", src: "/archival-2.jpg", thumb: "/archival-2.jpg", chapter: "Mombasa" },
    { title: "Winners' Chapel Altar", year: "2013", type: "Image", src: "/mission-1.jpg", thumb: "/mission-1.jpg", chapter: "Nairobi" },
    { title: "Nakuru Revival", year: "2014", type: "Image", src: "/archival-1.jpg", thumb: "/archival-1.jpg", chapter: "Nakuru" },
    { title: " Rwanda Healing", year: "2014", type: "Image", src: "/archival-2.jpg", thumb: "/archival-2.jpg", chapter: "Kigali" },
    { title: "Documentary Segment", year: "2013", type: "Video", src: "/hero-bg.mp4", thumb: "/mission-1.jpg", chapter: "Documentary" },
];

export default function MediaPage() {
    const [filter, setFilter] = useState("All");
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredMedia = filter === "All"
        ? archivalMedia
        : archivalMedia.filter(m => m.type === filter || m.chapter === filter);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".media-item", {
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 0.8,
                ease: "power2.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, [filter]);

    return (
        <main className="bg-background min-h-screen">
            <Navbar />

            <section className="pt-40 pb-20 px-6">
                <div className="max-container">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                        <div className="space-y-6">
                            <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">The Archive</span>
                            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                                VISUAL <br /><span className="text-gold">TESTIMONY.</span>
                            </h1>
                        </div>
                        <div className="flex overflow-x-auto hide-scrollbar gap-4 glass-card p-2 rounded-full max-w-full">
                            {["All", "Video", "Image", "Nairobi", "Mombasa"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-gold text-brown" : "text-white/40 hover:text-white"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMedia.map((item, i) => (
                            <div key={i} className="media-item group relative aspect-[4/5] rounded-[2rem] overflow-hidden glass-card border-white/5 cursor-pointer">
                                <Image
                                    src={item.thumb}
                                    alt={item.title}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-all" />

                                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                    <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0">
                                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white">
                                            {item.type === "Video" ? <AppIcon name="play_circle" size={24} /> : <div className="w-6 h-6" />}
                                        </div>
                                        <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-gold hover:text-brown transition-colors">
                                            <AppIcon name="download" size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gold text-[10px] font-black uppercase tracking-widest">{item.chapter}</span>
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{item.year}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white group-hover:text-gold transition-colors">{item.title}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
