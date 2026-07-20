"use client";

import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SvgIcon from "@/components/ui/SvgIcon";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";

gsap.registerPlugin(ScrollTrigger);



const tracks = [
    {
        id: "choir",
        title: "Choir",
        shortTitle: "Choir",
        desc: "Join the mass choir. Open to vocalists — soprano, alto, tenor, and bass. Registration leads to auditions.",
        mobileExplainer: "Mass choir vocals — all voice parts welcome. Commitment to attend all rehearsals required. Registration opens the auditions pathway.",
        iconName: "track_mic",
        color: "from-gold/20 to-gold/5",
        requirements: ["Ability to read sheet music or learn by ear", "Commitment to attend all rehearsals", "Fill registration form below"],
    },
    {
        id: "band",
        title: "Band",
        shortTitle: "Band",
        desc: "Join the instrumental team. Open to pianists, drummers, string players, guitarists, and brass.",
        mobileExplainer: "Live instruments backing the entire movement. Pianists, drummers, guitarists, and string/brass players. Technical audition required.",
        iconName: "track_mic",
        color: "from-gold/20 to-gold/5",
        requirements: ["Proficiency on your instrument", "Ability to follow chord charts", "Attend all pre-event rehearsals"],
    },
    {
        id: "media",
        title: "Media",
        shortTitle: "Media",
        desc: "Run cameras, sound boards, and live stream desks. Capture the moment for thousands watching online across Africa.",
        mobileExplainer: "Video, audio, and livestream production for the main event and online audiences. Own or access equipment required.",
        iconName: "track_video",
        color: "from-secondary/40 to-secondary/10",
        requirements: ["Experience in video/sound production", "Own or access equipment", "Attend 2 pre-event tech rehearsals"],
    },
    {
        id: "ushering",
        title: "Ushering",
        shortTitle: "Usher",
        desc: "Ensuring every worshipper feels at home. Welcome teams, crowd flow, and on-site logistics.",
        mobileExplainer: "Front-line hospitality and crowd flow management. Friendly, servant-hearted, and physically able to stand for extended periods.",
        iconName: "track_home",
        color: "from-emerald/20 to-emerald/5",
        requirements: ["Friendly and servant-hearted", "Physically able to stand for long hours", "Bilingual (Swahili + English) preferred"],
    },
    {
        id: "security",
        title: "Security",
        shortTitle: "Security",
        desc: "Keep the congregation safe and the venue orderly. Coordinate with venue security personnel.",
        mobileExplainer: "Perimeter and internal crowd safety. Works alongside venue security. Physical fitness and calm under pressure required.",
        iconName: "track_home",
        color: "from-accent/10 to-accent/5",
        requirements: ["Physical fitness and calm demeanor", "Prior security or military background preferred", "Coordinate with venue security on-site"],
    },
    {
        id: "dancing",
        title: "Dancing",
        shortTitle: "Dance",
        desc: "Lead congregational movement in worship. Dance ministry expressing the full spectrum of praise.",
        mobileExplainer: "Praise and worship dance ministry. All styles welcome — African, contemporary, and liturgical. Audition required.",
        iconName: "track_mic",
        color: "from-accent/20 to-accent/5",
        requirements: ["Dance experience (any style)", "Heart for expressive worship", "Attend choreography rehearsals"],
    },
    {
        id: "partners",
        title: "Partners & Sponsors",
        shortTitle: "Partner",
        desc: "For corporate and individual supporters powering the vision. M-Pesa, bank transfer, and in-kind partnerships available.",
        mobileExplainer: "Corporate and individual financial partnership. Brand placement on all event material. Dedicated receipt provided.",
        iconName: "track_donate",
        color: "from-accent/20 to-accent/5",
        requirements: ["Minimum KES 10,000 corporate tier", "Brand placement on all event material", "Dedicated partnership receipt provided"],
    },
];

interface FormState {
    name: string;
    email: string;
    phone: string;
    chapter: string;
    track: string;
    message: string;
}

export default function JoinPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeTrack, setActiveTrack] = useState<string | null>(null);
    const [formState, setFormState] = useState<FormState>({ name: "", email: "", phone: "", chapter: "", track: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Read URL params
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        const email = params.get("email");

        if (email) {
            setFormState((prev) => ({ ...prev, email }));
            setTimeout(() => {
                const el = document.getElementById("apply-form");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 600);
        }

        if (tab) {
            const match = tracks.find((t) => t.id === tab);
            if (match) {
                setActiveTrack(match.id);
                setFormState((prev) => ({ ...prev, track: match.title }));
                // Scroll to the card after a short delay to allow render
                setTimeout(() => {
                    const el = document.getElementById(`track-${match.id}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 600);
            }
        }
    }, []);

    useEffect(() => {
        let ctx: gsap.Context;

        // Delay GSAP slightly to allow Next.js page transition to complete and DOM to settle
        const timer = setTimeout(() => {
            ctx = gsap.context(() => {
                gsap.from(".track-card", {
                    scrollTrigger: { trigger: ".tracks-grid", start: "top 95%", once: true },
                    y: 60,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.from(".join-hero-text", {
                    y: 80,
                    opacity: 0,
                    duration: 1.4,
                    ease: "expo.out",
                });
                ScrollTrigger.refresh();
            }, containerRef);
        }, 100);

        return () => {
            clearTimeout(timer);
            if (ctx) ctx.revert();
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Attach auth token if user is signed in
            const { data: { session } } = await supabase.auth.getSession();
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            if (session?.access_token) {
                headers["Authorization"] = `Bearer ${session.access_token}`;
            }

            const chapterSlug = formState.chapter.toLowerCase();
            const res = await fetch("/api/join", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    name: formState.name,
                    email: formState.email,
                    phone: formState.phone,
                    chapter: chapterSlug,
                    track: formState.track,
                    message: formState.message,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Submission failed. Please try again.");
                return;
            }

            setSubmitted(true);
        } catch (err) {
            console.error("[join] Submit error:", err);
            setError("Network error. Please check your connection and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <main ref={containerRef} className="bg-background min-h-screen">

            {/* Hero */}
            <section className="pt-40 pb-8 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] rounded-full bg-gold/5 blur-[150px] -z-10" />
                <div className="max-container flex flex-col items-center text-center space-y-8">
                    <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">Serve the Vision</span>
                    <h1 className="join-hero-text text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                        JOIN THE <br /><span className="text-gold">MOVEMENT</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-foreground/60 font-medium max-w-2xl mx-auto leading-relaxed">
                        AFLEWO is built by volunteers, partners, and the faithful commitment of thousands.
                        Find your place in the sound of heaven.
                    </p>
                </div>
            </section>

            {/* Track Cards */}
            <section className="section-padding">
                <div className="max-container space-y-8">
            {/* ── Mobile (< md): 3×2/4×2 button grid above form ── */}
                    <div className="md:hidden space-y-4 mb-8">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 text-center">Choose your track to get started</p>
                        <div className="grid grid-cols-3 gap-2.5">
                            {tracks.map((track) => (
                                <button
                                    key={track.id}
                                    id={`track-${track.id}`}
                                    onClick={() => {
                                        const next = activeTrack === track.id ? null : track.id;
                                        setActiveTrack(next);
                                        setFormState((prev) => ({ ...prev, track: next ? track.title : "" }));
                                        if (next) {
                                            setTimeout(() => {
                                                const el = document.getElementById("apply-form");
                                                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                                            }, 200);
                                        }
                                    }}
                                    className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border transition-all duration-300 text-center ${
                                        activeTrack === track.id
                                            ? "bg-gold/10 border-gold/50 text-gold"
                                            : "glass-card border-white/5 hover:border-gold/20 text-white/50 hover:text-white"
                                    }`}
                                >
                                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center transition-transform duration-300 ${
                                        activeTrack === track.id ? "scale-110" : ""
                                    }`}>
                                        <SvgIcon name={track.iconName} size={18} className={activeTrack === track.id ? "text-gold" : "text-gold/60"} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-tight">{track.shortTitle}</span>
                                </button>
                            ))}
                        </div>

                        {/* Mobile explainer — appears below button grid on track selection */}
                        {activeTrack && (() => {
                            const selected = tracks.find((t) => t.id === activeTrack);
                            if (!selected) return null;
                            return (
                                <div className="glass-card rounded-2xl p-5 border border-gold/20 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${selected.color} flex items-center justify-center`}>
                                            <SvgIcon name={selected.iconName} size={14} className="text-gold" />
                                        </div>
                                        <h4 className="text-sm font-black text-white">{selected.title}</h4>
                                        <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded-full">Selected ✓</span>
                                    </div>
                                    <p className="text-white/50 text-xs font-medium leading-relaxed">{selected.mobileExplainer}</p>
                                    <ul className="space-y-1.5">
                                        {selected.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-2 text-[10px] text-white/40 font-bold">
                                                <SvgIcon name="check_circle" size={12} className="text-gold mt-0.5 shrink-0" />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })()}
                    </div>

                    {/* ── Tablet (md) + Desktop (lg): card grid ── */}
                    <div className="hidden md:grid tracks-grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {tracks.map((track) => (
                            <div
                                key={track.id}
                                id={`track-${track.id}`}
                                className={`track-card glass-card-elevated p-6 lg:p-10 space-y-4 group cursor-pointer rounded-lg transition-colors duration-500 border ${
                                    activeTrack === track.id ? "border-gold/50 bg-gold/5" : "border-white/5 hover:border-gold/20"
                                }`}
                                onClick={() => {
                                    setActiveTrack(activeTrack === track.id ? null : track.id);
                                    setFormState((prev) => ({ ...prev, track: track.title }));
                                }}
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-500`}>
                                    <SvgIcon name={track.iconName} size={28} className={track.id === "partners" || track.id === "dancing" || track.id === "security" ? "text-accent" : "text-gold"} />
                                </div>
                                {/* Tablet: shorter copy — full desc only when expanded */}
                                <h3 className="text-xl lg:text-2xl font-black tracking-tighter group-hover:text-gold transition-colors">{track.title}</h3>
                                <p className="text-foreground/50 text-xs lg:text-sm font-bold leading-relaxed line-clamp-3 lg:line-clamp-none">{track.desc}</p>
                                {activeTrack === track.id && (
                                    <ul className="space-y-2 pt-2 border-t border-gold/20">
                                        {track.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-2 text-[11px] text-white/60 font-bold">
                                                <SvgIcon name="check_circle" size={14} className="text-gold mt-0.5 shrink-0" />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="pt-2 flex items-center justify-between w-full">
                                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                                        activeTrack === track.id ? "text-gold" : "text-gold/50 group-hover:text-gold"
                                    }`}>
                                        {activeTrack === track.id ? "Selected ✓" : "Select to Apply"}
                                    </span>
                                    {activeTrack !== track.id && (
                                        <div className="relative w-4 h-4 flex items-center justify-center -translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                                            <SvgIcon name="chevron_idle" size={16} className="text-gold/50 absolute rotate-180 opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                                            <SvgIcon name="chevron_hover" size={16} className="text-gold absolute rotate-180 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Application Form */}
                    <div className="glass-card-elevated rounded-lg p-10 md:p-16 border-gold/10 relative overflow-hidden" id="apply-form">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />
                        <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                            <div className="text-center space-y-3">
                                <h2 className="text-4xl font-black tracking-tighter">SUBMIT YOUR <span className="text-gold">APPLICATION</span></h2>
                                <p className="text-white/40 text-sm font-bold uppercase tracking-widest">
                                    {activeTrack ? `Applying for: ${tracks.find((t) => t.id === activeTrack)?.title}` : "Select a card above, then complete the form"}
                                </p>
                            </div>

                            {submitted ? (
                                <div className="text-center py-16 space-y-4">
                                    <SvgIcon name="check_circle" size={64} className="text-gold mx-auto" />
                                    <h3 className="text-2xl font-black">Application Sent!</h3>
                                    <p className="text-white/50 text-sm">We&apos;ll reach out to {formState.email} within 48 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Full Name *</label>
                                            <input name="name" required value={formState.name} onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-5 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors"
                                                placeholder="Your full name" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Email *</label>
                                            <input name="email" type="email" required value={formState.email} onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-5 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors"
                                                placeholder="you@email.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Phone</label>
                                            <input name="phone" value={formState.phone} onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-5 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors"
                                                placeholder="+254 700 000 000" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Chapter</label>
                                            <select name="chapter" value={formState.chapter} onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-5 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors appearance-none">
                                                <option value="">Select your chapter</option>
                                                {["Nairobi", "Mombasa", "Nakuru", "Eldoret", "Nyeri", "Meru", "Machakos", "Kisumu", "Tanzania", "Rwanda", "Kampala"].map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gold">Track *</label>
                                        <select name="track" required value={formState.track} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-5 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors appearance-none">
                                            <option value="">Select a track</option>
                                            {tracks.map((t) => <option key={t.id} value={t.title}>{t.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gold">Brief Introduction</label>
                                        <textarea name="message" rows={4} value={formState.message} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-5 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors resize-none"
                                            placeholder="Tell us a bit about yourself and why you want to serve in AFLEWO..." />
                                    </div>
                                    <button type="submit" disabled={submitting}
                                        className="w-full py-5 bg-gold text-brown rounded-lg font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-glow disabled:opacity-50 flex items-center justify-center gap-3">
                                        {submitting ? <><SvgIcon name="loader" size={20} className="animate-spin" /> Sending...</> : <><SvgIcon name="send" size={20} /> Submit Application</>}
                                    </button>
                                    {error && (
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
                                            <SvgIcon name="error_circle" size={18} />
                                            {error}
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Core Pillars */}
                    <div className="py-20 border-y border-white/5">
                        <div className="text-center space-y-12">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">OUR CORE <span className="text-gold">PILLARS</span></h2>
                            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                                {["Hope", "Unity", "Music", "Prayer", "Word", "Leadership", "Excellence", "Intercession"].map((pillar) => (
                                    <div key={pillar} className="px-6 py-3 glass-card rounded-full text-xs font-black uppercase tracking-widest text-white/60 hover:text-gold hover:border-gold/30 transition-all">
                                        {pillar}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Partner Section */}
                    <div className="flex flex-col md:flex-row items-center gap-20">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-5xl font-black tracking-tighter">PARTNER WITH <br /><span className="text-gold">AFLEWO</span></h2>
                            <div className="space-y-6">
                                <p className="text-foreground/60 text-lg font-medium leading-relaxed italic">
                                    &quot;Partnering with us means powering a prophetic house that stands for unity across the continent.&quot;
                                </p>
                                <div className="glass-card p-8 space-y-4 rounded-lg border-gold/10">
                                    <h4 className="font-black text-gold uppercase tracking-widest text-xs">M-Pesa Support</h4>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-2xl font-black tracking-tighter">
                                        <div className="space-y-1">
                                            <span>PAYBILL: <span className="text-gold">819867</span></span>
                                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Account: Your Name</p>
                                        </div>
                                        <span className="text-gold bg-gold/10 px-4 py-1 rounded-lg text-sm">AFLEWO</span>
                                    </div>
                                </div>
                                <Link href="tel:*456*819867#" className="inline-flex items-center gap-3 press-scale px-8 py-4 bg-gold text-brown rounded-lg font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
                                    <SvgIcon name="phone_in_talk" size={16} /> Dial *456*819867# on Safaricom
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cross-page navigation */}
            <section className="px-6 pb-16">
                <div className="max-container">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                        <Link
                            href="/about"
                            className="group glass-card rounded-xl p-6 border-white/5 hover:border-gold/20 transition-all space-y-3"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-gold">Read First</p>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-black group-hover:text-gold transition-colors">Our History</p>
                                <div className="relative w-4 h-4 flex items-center justify-center -translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                                    <SvgIcon name="chevron_idle" size={16} className="text-white/30 absolute rotate-180 opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                                    <SvgIcon name="chevron_hover" size={16} className="text-gold absolute rotate-180 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>
                            <p className="text-white/30 text-xs font-medium">22 seasons of worship and prayer across Africa.</p>
                        </Link>
                        <Link
                            href="/testify"
                            className="group glass-card rounded-xl p-6 border-white/5 hover:border-gold/20 transition-all space-y-3"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-gold">Inspired By</p>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-black group-hover:text-gold transition-colors">Echoes of Grace</p>
                                <div className="relative w-4 h-4 flex items-center justify-center -translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                                    <SvgIcon name="chevron_idle" size={16} className="text-white/30 absolute rotate-180 opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                                    <SvgIcon name="chevron_hover" size={16} className="text-gold absolute rotate-180 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>
                            <p className="text-white/30 text-xs font-medium">Read why thousands choose to serve year after year.</p>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

