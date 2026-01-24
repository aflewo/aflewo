"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import AppIcon from "@/components/ui/AppIcon";
import { cn } from "@/lib/utils";

const archivalMedia = [
    { title: "Nairobi Live", year: "2024", type: "Video", src: "/hero-bg.mp4", thumb: "/archival-1.jpg", chapter: "Nairobi", event: "Main Night" },
    { title: "Mombasa Night", year: "2009", type: "Image", src: "/archival-2.jpg", thumb: "/archival-2.jpg", chapter: "Mombasa", event: "Launch" },
    { title: "Winners' Chapel Altar", year: "2013", type: "Image", src: "/mission-1.jpg", thumb: "/mission-1.jpg", chapter: "Nairobi", event: "10th Anniversary" },
    { title: "Nakuru Revival", year: "2014", type: "Image", src: "/archival-1.jpg", thumb: "/archival-1.jpg", chapter: "Nakuru", event: "Rift Valley Launch" },
    { title: "Rwanda Healing", year: "2014", type: "Image", src: "/archival-2.jpg", thumb: "/archival-2.jpg", chapter: "Kigali", event: "Commemoration" },
    { title: "Documentary Segment", year: "2013", type: "Video", src: "/hero-bg.mp4", thumb: "/mission-1.jpg", chapter: "History", event: "Origins" },
];

const types = ["All", "Image", "Video"];
const chapters = ["All", "Nairobi", "Mombasa", "Nakuru", "Kigali"];
const eras = ["All", "2004-2010", "2011-2019", "2020-Present"];

export default function MediaPage() {
    const [activeType, setActiveType] = useState("All");
    const [activeChapter, setActiveChapter] = useState("All");
    const [activeEra, setActiveEra] = useState("All");
    const [showFilters, setShowFilters] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const filteredMedia = archivalMedia.filter(m => {
        const typeMatch = activeType === "All" || m.type === activeType;
        const chapterMatch = activeChapter === "All" || m.chapter === activeChapter;
        // Era logic simplified for demonstration
        const eraMatch = activeEra === "All" || (activeEra === "2004-2010" && parseInt(m.year) <= 2010);
        return typeMatch && chapterMatch && eraMatch;
    });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".media-item", {
                opacity: 0,
                y: 30,
                stagger: 0.05,
                duration: 0.8,
                ease: "expo.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, [activeType, activeChapter, activeEra]);

    return (
        <main className="bg-background min-h-screen">
            <section className="pt-40 pb-32 px-6">
                <div className="max-container">
                    <div className="flex flex-col items-center text-center space-y-8 mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.3em]">
                            <AppIcon name="photo_camera" size={12} /> The Eternal Record
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white">
                            FAITH IN <br /><span className="text-gold uppercase">MOTION</span>
                        </h1>
                        <p className="max-w-2xl text-foreground/40 font-medium text-xl leading-relaxed italic">
                            A curated archive of transformations, worship nights, and the prophetic journey from CITAM Karen to the Continent.
                        </p>
                    </div>

                    {/* Main Menu: Type Filter */}
                    <div className="flex flex-col items-center gap-8 mb-12">
                        <div className="flex gap-2 p-2 glass-card rounded-2xl border-white/5 bg-brown/10">
                            {types.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setActiveType(t)}
                                    className={cn(
                                        "px-10 py-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                        activeType === t ? "bg-gold text-brown shadow-glow" : "text-white/40 hover:text-white"
                                    )}
                                >
                                    {t === "Video" ? <AppIcon name="play_arrow" size={14} /> : t === "Image" ? <AppIcon name="image" size={14} /> : null}
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Extended Filters Trigger */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all",
                                showFilters ? "text-gold" : "text-white/40 hover:text-white"
                            )}
                        >
                            <AppIcon name="filter_list" size={14} /> {showFilters ? "Hide Filters" : "Advanced Search"}
                            <AppIcon name="keyboard_arrow_down" size={14} className={cn("transition-transform duration-300", showFilters && "rotate-180")} />
                        </button>
                    </div>

                    {/* Filter Panel */}
                    <div className={cn(
                        "grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 overflow-hidden transition-all duration-500",
                        showFilters ? "max-h-[500px] opacity-100 mb-20" : "max-h-0 opacity-0 mb-0"
                    )}>
                        <div className="glass-card p-10 rounded-2xl space-y-8 border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center gap-3">
                                <AppIcon name="location_on" size={14} /> Chapter
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {chapters.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setActiveChapter(c)}
                                        className={cn(
                                            "px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                                            activeChapter === c ? "border-gold bg-gold/10 text-white" : "border-white/5 bg-white/5 text-white/40 hover:text-white"
                                        )}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card p-10 rounded-2xl space-y-8 border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center gap-3">
                                <AppIcon name="calendar_today" size={14} /> Time / Era
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {eras.map(e => (
                                    <button
                                        key={e}
                                        onClick={() => setActiveEra(e)}
                                        className={cn(
                                            "px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                                            activeEra === e ? "border-gold bg-gold/10 text-white" : "border-white/5 bg-white/5 text-white/40 hover:text-white"
                                        )}
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                        {filteredMedia.length > 0 ? (
                            filteredMedia.map((item, i) => (
                                <div key={i} className="media-item group relative aspect-[4/5] rounded-3xl overflow-hidden glass-card-elevated border-white/5 cursor-pointer shadow-2xl">
                                    <Image
                                        src={item.thumb}
                                        alt={item.title}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-95 transition-all" />

                                    <div className="absolute inset-0 p-10 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white border border-white/10 shadow-glow">
                                                <AppIcon name={item.type === "Video" ? "play_arrow" : "image"} size={24} className="text-gold" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 rounded-full bg-gold text-brown text-[8px] font-black uppercase tracking-widest leading-none">
                                                    {item.chapter}
                                                </span>
                                                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">
                                                    {item.year} • {item.event}
                                                </span>
                                            </div>
                                            <h3 className="text-3xl font-black text-white group-hover:text-gold transition-colors leading-[0.9] uppercase tracking-tighter">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-40 text-center space-y-8 opacity-50">
                                <AppIcon name="search_off" size={64} className="mx-auto text-gold" />
                                <div className="space-y-2">
                                    <p className="text-3xl font-black tracking-tighter uppercase">THE RECORD IS STILL TO BE REVEALED</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gold/60">Adjust filters to find historical milestones</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
