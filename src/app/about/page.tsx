"use client";

import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import AppIcon from "@/components/ui/AppIcon";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
    { title: "Unity", desc: "Bringing the diverse church of Africa into a single, cohesive voice of worship — across denominations, nations, and languages.", icon: "groups" },
    { title: "Hope", desc: "Stirring up the expectation of God's goodness across the 'prophetic house' of Africa through music and intercession.", icon: "auto_awesome" },
    { title: "Excellence", desc: "Presenting our worship with the highest standard of musical and logistical skill — because what we offer God deserves our best.", icon: "verified" },
    { title: "Intercession", desc: "Standing in the gap for nations like DR Congo, Nigeria, and South Sudan — praying them into their prophetic destiny.", icon: "favorite" },
];

const timeline = [
    {
        year: "2003",
        title: "The Burden Is Born",
        desc: "The Daystar University Christian Fellowship's Sing Africa choir graduates form a prayer group. A simple question arises: what if the whole church of Africa worshipped together? The phrase 'Africa Let's Worship' is coined.",
        image: "/archival-1.jpg",
    },
    {
        year: "2004",
        title: "The First Altar",
        desc: "October 2004. CITAM Karen, Nairobi. The inaugural AFLEWO gathering draws 800 worshippers. Hubert de Rogue Maura takes the chairmanship. Timothy Kaberia and Ruguru lead worship. A movement is born.",
        image: "/mission-1.jpg",
    },
    {
        year: "2009",
        title: "The Coast Answers",
        desc: "AFLEWO Mombasa is established at JCC Bamburi Centre. The chapter immediately sets itself apart through its nightly prayer culture, creating what would later become the Mombasa Prayer Circle.",
        image: "/archival-2.jpg",
    },
    {
        year: "2010",
        title: "Beyond Kenya's Borders",
        desc: "AFLEWO Tanzania becomes the first international chapter, launched at CCC Upanga Church in Dar es Salaam. The movement ceases to be Kenyan and becomes continental.",
        image: "/archival-1.jpg",
    },
    {
        year: "2013",
        title: "1,000 Voices",
        desc: "The 1,000-Voice National Choir event at Winners Chapel International marks a turning point. AFLEWO Nakuru is founded. The Nairobi chapter crosses 10,000 attendees for the first time.",
        image: "/mission-1.jpg",
    },
    {
        year: "2014",
        title: "Rwanda Sings",
        desc: "On April 7th, the 20th anniversary of the Rwandan Genocide, AFLEWO Rwanda launches its first gathering as a deliberate act of prophetic healing. Rwanda's church chooses worship over silence.",
        image: "/archival-2.jpg",
    },
    {
        year: "2024",
        title: "Grace for Wholeness",
        desc: "The 20th anniversary AFLEWO at Winners Chapel International draws 15,000 worshippers. 11 chapters across 4 countries participate simultaneously. The movement enters its 22nd prophetic year.",
        image: "/archival-1.jpg",
    },
];

const leadership = [
    {
        name: "Hubert de Rogue Maura",
        role: "Chairman & Founder",
        tenure: "2004 – Present",
        desc: "The organisational architect of the AFLEWO movement. Maura has chaired the national oversight board since inception, providing continuity through the movement's 22 seasons.",
        image: "/mission-1.jpg",
    },
    {
        name: "Timothy Kaberia",
        role: "Founding Worship Director",
        tenure: "2004 – 2016",
        desc: "One of the two founding worship leaders from the Daystar Sing Africa alumni. Kaberia shaped the musical theology of AFLEWO's early years and trained the first generation of chapter worship leaders.",
        image: "/archival-1.jpg",
    },
    {
        name: "Ruguru",
        role: "Founding Worship Director",
        tenure: "2004 – 2012",
        desc: "Co-leader of the founding worship team alongside Kaberia. The phrase 'Africa Let's Worship' was coined in partnership between these two voices that shaped the movement's prophetic identity.",
        image: "/archival-2.jpg",
    },
];

interface AlumniFormState { name: string; email: string; chapter: string; years: string; role: string; }

function AlumniUpdateModal({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState<AlumniFormState>({ name: "", email: "", chapter: "", years: "", role: "" });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 1200));
        const subject = encodeURIComponent(`AFLEWO Alumni Registration — ${form.name}`);
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nChapter: ${form.chapter}\nYears of Service: ${form.years}\nRole: ${form.role}`);
        window.location.href = `mailto:alumni@aflewo.org?subject=${subject}&body=${body}`;
        setSubmitting(false);
        setSubmitted(true);
    };

    useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
            <div className="relative z-10 w-full max-w-xl glass-card-elevated rounded-2xl p-10 border-gold/20 space-y-8">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black tracking-tighter">ALUMNI <span className="text-gold">REGISTRATION</span></h3>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Connect with the AFLEWO legacy network</p>
                    </div>
                    <button onClick={onClose} className="p-2 glass-card rounded-lg text-white/50 hover:text-white">
                        <AppIcon name="close" size={20} />
                    </button>
                </div>
                {submitted ? (
                    <div className="text-center py-12 space-y-4">
                        <AppIcon name="verified" size={56} className="text-gold mx-auto" />
                        <h4 className="text-xl font-black">Welcome Back, {form.name}!</h4>
                        <p className="text-white/50 text-sm">We&apos;ll reach out to {form.email} within 48 hours.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gold">Full Name *</label>
                                <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50" placeholder="Your name" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gold">Email *</label>
                                <input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50" placeholder="you@email.com" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gold">Chapter</label>
                                <select value={form.chapter} onChange={(e) => setForm((p) => ({ ...p, chapter: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50 appearance-none">
                                    <option value="">Select chapter</option>
                                    {["Nairobi", "Mombasa", "Nakuru", "Eldoret", "Tanzania", "Rwanda", "Kampala", "Other"].map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gold">Years of Service</label>
                                <input value={form.years} onChange={(e) => setForm((p) => ({ ...p, years: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50" placeholder="e.g. 2010–2018" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Role(s) Served</label>
                            <input value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50" placeholder="e.g. Alto, Sound Engineer, Usher" />
                        </div>
                        <button type="submit" disabled={submitting}
                            className="w-full py-4 bg-gold text-brown rounded-lg font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            {submitting ? <><AppIcon name="autorenew" size={18} className="animate-spin" /> Submitting...</> : <><AppIcon name="how_to_reg" size={18} /> Register as Alumni</>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showAlumniModal, setShowAlumniModal] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".about-hero-text", { y: 100, opacity: 0, duration: 1.5, ease: "expo.out" });
            gsap.from(".pillar-card", {
                scrollTrigger: { trigger: ".pillars-grid", start: "top 80%" },
                y: 50, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out",
            });
            gsap.from(".timeline-item", {
                scrollTrigger: { trigger: ".timeline-section", start: "top 80%" },
                x: (i) => (i % 2 === 0 ? -60 : 60), opacity: 0, stagger: 0.15, duration: 1, ease: "power3.out",
            });
            gsap.from(".leader-card", {
                scrollTrigger: { trigger: ".leadership-grid", start: "top 80%" },
                y: 40, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="bg-background min-h-screen">
            {showAlumniModal && <AlumniUpdateModal onClose={() => setShowAlumniModal(false)} />}

            {/* Hero */}
            <section className="relative pt-40 pb-24 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 blur-3xl bg-gold/20 -z-10" />
                <div className="max-container">
                    <div className="about-hero-text max-w-4xl space-y-8">
                        <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">Our Identity</span>
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                            THE VISION <br />
                            <span className="text-gold">BEHIND THE ALTAR.</span>
                        </h1>
                        <p className="text-2xl text-foreground/60 font-medium leading-relaxed italic">
                            AFLEWO — Africa Let&apos;s Worship — is a movement birthed from the heart of Daystar University alumni,
                            committed to raising an annual altar of worship and prayer for the nations of Africa since 2004.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="px-6 pb-12">
                <div className="max-container grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { value: "22", label: "Years of Worship" },
                        { value: "11", label: "Active Chapters" },
                        { value: "15K+", label: "Nairobi Capacity" },
                        { value: "4", label: "Nations" },
                    ].map((s, i) => (
                        <div key={i} className="glass-card p-8 rounded-lg text-center space-y-2">
                            <p className="text-4xl font-black text-gold">{s.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section-padding">
                <div className="max-container grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card-elevated p-12 space-y-6 md:mt-12 rounded-[2rem]">
                        <h3 className="text-gold font-black uppercase tracking-widest text-xs">The Mission</h3>
                        <h2 className="text-4xl font-black tracking-tight">PURSUING UNITY <span className="text-gold">IN WORSHIP.</span></h2>
                        <p className="text-foreground/60 font-medium leading-loose text-lg">
                            To stir up hope in Jesus through annual large-scale musical and prayer events from a united church front across Africa.
                            Since 2004, we have provided a platform where denominations fade, and the name of Jesus is exalted above every label and division.
                        </p>
                    </div>
                    <div className="bg-primary text-primary-foreground p-12 rounded-[2rem] space-y-6">
                        <h3 className="text-gold font-black uppercase tracking-widest text-xs">The Vision</h3>
                        <h2 className="text-4xl font-black tracking-tight text-white">A PROPHETIC <span className="text-gold">HOUSE.</span></h2>
                        <p className="text-white/60 font-medium leading-loose text-lg">
                            To see all of Africa seeing itself through the eyes of its Maker. We achieve this through corporate worship,
                            establishing local chapters that maintain the pulse of intercession in every major African city — a prophetic house
                            that never closes its doors.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="section-padding bg-background/50" id="pillars">
                <div className="max-container">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                        <h2 className="text-5xl font-black tracking-tighter">OUR GUIDING <span className="text-gold">PILLARS.</span></h2>
                        <p className="text-foreground/50 max-w-xs font-bold text-sm uppercase tracking-widest">The foundation of every AFLEWO experience.</p>
                    </div>
                    <div className="pillars-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pillars.map((pillar, i) => (
                            <div key={i} className="pillar-card glass-card p-10 space-y-6 hover:-translate-y-2 transition-transform duration-500 rounded-[2rem]">
                                <div className="text-gold"><AppIcon name={pillar.icon} size={32} /></div>
                                <h3 className="text-2xl font-black">{pillar.title}</h3>
                                <p className="text-foreground/60 text-sm font-medium leading-relaxed">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual Timeline */}
            <section className="section-padding timeline-section" id="timeline">
                <div className="max-container">
                    <div className="mb-20 space-y-4">
                        <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">The Journey</span>
                        <h2 className="text-5xl font-black tracking-tighter">A HISTORY OF <span className="text-gold">ALTARS.</span></h2>
                    </div>
                    <div className="relative">
                        {/* Centre line — desktop only */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gold/20 -translate-x-1/2" />
                        <div className="space-y-16">
                            {timeline.map((item, i) => (
                                <div key={item.year} className={`timeline-item relative flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-12 items-center`}>
                                    {/* Year node */}
                                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gold text-brown font-black text-sm items-center justify-center z-10 shrink-0 shadow-glow">
                                        {item.year}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <span className="md:hidden text-gold font-black text-sm uppercase tracking-widest">{item.year}</span>
                                        <h3 className="text-3xl font-black tracking-tighter">{item.title}</h3>
                                        <p className="text-foreground/60 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                    <div className="flex-1 w-full aspect-video rounded-2xl overflow-hidden glass-card border-white/5 relative group">
                                        <Image src={item.image} alt={item.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership */}
            <section className="section-padding bg-brown/20">
                <div className="max-container">
                    <div className="mb-20 space-y-4">
                        <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">Pioneers</span>
                        <h2 className="text-5xl font-black tracking-tighter">FOUNDING <span className="text-gold">LEADERSHIP.</span></h2>
                    </div>
                    <div className="leadership-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                        {leadership.map((leader, i) => (
                            <div key={i} className="leader-card glass-card-elevated p-8 rounded-2xl border-white/5 group hover:border-gold/30 transition-all space-y-6">
                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gold/30 group-hover:border-gold transition-colors">
                                    <Image src={leader.image} alt={leader.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black text-white">{leader.name}</h4>
                                    <p className="text-gold text-[10px] font-black uppercase tracking-widest">{leader.role}</p>
                                    <p className="text-white/30 text-[10px] uppercase font-bold">{leader.tenure}</p>
                                </div>
                                <p className="text-white/50 text-sm font-medium leading-relaxed">{leader.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sing Africa Legacy */}
            <section className="section-padding overflow-hidden relative">
                <div className="max-container flex flex-col md:flex-row items-center gap-20">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-5xl font-black tracking-tighter">THE SING AFRICA <br /><span className="text-gold">LEGACY.</span></h2>
                        <p className="text-foreground/60 text-lg font-medium leading-relaxed">
                            Birthed in October 2003, the alumni of Sing Africa — Daystar University&apos;s flagship choir — sought to create
                            a united front for the church. Under the leadership of Timothy Kaberia and Ruguru,
                            the phrase &quot;Africa Let&apos;s Worship&quot; became their anthem. Twenty-two years later, that phrase has mobilised
                            over 7,000 alumni and touched four nations.
                        </p>
                        <div className="flex items-center gap-4 py-4 border-y border-white/5">
                            <div className="w-12 h-12 rounded-full overflow-hidden grayscale relative">
                                <Image src="/mission-1.jpg" alt="Sing Africa" fill className="object-cover" />
                            </div>
                            <p className="text-gold text-[10px] font-black uppercase tracking-widest">Daystar University Christian Fellowship Ministries</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full aspect-square rounded-full border border-gold/20 flex items-center justify-center p-12 relative animate-breathe">
                        <div className="w-full h-full rounded-full overflow-hidden relative grayscale opacity-40">
                            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                                <source src="/hero-bg.mp4" type="video/mp4" />
                            </video>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-7xl font-black text-gold/30 select-none">22+</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gold/40">Years of Worship</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alumni CTA */}
            <section className="section-padding bg-background">
                <div className="max-container glass-card-elevated rounded-2xl p-16 text-center space-y-8 border-gold/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gold/5 blur-[100px] -z-10" />
                    <h2 className="text-5xl font-black tracking-tighter">ARE YOU AN <span className="text-gold">ALUMNUS?</span></h2>
                    <p className="max-w-xl mx-auto text-white/50 font-medium">
                        If you served in the AFLEWO choir, band, or production teams in previous years, we want to reconnect
                        with you as we celebrate our 22nd season. Your story is part of this legacy.
                    </p>
                    <button
                        onClick={() => setShowAlumniModal(true)}
                        className="press-scale px-12 py-5 bg-gold text-brown rounded-lg font-black uppercase tracking-widest hover:brightness-110 transition-all inline-flex items-center gap-4"
                    >
                        Update Your Profile <AppIcon name="arrow_forward" size={20} />
                    </button>
                </div>
            </section>

            <Footer />
        </main>
    );
}
