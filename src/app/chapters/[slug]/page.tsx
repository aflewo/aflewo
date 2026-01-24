"use client";

import { useParams, notFound } from "next/navigation";
import { getChapter } from "@/lib/chapters";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-end pb-20 overflow-hidden">
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
                    <Link href="/#chapters" className="inline-flex items-center gap-3 text-gold text-[10px] font-black uppercase tracking-[0.3em] hover:gap-5 transition-all mb-8 bg-brown/40 backdrop-blur-md px-6 py-2 rounded-full border border-gold/10">
                        <AppIcon name="arrow_back" size={14} /> Back to Chapters
                    </Link>
                    <div className="animate-up space-y-4">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${chapter.color} text-white`}>
                            {chapter.status} Hub
                        </span>
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-none">
                            AFLEWO <br /><span className="text-gold uppercase">{chapter.name}</span>
                        </h1>
                        <p className="text-foreground/60 font-medium text-lg md:text-xl max-w-xl mx-auto md:mx-0">
                            Established in {chapter.established}, uniting thousands in the {chapter.country} region.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="section-padding">
                <div className="max-container flex flex-col lg:flex-row gap-24">
                    <div className="flex-1 space-y-16 animate-up">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px]">The Assignment</span>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">HUB IDENTITY</h2>
                            </div>
                            <p className="text-xl text-foreground/40 leading-relaxed font-medium">
                                {chapter.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="glass-card p-10 rounded-lg space-y-4 border-white/5">
                                <AppIcon name="calendar_month" className="text-gold" size={28} />
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Inception</p>
                                    <p className="text-2xl font-black text-white">{chapter.established}</p>
                                </div>
                            </div>
                            <div className="glass-card p-10 rounded-lg space-y-4 border-white/5">
                                <AppIcon name="location_on" className="text-gold" size={28} />
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Current Base</p>
                                    <p className="text-lg font-black text-white leading-tight">{chapter.venue.split(',')[0]}</p>
                                </div>
                            </div>
                            <div className="glass-card p-10 rounded-lg space-y-4 border-white/5">
                                <AppIcon name="groups" className="text-gold" size={28} />
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Gathering</p>
                                    <p className="text-2xl font-black text-white">{chapter.capacity || "5,000+"}</p>
                                </div>
                            </div>
                        </div>

                        {/* History Timeline */}
                        {chapter.history && (
                            <div className="space-y-10">
                                <div className="flex items-center gap-4">
                                    <AppIcon name="history" size={20} className="text-gold" />
                                    <h3 className="text-2xl font-black tracking-tighter text-white">MILESTONES</h3>
                                </div>
                                <div className="space-y-4">
                                    {chapter.history.map((h, i) => (
                                        <div key={i} className="flex gap-8 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20 font-black text-[10px]">
                                                    {h.year}
                                                </div>
                                                <div className="w-px h-full bg-white/5 group-last:hidden mt-4" />
                                            </div>
                                            <div className="pb-12 space-y-2">
                                                <h4 className="text-xl font-black text-white group-hover:text-gold transition-colors">{h.event}</h4>
                                                <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">{h.venue}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-96 space-y-8 animate-up">
                        {chapter.upcomingEvent && (
                            <div className="glass-card-elevated p-10 rounded-lg border-gold/20 bg-gold/5 space-y-8 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gold/5 animate-pulse" />
                                <div className="space-y-4 text-center relative z-10">
                                    <AppIcon name="milestone" size={32} className="text-gold mx-auto" />
                                    <h3 className="text-2xl font-black tracking-tighter text-white">UPCOMING GATHERING</h3>
                                    <p className="text-lg font-black text-gold uppercase tracking-tighter">{chapter.upcomingEvent}</p>
                                </div>
                                {chapter.registrationOpen && (
                                    <button className="relative z-10 w-full py-6 rounded-lg bg-gold text-brown font-black text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-glow">
                                        Secure Your Seat
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="glass-card-elevated p-10 rounded-lg space-y-8 border-white/5">
                            <h4 className="font-black text-[11px] uppercase tracking-[0.4em] text-gold text-center">Chapter Connect</h4>
                            <div className="space-y-4">
                                {chapter.contactPhone && (
                                    <Link href={`tel:${chapter.contactPhone}`} className="flex items-center gap-5 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-gold/30 transition-all text-foreground/60 hover:text-white capitalize">
                                        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold"><AppIcon name="call" size={18} /></div>
                                        <span className="text-xs font-black uppercase tracking-widest">Call Secretary</span>
                                    </Link>
                                )}
                                {chapter.contactEmail && (
                                    <Link href={`mailto:${chapter.contactEmail}`} className="flex items-center gap-5 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-gold/30 transition-all text-foreground/60 hover:text-white">
                                        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold"><AppIcon name="mail" size={18} /></div>
                                        <span className="text-xs font-black uppercase tracking-widest">Send Inquiry</span>
                                    </Link>
                                )}
                                <Link href="#" className="flex items-center gap-5 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-gold/30 transition-all text-foreground/60 hover:text-white">
                                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold"><AppIcon name="public" size={18} /></div>
                                    <span className="text-xs font-black uppercase tracking-widest">WhatsApp Hub</span>
                                </Link>
                            </div>
                        </div>

                        <div className="glass-card p-10 rounded-lg space-y-6 border-white/10 relative overflow-hidden bg-brown/20 group">
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
                            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-gold/40 text-center">Regional Prophetic Pillar</h4>
                            <p className="text-2xl text-center font-black uppercase tracking-tighter text-white leading-tight italic">
                                "THE <br /> SOUND <br /> OF <span className="text-gold">{chapter.name}</span>"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
