"use client";

import { useParams, notFound } from "next/navigation";
import { chapters, getChapter } from "@/lib/chapters";
import Image from "next/image";
import Link from "next/link";
import AppIcon from "@/components/ui/AppIcon";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ChapterPage() {
    const { slug } = useParams();
    const chapter = getChapter(slug as string);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chapter) return;
        const ctx = gsap.context(() => {
            gsap.from(".animate-up", {
                y: 40,
                opacity: 0,
                stagger: 0.08,
                duration: 1.2,
                ease: "expo.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, [chapter]);

    if (!chapter) return notFound();

    return (
        <main ref={containerRef} className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[75vh] flex items-end pb-24 overflow-hidden">
                <Image
                    src={chapter.venueImage || "/archival-1.jpg"}
                    alt={chapter.name}
                    fill
                    className="object-cover scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                {/* Spiritual Mask */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,var(--gold)_0%,transparent_70%)]" />

                <div className="max-container relative z-10 space-y-6 px-6 text-center md:text-left">
                    <Link href="/#chapters" className="inline-flex items-center gap-4 text-gold text-[10px] font-black uppercase tracking-[0.4em] hover:gap-6 transition-all mb-10 bg-brown/40 backdrop-blur-3xl px-8 py-3 rounded-full border border-gold/10 shadow-glow">
                        <AppIcon name="arrow_back" size={16} /> Back to Chapters
                    </Link>
                    <div className="animate-up space-y-6">
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${chapter.color} text-white shadow-lg`}>
                                {chapter.status} Hub
                            </span>
                            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 px-4 py-1.5 rounded-full">
                                {chapter.country}
                            </span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white leading-[0.85] uppercase">
                            AFLEWO <br /><span className="text-gold">{chapter.name}</span>
                        </h1>
                        <p className="text-white/50 font-medium text-xl md:text-2xl max-w-xl mx-auto md:mx-0 italic leading-relaxed">
                            Established in {chapter.established}, uniting thousands in the prophetic sound of {chapter.name}.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="section-padding">
                <div className="max-container flex flex-col lg:flex-row gap-24">
                    <div className="flex-1 space-y-20 animate-up">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px]">The Assignment</span>
                                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase leading-tight">HUB IDENTITY</h2>
                            </div>
                            <p className="text-2xl text-foreground/40 leading-relaxed font-medium italic border-l-4 border-gold/20 pl-10">
                                {chapter.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="glass-card-elevated p-12 rounded-[2rem] space-y-6 border-white/5 bg-brown/10 shadow-xl group hover:border-gold/30 transition-all">
                                <AppIcon name="calendar_month" className="text-gold group-hover:scale-110 transition-transform" size={40} />
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Inception</p>
                                    <p className="text-3xl font-black text-white tracking-tighter">{chapter.established}</p>
                                </div>
                            </div>
                            <div className="glass-card-elevated p-12 rounded-[2rem] space-y-6 border-white/5 bg-brown/10 shadow-xl group hover:border-gold/30 transition-all">
                                <AppIcon name="location_on" className="text-gold group-hover:scale-110 transition-transform" size={40} />
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Current Base</p>
                                    <p className="text-xl font-black text-white leading-tight uppercase tracking-tighter">{chapter.venue.split(',')[0]}</p>
                                </div>
                            </div>
                            <div className="glass-card-elevated p-12 rounded-[2rem] space-y-6 border-white/5 bg-brown/10 shadow-xl group hover:border-gold/30 transition-all">
                                <AppIcon name="groups" className="text-gold group-hover:scale-110 transition-transform" size={40} />
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Gathering</p>
                                    <p className="text-3xl font-black text-white tracking-tighter">{chapter.capacity || "5,000+"}</p>
                                </div>
                            </div>
                        </div>

                        {/* History Timeline */}
                        {chapter.history && (
                            <div className="space-y-12">
                                <div className="flex items-center gap-6">
                                    <AppIcon name="history" size={32} className="text-gold" />
                                    <h3 className="text-3xl font-black tracking-tighter text-white uppercase">RECOGNIZED MILESTONES</h3>
                                </div>
                                <div className="space-y-4">
                                    {chapter.history.map((h, i) => (
                                        <div key={i} className="flex gap-10 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 font-black text-xs shadow-glow group-hover:bg-gold group-hover:text-brown transition-all">
                                                    {h.year}
                                                </div>
                                                <div className="w-px h-full bg-white/5 group-last:hidden mt-4" />
                                            </div>
                                            <div className="pb-16 space-y-3">
                                                <h4 className="text-3xl font-black text-white group-hover:text-gold transition-colors tracking-tighter uppercase leading-none">{h.event}</h4>
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{h.venue}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-96 space-y-10 animate-up">
                        {chapter.upcomingEvent && (
                            <div className="glass-card-elevated p-12 rounded-[2.5rem] border-gold/20 bg-gold/5 space-y-10 relative overflow-hidden group shadow-glow">
                                <div className="absolute inset-0 bg-gold/5 animate-pulse" />
                                <div className="space-y-4 text-center relative z-10">
                                    <AppIcon name="event_seat" size={48} className="text-gold mx-auto" />
                                    <h3 className="text-2xl font-black tracking-tighter text-white uppercase">UPCOMING GATHERING</h3>
                                    <p className="text-xl font-black text-gold uppercase tracking-tighter leading-tight italic">{chapter.upcomingEvent}</p>
                                </div>
                                {chapter.registrationOpen && (
                                    <button className="relative z-10 w-full py-6 rounded-2xl bg-gold text-brown font-black text-[11px] uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-glow border border-transparent hover:border-white/20">
                                        Secure Your Seat
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="glass-card-elevated p-12 rounded-[2.5rem] space-y-10 border-white/5 bg-brown/10">
                            <h4 className="font-black text-[11px] uppercase tracking-[0.4em] text-gold text-center">Chapter Connect</h4>
                            <div className="space-y-4">
                                {chapter.contactPhone && (
                                    <Link href={`tel:${chapter.contactPhone}`} className="flex items-center gap-6 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold/30 transition-all text-foreground/60 hover:text-white capitalize group">
                                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-brown transition-colors"><AppIcon name="call" size={20} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Call Secretary</span>
                                    </Link>
                                )}
                                {chapter.contactEmail && (
                                    <Link href={`mailto:${chapter.contactEmail}`} className="flex items-center gap-6 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold/30 transition-all text-foreground/60 hover:text-white group">
                                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-brown transition-colors"><AppIcon name="mail" size={20} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Send Inquiry</span>
                                    </Link>
                                )}
                                <div className="flex items-center gap-6 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold/30 transition-all text-foreground/60 hover:text-white group cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-brown transition-colors"><AppIcon name="forum" size={20} /></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">WhatsApp Hub</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-12 rounded-[2.5rem] space-y-8 border-white/10 relative overflow-hidden bg-brown/20 group">
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
                            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-gold/40 text-center">Regional Prophetic Pillar</h4>
                            <p className="text-3xl text-center font-black uppercase tracking-tighter text-white leading-[0.85] italic">
                                "THE <br /> SOUND <br /> OF <br /> <span className="text-gold uppercase">{chapter.name}</span>"
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
