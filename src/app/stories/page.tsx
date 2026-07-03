"use client";

import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import AppIcon from "@/components/ui/AppIcon";

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
        year: "2020–Present",
        chapter: "Mombasa",
        image: "/archival-1.jpg",
        quote: "The coastline prays while the city sleeps.",
    },
];

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
        const subject = encodeURIComponent(`AFLEWO Story Submission — ${form.name}`);
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nChapter: ${form.chapter}\nYear: ${form.year}\n\nStory:\n${form.story}`);
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
                        <h3 className="text-2xl font-black tracking-tighter">SHARE YOUR <span className="text-gold">STORY</span></h3>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">We read every submission</p>
                    </div>
                    <button onClick={onClose} className="p-2 glass-card rounded-lg text-white/50 hover:text-white">
                        <AppIcon name="close" size={20} />
                    </button>
                </div>

                {submitted ? (
                    <div className="text-center py-12 space-y-4">
                        <AppIcon name="favorite" size={56} className="text-gold mx-auto" />
                        <h4 className="text-xl font-black">Story Received</h4>
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
                            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Your Story *</label>
                            <textarea required rows={5} value={form.story} onChange={(e) => setForm((p) => ({ ...p, story: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold/50 resize-none"
                                placeholder="Tell us how God moved in your life through AFLEWO..." />
                        </div>
                        <button type="submit" disabled={submitting}
                            className="w-full py-4 bg-gold text-brown rounded-lg font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            {submitting ? <><AppIcon name="autorenew" size={18} className="animate-spin" /> Sending...</> : <><AppIcon name="send" size={18} /> Submit My Story</>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function StoriesPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
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
        <main ref={containerRef} className="bg-background min-h-screen">
            {showModal && <StorySubmitModal onClose={() => setShowModal(false)} />}

            {/* Hero */}
            <section className="pt-40 pb-24 px-6 relative overflow-hidden">
                <div className="max-container">
                    <div className="max-w-4xl space-y-8">
                        <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">Testimonies</span>
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                            ECHOES OF <br /><span className="text-gold">GRACE.</span>
                        </h1>
                        <p className="text-2xl text-foreground/60 font-medium leading-relaxed italic">
                            &quot;AFLEWO is not just an event; it&apos;s a tapestry of thousands of voices, each with a story of how worship changed their world.&quot;
                        </p>
                    </div>
                </div>
            </section>

            {/* Immersive Narrative Scroll */}
            <section className="pb-32">
                {narrativeStories.map((story, i) => (
                    <div key={story.id} className="min-h-[80vh] flex items-center border-b border-white/5 py-24 px-6 md:px-0">
                        <div className={`max-container flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-20 items-center`}>
                            <div className="flex-1 space-y-8">
                                <AppIcon name="format_quote" className="text-gold opacity-20" size={64} />
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
                            <div className="flex-1 w-full aspect-square rounded-[3rem] overflow-hidden glass-card-elevated group border-white/10 relative">
                                <Image
                                    src={story.image}
                                    alt={story.title}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Submission CTA */}
            <section className="section-padding bg-brown/30 text-white text-center border-t border-gold/10">
                <div className="max-container space-y-12">
                    <AppIcon name="auto_awesome" className="mx-auto text-gold" size={48} />
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight">WHAT&apos;S YOUR <span className="text-gold">AFLEWO STORY?</span></h2>
                    <p className="max-w-2xl mx-auto text-white/60 text-lg font-medium leading-relaxed">
                        Whether you were in the choir in 2004 or attended for the first time in 2025, we want to hear how God has moved in your life through worship.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="press-scale bg-gold text-brown px-12 py-5 rounded-full font-black uppercase tracking-tighter hover:bg-white transition-all shadow-glow inline-flex items-center gap-3"
                    >
                        <AppIcon name="edit_note" size={22} /> Share Your Story
                    </button>

                    <div className="flex justify-center gap-12 pt-12 border-t border-white/5 opacity-40">
                        <div className="flex flex-col items-center gap-2">
                            <AppIcon name="favorite" size={24} />
                            <span className="text-[10px] font-black uppercase">7,000+ Alumni</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <AppIcon name="forum" size={24} />
                            <span className="text-[10px] font-black uppercase">Thousands of Stories</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
