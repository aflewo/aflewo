"use client";

import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import SvgIcon from "@/components/ui/SvgIcon";

gsap.registerPlugin(ScrollTrigger);

const narrativeStories = [
    {
        id: "altar-of-2004",
        title: "The Altar of 2004",
        subtitle: "The night Africa answered",
        desc: "It began with a few graduates from Daystar University, members of the Sing Africa choir, carrying a single prayer: that the church of Africa would worship as one. There was no stadium, no budget, no guarantee — only a promise. On a cold October evening at CITAM Karen, something shifted in the atmosphere over Nairobi. That night became the foundation of a movement that would touch ten nations.",
        author: "Sing Africa Alumni",
        year: "2004",
        chapter: "Nairobi",
        image: "/archival-1.jpg",
        quote: "We didn't have a stage — we had an altar.",
    },
    {
        id: "thousands-in-the-rain",
        title: "Thousands in the Rain",
        subtitle: "October 3rd, 2025 — Grace for Wholeness",
        desc: "October 3rd, 2025. Winners' Chapel International was at capacity — 15,000 worshippers filling every seat, aisle, and overflow space — despite a heavy downpour that began two hours before the gates opened. No one left. If anything, people pressed in harder. It wasn't about the weather or the discomfort. It was about the undeniable sense that Heaven was hosting this gathering, and no storm could interrupt the appointment.",
        author: "Nairobi Chapter, 2025",
        year: "2025",
        chapter: "Nairobi",
        image: "/mission-1.jpg",
        quote: "The rain was His invitation to press in deeper.",
    },
    {
        id: "healing-in-kigali",
        title: "Healing in Kigali",
        subtitle: "The year Rwanda sang again",
        desc: "In 2014, as Rwanda commemorated 20 years since the genocide, AFLEWO Kigali raised a sound of reconciliation. Men and women who had been on opposite sides of the worst chapter in their nation's history stood side by side under the same roof, singing to the same God. Music didn't fix everything — but it opened the door. It created space for tears, for dialogue, for the slow, sacred work of healing that politics alone could never accomplish.",
        author: "Kigali Chapter Team",
        year: "2014",
        chapter: "Rwanda",
        image: "/archival-2.jpg",
        quote: "When words failed Rwanda, worship spoke.",
    },
    {
        id: "mombasa-prayer-circle",
        title: "The Circle That Never Closes",
        subtitle: "Every night since 2020",
        desc: "During the COVID-19 lockdowns of 2020, AFLEWO Mombasa faced the same crisis every chapter did: how do you hold a worship event when no one can gather? The answer was the Prayer Circle — a nightly Zoom call that started with 12 people and now draws intercessors from Mombasa, Malindi, Lamu, and even diaspora communities in the UK and Canada. Five years later, the circle still meets every night at 9 PM EAT. It has not missed a single night.",
        author: "Mombasa Chapter Leadership",
        year: "2020 – Present",
        chapter: "Mombasa",
        image: "/archival-1.jpg",
        quote: "The coastline prays while the city sleeps.",
    },
];

const chapters = ["All", "Nairobi", "Mombasa", "Rwanda", "Tanzania", "Kampala"];

interface SubmitFormState {
    name: string;
    email: string;
    chapter: string;
    story: string;
    year: string;
}

function StorySubmitModal({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState<SubmitFormState>({ name: "", email: "", chapter: "", story: "", year: new Date().getFullYear().toString() });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 1200));
        const subject = encodeURIComponent(`AFLEWO Testimony Submission — ${form.name}`);
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nChapter: ${form.chapter}\nYear: ${form.year}\n\nTestimony:\n${form.story}`);
        window.location.href = `mailto:stories@aflewo.org?subject=${subject}&body=${body}`;
        setSubmitting(false);
        setSubmitted(true);
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
            <div className="relative z-10 w-full max-w-xl glass-card-elevated rounded-2xl p-10 border-gold/20 space-y-8">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black tracking-tighter">SHARE YOUR <span className="text-gold">TESTIMONY</span></h3>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">We read every submission</p>
                    </div>
                    <button onClick={onClose} className="p-2 glass-card rounded-lg text-white/50 hover:text-white">
                        <SvgIcon name="close" size={20} />
                    </button>
                </div>

                {submitted ? (
                    <div className="text-center py-12 space-y-4">
                        <SvgIcon name="favorite" size={56} className="text-gold mx-auto" />
                        <h4 className="text-xl font-black">Testimony Received</h4>
                        <p className="text-white/50 text-sm">Thank you, {form.name}. We&apos;ll be in touch at {form.email}.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gold">Your Name *</label>
                                <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50"
                                    placeholder="Full name" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gold">Email *</label>
                                <input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50"
                                    placeholder="you@email.com" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gold">Chapter</label>
                                <select value={form.chapter} onChange={(e) => setForm((p) => ({ ...p, chapter: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50 appearance-none">
                                    <option value="">Select chapter</option>
                                    {["Nairobi", "Mombasa", "Nakuru", "Eldoret", "Nyeri", "Meru", "Machakos", "Kisumu", "Tanzania", "Rwanda", "Kampala"].map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gold">Year</label>
                                <input value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50"
                                    placeholder="2024" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Your Testimony *</label>
                            <textarea required rows={5} value={form.story} onChange={(e) => setForm((p) => ({ ...p, story: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50 resize-none"
                                placeholder="Tell us how God moved in your life through AFLEWO..." />
                        </div>
                        <button type="submit" disabled={submitting}
                            className="w-full py-4 bg-gold text-brown rounded-lg font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            {submitting ? <><SvgIcon name="loader" size={18} className="animate-spin" /> Sending...</> : <><SvgIcon name="send" size={18} /> Submit My Testimony</>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function TestimoniesPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [activeChapter, setActiveChapter] = useState("All");

    const filtered = activeChapter === "All"
        ? narrativeStories
        : narrativeStories.filter((s) => s.chapter === activeChapter);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-text-line", {
                y: 80,
                opacity: 0,
                duration: 1.4,
                stagger: 0.15,
                ease: "expo.out",
            });
            gsap.from(".stat-pill", {
                scrollTrigger: { trigger: ".stats-bar", start: "top 85%" },
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power2.out",
            });
            gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((text) => {
                gsap.from(text, {
                    scrollTrigger: { trigger: text, start: "top 85%" },
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="bg-background min-h-screen" id="testimonies-page">
            {showModal && <StorySubmitModal onClose={() => setShowModal(false)} />}

            {/* Hero */}
            <section className="pt-40 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
                <div className="max-container">
                    <div className="max-w-5xl space-y-6">
                        <span className="hero-text-line text-gold font-black uppercase tracking-[0.4em] text-xs">Testimonies</span>
                        <h1 className="hero-text-line text-7xl md:text-[clamp(4rem,12vw,9rem)] font-black tracking-tighter leading-[0.85]">
                            ECHOES OF <br /><span className="text-gold">GRACE.</span>
                        </h1>
                        <p className="hero-text-line text-xl md:text-2xl text-foreground/60 font-medium leading-relaxed max-w-2xl">
                            &quot;AFLEWO is not just an event; it&apos;s a tapestry of thousands of voices, each carrying a story of how worship changed their world.&quot;
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="stats-bar px-6 pb-16">
                <div className="max-container">
                    <div className="flex flex-wrap gap-4">
                        {[
                            { value: "7,000+", label: "Alumni" },
                            { value: "22", label: "Years" },
                            { value: "4", label: "Nations" },
                            { value: "11", label: "Chapters" },
                        ].map((s) => (
                            <div key={s.label} className="stat-pill glass-card px-8 py-5 rounded-full flex items-center gap-4 border-white/5">
                                <span className="text-2xl font-black text-gold">{s.value}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Chapter Filter */}
            <section className="px-6 pb-16 border-b border-white/5">
                <div className="max-container">
                    <div className="flex flex-wrap gap-2">
                        {chapters.map((ch) => (
                            <button
                                key={ch}
                                onClick={() => setActiveChapter(ch)}
                                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                    activeChapter === ch
                                        ? "bg-gold text-brown shadow-glow"
                                        : "glass-card text-white/40 hover:text-white border-white/5"
                                }`}
                            >
                                {ch}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Immersive Narrative Scroll */}
            <section className="pb-32">
                {filtered.length === 0 ? (
                    <div className="max-container px-6 py-32 text-center space-y-4">
                        <SvgIcon name="forum" size={48} className="text-white/10 mx-auto" />
                        <p className="text-white/30 font-black uppercase tracking-widest text-sm">No testimonies yet for this chapter</p>
                    </div>
                ) : (
                    filtered.map((story, i) => (
                        <div key={story.id} className="min-h-[80vh] flex items-center border-b border-white/5 py-24 px-6 md:px-0">
                            <div className={`max-container flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-16 lg:gap-24 items-center`}>
                                {/* Text */}
                                <div className="flex-1 space-y-8">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="opacity-20">
                                        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" fill="hsl(42 92% 56%)" />
                                    </svg>
                                    <div className="space-y-2">
                                        <p className="text-gold text-[10px] font-black uppercase tracking-widest">{story.chapter} · {story.year}</p>
                                        <p className="text-white/30 text-sm font-bold italic">{story.subtitle}</p>
                                    </div>
                                    <h2 className="reveal-text text-5xl md:text-7xl font-black tracking-tighter leading-tight">{story.title}</h2>
                                    <p className="reveal-text text-xl text-foreground/60 font-medium leading-loose">
                                        {story.desc}
                                    </p>
                                    <blockquote className="reveal-text border-l-2 border-gold pl-6 italic text-gold/80 text-lg font-bold">
                                        &quot;{story.quote}&quot;
                                    </blockquote>
                                    <div className="reveal-text flex items-center gap-4 pt-4">
                                        <div className="w-12 h-px bg-gold" />
                                        <span className="text-gold text-[10px] font-black uppercase tracking-widest">{story.author}</span>
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="flex-1 w-full aspect-square rounded-[3rem] overflow-hidden glass-card-elevated group border-white/10 relative">
                                    <Image
                                        src={story.image}
                                        alt={story.title}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                                    {/* Chapter badge */}
                                    <div className="absolute top-6 left-6 px-4 py-2 glass-card rounded-full border-white/10">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gold">{story.chapter}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* Submission CTA */}
            <section className="section-padding bg-brown/30 text-white text-center border-t border-gold/10">
                <div className="max-container space-y-12">
                    <SvgIcon name="auto_awesome" className="mx-auto text-gold" size={48} />
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight">WHAT&apos;S YOUR <span className="text-gold">TESTIMONY?</span></h2>
                    <p className="max-w-2xl mx-auto text-white/60 text-lg font-medium leading-relaxed">
                        Whether you were in the choir in 2004 or attended for the first time in 2025, we want to hear how God has moved in your life through worship.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="press-scale bg-gold text-brown px-12 py-5 rounded-full font-black uppercase tracking-tighter hover:bg-white transition-all shadow-glow inline-flex items-center gap-3"
                    >
                        <SvgIcon name="edit_note" size={22} /> Share Your Testimony
                    </button>
                </div>
            </section>

            {/* Cross-page navigation */}
            <section className="section-padding border-t border-white/5">
                <div className="max-container grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        href="/about"
                        className="group glass-card-elevated rounded-2xl p-10 border-white/5 hover:border-gold/20 transition-all space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                                <SvgIcon name="alumni" size={18} className="text-gold" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gold">The Story</span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter group-hover:text-gold transition-colors">Our History</h3>
                        <p className="text-white/40 text-sm font-medium leading-relaxed">
                            From Daystar University in 2004 to 11 chapters across 4 nations. Read the full journey.
                        </p>
                        <div className="flex items-center gap-2 text-gold/60 group-hover:text-gold transition-colors text-xs font-black uppercase tracking-widest">
                            <span>Our Story</span>
                            <SvgIcon name="arrow_right" size={16} />
                        </div>
                    </Link>

                    <Link
                        href="/join"
                        className="group glass-card-elevated rounded-2xl p-10 border-white/5 hover:border-gold/20 transition-all space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                                <SvgIcon name="person_add" size={18} className="text-gold" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gold">Serve</span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter group-hover:text-gold transition-colors">Join the Movement</h3>
                        <p className="text-white/40 text-sm font-medium leading-relaxed">
                            These testimonies are written by people who chose to serve. Find your place in the sound.
                        </p>
                        <div className="flex items-center gap-2 text-gold/60 group-hover:text-gold transition-colors text-xs font-black uppercase tracking-widest">
                            <span>Serve With Us</span>
                            <SvgIcon name="arrow_right" size={16} />
                        </div>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
