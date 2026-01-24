"use client";

import { useParams, notFound } from "next/navigation";
import { chapters, getChapter } from "@/lib/chapters";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users, ArrowLeft, Phone, Mail, Globe, ExternalLink } from "lucide-react";
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
                stagger: 0.1,
                duration: 1,
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
            <section className="relative h-[60vh] flex items-end pb-12 overflow-hidden">
                <Image
                    src={chapter.venueImage || "/archival-1.jpg"}
                    alt={chapter.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                <div className="max-container relative z-10 space-y-4 px-6">
                    <Link href="/#chapters" className="inline-flex items-center gap-2 text-gold text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all mb-4">
                        <ArrowLeft size={14} /> Back to Chapters
                    </Link>
                    <div className="animate-up">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${chapter.color} text-white`}>
                            {chapter.status}
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mt-4">
                            AFLEWO <span className="text-gold">{chapter.name}</span>
                        </h1>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="section-padding">
                <div className="max-container flex flex-col lg:flex-row gap-20">
                    <div className="flex-1 space-y-12 animate-up">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-black tracking-tighter">About the Chapter</h2>
                            <p className="text-lg text-foreground/60 leading-relaxed font-medium">
                                {chapter.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card p-8 rounded-lg space-y-3">
                                <Calendar className="text-gold" size={24} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Established</p>
                                <p className="text-xl font-black">{chapter.established}</p>
                            </div>
                            <div className="glass-card p-8 rounded-lg space-y-3">
                                <MapPin className="text-gold" size={24} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Primary Venue</p>
                                <p className="text-xl font-black">{chapter.venue}</p>
                            </div>
                        </div>

                        {chapter.upcomingEvent && (
                            <div className="glass-card-elevated p-10 rounded-lg border-gold/20 bg-gold/5 space-y-6">
                                <div className="space-y-2 text-center">
                                    <h3 className="text-2xl font-black tracking-tighter">Upcoming Event</h3>
                                    <p className="text-xl font-bold text-gold">{chapter.upcomingEvent}</p>
                                </div>
                                {chapter.registrationOpen && (
                                    <button className="w-full py-4 rounded-lg bg-gold text-brown font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-glow">
                                        Register Now
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-80 space-y-8 animate-up">
                        <div className="glass-card p-8 rounded-lg space-y-6">
                            <h4 className="font-black text-xs uppercase tracking-widest text-gold">Contact Connect</h4>
                            <div className="space-y-4">
                                {chapter.contactPhone && (
                                    <Link href={`tel:${chapter.contactPhone}`} className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"><Phone size={18} /></div>
                                        <span className="text-sm font-bold">Call Us</span>
                                    </Link>
                                )}
                                {chapter.contactEmail && (
                                    <Link href={`mailto:${chapter.contactEmail}`} className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"><Mail size={18} /></div>
                                        <span className="text-sm font-bold">Email Us</span>
                                    </Link>
                                )}
                                <Link href="#" className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"><Globe size={18} /></div>
                                    <span className="text-sm font-bold">WhatsApp Group</span>
                                </Link>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-lg space-y-6 border-white/5">
                            <h4 className="font-black text-xs uppercase tracking-widest text-gold text-center">Prophetic Pillar</h4>
                            <p className="text-sm text-center font-black uppercase tracking-widest text-white/20 italic">
                                "The Sound <br /> of {chapter.name}"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
