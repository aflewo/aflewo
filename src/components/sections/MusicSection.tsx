"use client";

import AppIcon from "@/components/ui/AppIcon";
import { cn } from "@/lib/utils";

const tracks = [
    { id: 1, title: "Grace for Wholeness", artist: "AFLEWO Nairobi", duration: "12:45", category: "New Release", image: "/media-1.jpg" },
    { id: 2, title: "Heirs of Glory", artist: "Continental Anthem", duration: "08:12", category: "Classic", image: "/media-2.jpg" },
    { id: 3, title: "Savannah Winds", artist: "AFLEWO Mombasa", duration: "15:20", category: "Live", image: "/media-3.jpg" },
];

export default function MusicSection() {
    return (
        <section id="music" className="section-padding bg-background relative overflow-hidden">
            <div className="max-container flex flex-col lg:flex-row gap-16 items-start">
                <div className="lg:w-1/2 space-y-12">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.2em]">
                            <AppIcon name="music_note" size={12} /> The Sound Archive
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            HEAVEN'S <br /> <span className="text-gold">ECHO.</span>
                        </h2>
                        <p className="text-foreground/50 max-w-md font-medium text-lg italic">
                            Stream the anthems that have defined continental worship for two decades. High-fidelity recordings from Nyayo Stadium to Winners' Chapel.
                        </p>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-gold/5 blur-3xl group-hover:bg-gold/10 transition-colors" />
                        <div className="relative glass-card-elevated p-8 md:p-12 rounded-[2.5rem] border-white/5 overflow-hidden">
                            <div className="flex flex-col h-full justify-between gap-12 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 bg-gold/10 rounded-ios text-gold">
                                        <AppIcon name="music_note" size={32} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-3 glass-card rounded-full hover:bg-gold/20 transition-all"><AppIcon name="share" size={20} /></button>
                                        <button className="p-3 glass-card rounded-full hover:bg-gold/20 transition-all"><AppIcon name="download" size={20} /></button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-gold font-black uppercase tracking-[0.3em] text-[10px]">Now Streaming</span>
                                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter">Grace for Wholeness</h3>
                                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Live at Winners' Chapel Nairobi</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <button className="w-20 h-20 bg-gold rounded-full flex items-center justify-center text-brown shadow-glow press-scale">
                                        <AppIcon name="play_arrow" size={32} />
                                    </button>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-1.5 bg-gold/10 rounded-full w-full relative overflow-hidden">
                                            <div className="absolute inset-y-0 left-0 w-1/3 bg-gold shadow-glow" />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                                            <span>04:12</span>
                                            <span>12:45</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2 w-full space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 px-4">Trending Anthems</h4>
                    <div className="space-y-3">
                        {tracks.map(track => (
                            <div key={track.id} className="group glass-card p-6 flex items-center justify-between hover:bg-gold/5 transition-all cursor-pointer border-transparent hover:border-gold/20">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-brown/40 rounded-ios flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-brown transition-all">
                                        <AppIcon name="play_arrow" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-foreground">{track.title}</h4>
                                        <p className="text-xs text-foreground/40 font-medium">{track.artist}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest hidden md:block">{track.category}</span>
                                    <span className="text-sm font-bold opacity-30 group-hover:opacity-100 transition-opacity">{track.duration}</span>
                                    <button className="text-white/20 hover:text-gold transition-colors">
                                        <AppIcon name="more_vert" size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 py-5 glass-card rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] text-gold/60 hover:text-gold hover:bg-gold/5 transition-all flex items-center justify-center gap-4">
                        Load Full Discography <AppIcon name="keyboard_arrow_down" size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}

