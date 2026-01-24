"use client";

import AppIcon from "@/components/ui/AppIcon";
import Link from "next/link";
import { cn } from "@/lib/utils";

const waysToGive = [
    {
        title: "Seed of Faith",
        desc: "Support the operational costs and logistics of regional hubs.",
        id: "819867",
        icon: "savings",
        label: "M-Pesa Paybill"
    },
    {
        title: "Pillar of Music",
        desc: "Direct support for sound engineering and musical excellence.",
        id: "AFLEWO-MUSIC",
        icon: "music_note",
        label: "Direct Support"
    },
    {
        title: "Global Altar",
        desc: "International support for continental expansion and unity.",
        id: "AFLEWO-GLOBAL",
        icon: "public",
        label: "Wire Transfer"
    }
];

export default function DonateSection() {
    return (
        <section className="section-padding bg-background relative overflow-hidden" id="donate">
            <div className="max-container relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.2em]">
                            <AppIcon name="volunteer_activism" size={12} /> Steward the Vision
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            BUILD THE <br /> <span className="text-gold">ALTAR.</span>
                        </h2>
                        <p className="text-foreground/50 text-xl font-medium leading-relaxed italic max-w-md mx-auto lg:mx-0">
                            "Every gift is a brick in the continental altar. Your generosity fuels the united voice of Africa."
                        </p>

                        <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-4">
                            <div className="p-6 glass-card rounded-2xl border-gold/20 flex items-center gap-6">
                                <div className="p-4 bg-gold/10 rounded-xl text-gold">
                                    <AppIcon name="qr_code_2" size={32} />
                                </div>
                                <div className="text-left">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gold/60">Paybill Number</span>
                                    <p className="text-2xl font-black tracking-tighter">819867</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 grid grid-cols-1 gap-4 w-full">
                        {waysToGive.map((way, i) => (
                            <div key={i} className="group glass-card p-8 rounded-2xl flex items-center justify-between hover:border-gold/30 transition-all border border-white/5 bg-brown/5">
                                <div className="flex items-center gap-8">
                                    <div className="p-4 bg-white/5 rounded-2xl text-gold group-hover:bg-gold group-hover:text-brown transition-all">
                                        <AppIcon name={way.icon} size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-black tracking-tight group-hover:text-gold transition-colors">{way.title}</h4>
                                        <p className="text-xs text-white/30 font-medium leading-relaxed max-w-[240px]">{way.desc}</p>
                                    </div>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">{way.label}</span>
                                    <p className="text-gold font-black tracking-widest">{way.id}</p>
                                </div>
                            </div>
                        ))}

                        <Link
                            href="/join?tab=partner"
                            className="press-scale w-full py-6 bg-gold text-brown rounded-2xl font-black uppercase tracking-[0.3em] text-xs text-center shadow-glow hover:brightness-110 transition-all"
                        >
                            Explore Global Partnerships
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-gold/[0.02] rounded-full blur-[120px] -z-10" />
        </section>
    );
}

