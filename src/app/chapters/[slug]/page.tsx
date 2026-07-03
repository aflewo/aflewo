"use client";

import { useParams, notFound } from "next/navigation";
import { getChapter } from "@/lib/chapters";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import AppIcon from "@/components/ui/AppIcon";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface RegisterFormState { name: string; email: string; phone: string; }

function RegisterModal({ chapterName, eventName, onClose }: { chapterName: string; eventName: string; onClose: () => void }) {
    const [form, setForm] = useState<RegisterFormState>({ name: "", email: "", phone: "" });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); };
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 1200));
        const subject = encodeURIComponent(`AFLEWO ${chapterName} Registration — ${eventName}`);
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nChapter: ${chapterName}\nEvent: ${eventName}`);
        window.location.href = `mailto:${chapterName.toLowerCase()}@aflewo.org?subject=${subject}&body=${body}`;
        setSubmitting(false);
        setSubmitted(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <div className="relative z-10 w-full max-w-md glass-card-elevated rounded-2xl p-10 border-gold/20 space-y-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter">REGISTER <span className="text-gold">NOW</span></h3>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{chapterName} — {eventName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 glass-card rounded-lg text-white/50 hover:text-white">
                        <AppIcon name="close" size={20} />
                    </button>
                </div>
                {submitted ? (
                    <div className="text-center py-10 space-y-4">
                        <AppIcon name="check_circle" size={56} className="text-gold mx-auto" />
                        <h4 className="text-xl font-black">Registration Sent!</h4>
                        <p className="text-white/50 text-sm">We&apos;ll confirm to {form.email} within 24 hours.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Full Name *</label>
                            <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50"
                                placeholder="Your full name" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Email *</label>
                            <input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50"
                                placeholder="you@email.com" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Phone</label>
                            <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50"
                                placeholder="+254 700 000 000" />
                        </div>
                        <button type="submit" disabled={submitting}
                            className="w-full py-4 bg-gold text-brown rounded-lg font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            {submitting ? <><AppIcon name="autorenew" size={18} className="animate-spin" /> Sending...</> : <><AppIcon name="send" size={18} /> Confirm Registration</>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function ChapterPage() {
    const { slug } = useParams();
    const chapter = getChapter(slug as string);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        if (!chapter) return;
        const ctx = gsap.context(() => {
            gsap.from(".animate-up", {
                y: 40,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "expo.out",
            });
        }, containerRef);
        return () => ctx.revert();
    }, [chapter]);

    if (!chapter) return notFound();

    return (
        <main ref={containerRef} className="bg-background min-h-screen">
            {showRegister && (
                <RegisterModal
                    chapterName={chapter.name}
                    eventName={chapter.upcomingEvent || "2026 Event"}
                    onClose={() => setShowRegister(false)}
                />
            )}

            {/* Hero */}
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
                        <AppIcon name="arrow_back" size={14} /> Back to Chapters
                    </Link>
                    <div className="animate-up">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{chapter.flag}</span>
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${chapter.color} text-white border border-white/10`}>
                                {chapter.status}
                            </span>
                            {chapter.registrationOpen && (
                                <span className="px-3 py-1 rounded-full bg-emerald/20 text-emerald text-[8px] font-black uppercase tracking-widest">Registration Open</span>
                            )}
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
                            AFLEWO <span className="text-gold">{chapter.name}</span>
                        </h1>
                        <p className="text-white/50 font-bold text-sm uppercase tracking-widest mt-2">{chapter.country} · Est. {chapter.established}</p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section-padding">
                <div className="max-container flex flex-col lg:flex-row gap-20">
                    {/* Main */}
                    <div className="flex-1 space-y-12 animate-up">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-black tracking-tighter">About the Chapter</h2>
                            <p className="text-lg text-foreground/60 leading-relaxed font-medium">{chapter.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card p-8 rounded-lg space-y-3">
                                <AppIcon name="calendar_month" className="text-gold" size={24} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Established</p>
                                <p className="text-xl font-black">AFLEWO {chapter.established}</p>
                            </div>
                            <div className="glass-card p-8 rounded-lg space-y-3">
                                <AppIcon name="location_on" className="text-gold" size={24} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Primary Venue</p>
                                <p className="text-xl font-black">{chapter.venue}</p>
                            </div>
                            {chapter.capacity && (
                                <div className="glass-card p-8 rounded-lg space-y-3">
                                    <AppIcon name="groups" className="text-gold" size={24} />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Peak Capacity</p>
                                    <p className="text-xl font-black">{chapter.capacity} Souls</p>
                                </div>
                            )}
                            <div className="glass-card p-8 rounded-lg space-y-3">
                                <AppIcon name="flag" className="text-gold" size={24} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Nation</p>
                                <p className="text-xl font-black">{chapter.flag} {chapter.country}</p>
                            </div>
                        </div>

                        {chapter.upcomingEvent && (
                            <div className="glass-card-elevated p-10 rounded-lg border-gold/20 bg-gold/5 space-y-6">
                                <div className="space-y-2">
                                    <p className="text-gold text-[10px] font-black uppercase tracking-widest">Upcoming Event</p>
                                    <h3 className="text-2xl font-black tracking-tighter">{chapter.upcomingEvent}</h3>
                                    {chapter.hasPrayerCircle && (
                                        <p className="text-white/50 text-sm font-bold">
                                            Every night at 9:00 PM EAT via Zoom
                                        </p>
                                    )}
                                </div>
                                {chapter.registrationOpen && (
                                    <button
                                        onClick={() => setShowRegister(true)}
                                        className="w-full py-4 rounded-lg bg-gold text-brown font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-glow flex items-center justify-center gap-3"
                                    >
                                        <AppIcon name="how_to_reg" size={18} /> Register Now
                                    </button>
                                )}
                                {chapter.link && !chapter.registrationOpen && (
                                    <a
                                        href={chapter.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-4 rounded-lg bg-gold text-brown font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all text-center"
                                    >
                                        Open Registration Link
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 space-y-8 animate-up">
                        <div className="glass-card p-8 rounded-lg space-y-6">
                            <h4 className="font-black text-xs uppercase tracking-widest text-gold">Contact & Connect</h4>
                            <div className="space-y-4">
                                {chapter.contactPhone && (
                                    <a href={`tel:${chapter.contactPhone}`} className="flex items-center gap-4 text-white/60 hover:text-white transition-colors group">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                                            <AppIcon name="call" size={18} className="text-gold" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Call Us</p>
                                            <span className="text-sm font-bold">{chapter.contactPhone}</span>
                                        </div>
                                    </a>
                                )}
                                {chapter.contactEmail && (
                                    <a href={`mailto:${chapter.contactEmail}`} className="flex items-center gap-4 text-white/60 hover:text-white transition-colors group">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                                            <AppIcon name="mail" size={18} className="text-gold" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Email Us</p>
                                            <span className="text-sm font-bold">{chapter.contactEmail}</span>
                                        </div>
                                    </a>
                                )}
                                {chapter.whatsappLink && (
                                    <a href={chapter.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/60 hover:text-white transition-colors group">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                                            <AppIcon name="forum" size={18} className="text-gold" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">WhatsApp Group</p>
                                            <span className="text-sm font-bold">Join Community</span>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-lg space-y-6 border-white/5">
                            <h4 className="font-black text-xs uppercase tracking-widest text-gold text-center">Prophetic Pillar</h4>
                            <p className="text-sm text-center font-black uppercase tracking-widest text-white/20 italic">
                                &quot;The Sound <br />of {chapter.name}&quot;
                            </p>
                            <div className="w-12 h-px bg-gold/30 mx-auto" />
                            <p className="text-[10px] text-center font-black uppercase tracking-widest text-white/20">
                                Home {chapter.established} · {chapter.country}
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-lg space-y-4 border-white/5">
                            <h4 className="font-black text-xs uppercase tracking-widest text-gold">Support This Chapter</h4>
                            <p className="text-white/40 text-xs font-bold">M-Pesa Paybill</p>
                            <p className="text-2xl font-black text-gold">819867</p>
                            <p className="text-white/30 text-[10px] font-bold">Account: AFLEWO {chapter.name}</p>
                            <a href="tel:*456*819867#" className="block w-full py-3 text-center glass-card rounded-lg text-[10px] font-black uppercase tracking-widest text-gold hover:bg-gold/10 transition-colors">
                                Dial *456*819867#
                            </a>
                        </div>

                        <Link
                            href="/#chapters"
                            className="flex items-center gap-3 text-white/40 hover:text-gold transition-colors text-[10px] font-black uppercase tracking-widest"
                        >
                            <AppIcon name="arrow_back" size={14} /> All Chapters
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
