"use client";

import { Play, Share2, Download, Music as MusicIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const tracks = [
    { id: 1, title: "Worthy Is The Lamb", artist: "AFLEWO Live 2024", duration: "8:45", type: "Live" },
    { id: 2, title: "One Africa (Anthem)", artist: "AFLEWO Collective", duration: "5:20", type: "Original" },
    { id: 3, title: "Praise Him", artist: "AFLEWO Legacy 2008", duration: "6:12", type: "Classic" },
    { id: 4, title: "Spirit of Unity", artist: "Worship Residency 2026", duration: "4:30", type: "Exp" },
];

export default function MusicSection() {
    return (
        <section className="py-24 px-6 bg-background" id="music">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-5xl md:text-7xl font-black text-gold uppercase tracking-tighter mb-4 italic">The Sound of Heaven</h2>
                        <p className="text-muted-foreground text-lg">
                            Explore two decades of African worship archives. From stadium anthems to intimate residency experiments.
                        </p>
                    </div>
                    <button className="press-scale glass-card px-8 py-3 text-gold font-bold uppercase tracking-widest text-sm border-gold/20">
                        View All Tracks
                    </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Featured Player Card */}
                    <div className="glass-card p-8 md:p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                        <div className="flex flex-col h-full justify-between gap-12 relative z-10">
                            <div className="flex justify-between items-start">
                                <div className="p-4 bg-gold/10 rounded-ios text-gold">
                                    <MusicIcon size={32} />
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 glass-card rounded-full hover:bg-gold/20 transition-all"><Share2 size={20} /></button>
                                    <button className="p-3 glass-card rounded-full hover:bg-gold/20 transition-all"><Download size={20} /></button>
                                </div>
                            </div>

                            <div>
                                <span className="text-gold font-bold uppercase tracking-widest text-sm mb-2 block">Now Playing • Live Experience</span>
                                <h3 className="text-4xl md:text-5xl font-black text-foreground mb-4">Worthy Is The Lamb</h3>
                                <p className="text-foreground/60 text-lg mb-8">Recorded Live at Kasarani Stadium, Nairobi.</p>

                                <div className="flex items-center gap-6">
                                    <button className="w-20 h-20 bg-gold rounded-full flex items-center justify-center text-brown shadow-glow press-scale">
                                        <Play fill="currentColor" size={32} />
                                    </button>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-1.5 bg-gold/10 rounded-full w-full relative overflow-hidden">
                                            <div className="absolute top-0 left-0 h-full bg-gold w-[45%]" />
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-gold/50 uppercase">
                                            <span>03:42</span>
                                            <span>08:45</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Track List */}
                    <div className="space-y-4">
                        {tracks.map((track) => (
                            <div key={track.id} className="group glass-card p-6 flex items-center justify-between hover:bg-gold/5 transition-all cursor-pointer border-transparent hover:border-gold/20">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-brown/40 rounded-ios flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-brown transition-all">
                                        <Play size={20} className={track.id === 1 ? "fill-current" : ""} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-foreground">{track.title}</h4>
                                        <p className="text-sm text-muted-foreground">{track.artist}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black px-2 py-1 bg-brown/40 text-gold rounded uppercase tracking-tighter">{track.type}</span>
                                    <span className="text-sm font-bold text-muted-foreground">{track.duration}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
