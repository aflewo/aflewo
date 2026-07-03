"use client";

import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import AppIcon from "@/components/ui/AppIcon";

gsap.registerPlugin(ScrollTrigger);

// Expanded media catalog — real archival content titles and years from AFLEWO history
const archivalMedia = [
    { title: "The Altar of 15,000", year: "2024", type: "Image", thumb: "/archival-1.jpg", chapter: "Nairobi", desc: "Grace for Wholeness — October 2024" },
    { title: "Nairobi Pre-Launch Night", year: "2024", type: "Video", thumb: "/archival-1.jpg", src: "/hero-bg.mp4", chapter: "Nairobi", desc: "2024 Pre-event gathering at Winners Chapel" },
    { title: "Tanzania Worship Night", year: "2023", type: "Image", thumb: "/archival-2.jpg", chapter: "Tanzania", desc: "CCC Upanga Church, Dar es Salaam" },
    { title: "Healing in Kigali", year: "2014", type: "Image", thumb: "/mission-1.jpg", chapter: "Rwanda", desc: "20-year commemoration worship service" },
    { title: "Night of Wholeness", year: "2023", type: "Image", thumb: "/archival-1.jpg", chapter: "Nairobi", desc: "Winners Chapel International — full capacity" },
    { title: "Mombasa Prayer Circle", year: "2022", type: "Video", thumb: "/archival-2.jpg", src: "/hero-bg.mp4", chapter: "Mombasa", desc: "Nightly intercession gathering on the Coast" },
    { title: "Coast Revival", year: "2019", type: "Image", thumb: "/archival-2.jpg", chapter: "Mombasa", desc: "JCC Bamburi Centre — first thousand-voice gathering" },
    { title: "Nakuru Season Launch", year: "2022", type: "Image", thumb: "/mission-1.jpg", chapter: "Nakuru", desc: "Deliverance Church Nakuru opening night" },
    { title: "A Decade of Grace", year: "2013", type: "Image", thumb: "/archival-1.jpg", chapter: "Nairobi", desc: "10th anniversary, Sarit Centre Nairobi" },
    { title: "Sound of One Voice", year: "2016", type: "Video", thumb: "/mission-1.jpg", src: "/hero-bg.mp4", chapter: "Nairobi", desc: "1,000-voice national choir event" },
    { title: "Rwanda Reconciliation", year: "2014", type: "Image", thumb: "/archival-2.jpg", chapter: "Rwanda", desc: "Annual healing worship — April 7th" },
    { title: "The First Altar", year: "2004", type: "Image", thumb: "/mission-1.jpg", chapter: "Nairobi", desc: "CITAM Karen — the inaugural AFLEWO gathering" },
];

const filters = ["All", "Video", "Image", "Nairobi", "Mombasa", "Tanzania", "Rwanda", "Nakuru"];

interface LightboxProps {
    item: typeof archivalMedia[0] | null;
    onClose: () => void;
}

function Lightbox({ item, onClose }: LightboxProps) {
    useEffect(() => {
        if (!item) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
    }, [item, onClose]);

    if (!item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <div className="relative z-10 max-w-4xl w-full mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-white">{item.title}</h3>
                        <p className="text-gold text-[10px] font-black uppercase tracking-widest">{item.chapter} · {item.year}</p>
                    </div>
                    <button onClick={onClose} className="p-3 glass-card rounded-xl text-white hover:text-gold transition-colors">
                        <AppIcon name="close" size={24} />
                    </button>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden glass-card-elevated border-white/10">
                    {item.type === "Video" && item.src ? (
                        <video src={item.src} controls autoPlay muted className="w-full h-full object-cover" />
                    ) : (
                        <Image src={item.thumb} alt={item.title} fill className="object-cover" />
                    )}
                </div>

                <p className="text-white/50 text-sm font-bold">{item.desc}</p>
            </div>
        </div>
    );
}

export default function MediaPage() {
    const [filter, setFilter] = useState("All");
    const [lightboxItem, setLightboxItem] = useState<typeof archivalMedia[0] | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredMedia = filter === "All"
        ? archivalMedia
        : archivalMedia.filter((m) => m.type === filter || m.chapter === filter);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".media-item", {
                opacity: 0,
                y: 40,
                stagger: 0.08,
                duration: 0.9,
                ease: "expo.out",
                clearProps: "all",
            });
        }, containerRef);
        return () => ctx.revert();
    }, [filter]);

    return (
        <main className="bg-background min-h-screen">
            <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />

            <section className="pt-40 pb-20 px-6">
                <div className="max-container">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                        <div className="space-y-6">
                            <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">The Archive</span>
                            <h1 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                                VISUAL <br /><span className="text-gold">TESTIMONY.</span>
                            </h1>
                            <p className="text-foreground/40 max-w-md font-bold text-sm uppercase tracking-widest leading-relaxed">
                                20 years of worship, prayer, and continental unity — documented.
                            </p>
                        </div>
                        <div className="flex overflow-x-auto hide-scrollbar gap-2 glass-card p-2 rounded-full max-w-full">
                            {filters.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? "bg-gold text-brown" : "text-white/40 hover:text-white"}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {[
                            { label: "Years Archived", value: "20+" },
                            { label: "Chapters Covered", value: "11" },
                            { label: "Lives Documented", value: "15K+" },
                            { label: "Media Items", value: `${filteredMedia.length}` },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-6 rounded-lg text-center space-y-2">
                                <p className="text-3xl font-black text-gold">{stat.value}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMedia.map((item, i) => (
                            <button
                                key={i}
                                className="media-item group relative text-left rounded-[2rem] overflow-hidden glass-card border-white/5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
                                style={{ aspectRatio: i % 5 === 0 ? "16/9" : "4/5" }}
                                onClick={() => setLightboxItem(item)}
                                aria-label={`Open ${item.title}`}
                            >
                                <Image
                                    src={item.thumb}
                                    alt={item.title}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-all" />

                                {/* Type badge */}
                                <div className="absolute top-5 left-5 opacity-0 group-hover:opacity-100 transition-all translate-y-[-8px] group-hover:translate-y-0 duration-300">
                                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white flex items-center gap-2">
                                        {item.type === "Video"
                                            ? <><AppIcon name="play_circle" size={20} /><span className="text-[10px] font-black uppercase">Video</span></>
                                            : <><AppIcon name="image" size={20} /><span className="text-[10px] font-black uppercase">Photo</span></>
                                        }
                                    </div>
                                </div>

                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="space-y-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gold text-[10px] font-black uppercase tracking-widest">{item.chapter}</span>
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{item.year}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white group-hover:text-gold transition-colors">{item.title}</h3>
                                        <p className="text-white/50 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">{item.desc}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {filteredMedia.length === 0 && (
                        <div className="text-center py-24 space-y-4">
                            <AppIcon name="image_not_supported" size={48} className="text-white/20 mx-auto" />
                            <p className="text-white/40 font-black uppercase tracking-widest text-sm">No media found for this filter</p>
                        </div>
                    )}
                </div>
            </section>

            {/* YouTube CTA */}
            <section className="section-padding border-t border-white/5">
                <div className="max-container flex flex-col md:flex-row items-center justify-between gap-12 glass-card-elevated p-12 rounded-lg border-gold/10">
                    <div className="space-y-4">
                        <h3 className="text-4xl font-black tracking-tighter">WATCH ON <span className="text-gold">YOUTUBE</span></h3>
                        <p className="text-white/40 max-w-md font-bold text-sm uppercase tracking-widest leading-relaxed">
                            Full-length worship recordings, documentaries, and live streams from every AFLEWO gathering.
                        </p>
                    </div>
                    <a
                        href="https://youtube.com/@aflewo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="press-scale flex items-center gap-3 px-10 py-5 bg-gold text-brown rounded-lg font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shrink-0 shadow-glow"
                    >
                        <AppIcon name="play_circle" size={20} /> Watch on YouTube
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}
