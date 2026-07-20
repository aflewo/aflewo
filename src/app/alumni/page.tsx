"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import SvgIcon from "@/components/ui/SvgIcon";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { supabase } from "@/integrations/supabase/client";

export default function AlumniPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showForm, setShowForm] = useState(false);

    const [founders, setFounders] = useState<{ name: string; role: string; org: string; image: string }[]>([]);

    useEffect(() => {
        const fetchFounders = async () => {
            const { data, error } = await supabase.from('alumni').select('*').order('created_at', { ascending: true });
            if (data && !error) {
                setFounders(data.map(d => ({
                    name: d.name,
                    role: d.role,
                    org: d.organization || '',
                    image: d.image || '/mission-1.jpg'
                })));
            } else {
                // Fallback to static if no connection
                setFounders([
                    { name: "Sing Africa", role: "Founding Alumni", org: "Daystar University", image: "/mission-1.jpg" },
                    { name: "Hubert de Rogue Maura", role: "Chairman", org: "National Oversight", image: "/archival-1.jpg" },
                    { name: "CITAM Karen", role: "Host Partner", org: "2004 Inauguration", image: "/archival-2.jpg" },
                ]);
            }
        };
        fetchFounders();
    }, []);

    const [form, setForm] = useState({ name: "", email: "", chapter: "", years: "", role: "" });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".animate-fade", { opacity: 0, y: 30, stagger: 0.2, duration: 1, ease: "power3.out" });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        
        try {
            const res = await fetch("/api/alumni", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (!res.ok) throw new Error("Failed to submit");
            
            setSubmitted(true);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main ref={containerRef} className="bg-background min-h-screen">

            {/* Hero */}
            <section className="pt-40 pb-24 px-6 relative overflow-hidden text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gold/5 blur-[120px] -z-10" />
                <div className="max-container space-y-8">
                    <div className="animate-fade inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.3em]">
                        <SvgIcon name="star" size={14} /> The Legacy Circle
                    </div>
                    <h1 className="animate-fade text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                        ALUMNI <br /><span className="text-gold">SOCIETY</span>
                    </h1>
                    <p className="animate-fade text-xl md:text-2xl text-foreground/60 font-medium max-w-3xl mx-auto leading-relaxed">
                        Honoring the &quot;Sing Africa&quot; alumni from Daystar University who birthed the sound of heaven in 2004,
                        and the thousands who have carried this sound across Africa ever since.
                    </p>
                </div>
            </section>

            {/* Origins */}
            <section className="section-padding bg-brown/20 relative">
                <div className="max-container grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8 animate-fade">
                        <h2 className="text-5xl font-black tracking-tighter">Birthed from <span className="text-gold">Sing Africa</span></h2>
                        <div className="space-y-6 text-lg text-white/50 font-medium leading-relaxed">
                            <p>
                                In 2004, a group of Daystar University alumni — members of the renowned Sing Africa choir — felt a divine burden
                                to unite the body of Christ in Kenya through corporate worship. They did not know they were launching a movement.
                            </p>
                            <p>
                                What began as a small gathering at CITAM Karen has transformed into a continental movement, touching lives
                                across Kenya, Tanzania, Rwanda, and Uganda. Today, 22 seasons later, thousands of alumni carry
                                the AFLEWO flame in their churches, homes, and communities.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="glass-card p-6 rounded-lg space-y-2 flex-1 min-w-[200px]">
                                <SvgIcon name="explore" className="text-gold" size={24} />
                                <h4 className="font-black text-white text-sm">Visionaries</h4>
                                <p className="text-white/40 text-xs">Sing Africa Alumni — Daystar University</p>
                            </div>
                            <div className="glass-card p-6 rounded-lg space-y-2 flex-1 min-w-[200px]">
                                <SvgIcon name="favorite" className="text-gold" size={24} />
                                <h4 className="font-black text-white text-sm">Founding Venue</h4>
                                <p className="text-white/40 text-xs">CITAM Karen, Nairobi — October 2004</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden glass-card-elevated border-gold/20 animate-fade">
                        <Image src="/mission-1.jpg" alt="The Founding" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    </div>
                </div>
            </section>

            {/* Hall of Fame */}
            <section className="section-padding">
                <div className="max-container">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-5xl font-black tracking-tighter">Legacy <span className="text-gold">Leaders</span></h2>
                        <p className="text-white/40 uppercase tracking-widest text-[10px] font-black">Recognizing the pioneers of the movement</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {founders.map((founder, i) => (
                            <div key={i} className="animate-fade glass-card-elevated p-8 rounded-lg border-white/5 text-center group hover:border-gold/30 transition-all space-y-4">
                                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-gold/30 group-hover:border-gold transition-colors">
                                    <Image src={founder.image} alt={founder.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                </div>
                                <h4 className="text-xl font-black text-white">{founder.name}</h4>
                                <p className="text-gold text-[10px] font-black uppercase tracking-widest">{founder.role}</p>
                                <p className="text-white/30 text-[10px] uppercase font-bold">{founder.org}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alumni Registration */}
            <section className="section-padding bg-brown/10">
                <div className="max-container">
                    <div className="glass-card-elevated rounded-2xl p-10 md:p-16 border-gold/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gold/5 blur-[100px] -z-10" />
                        <div className="max-w-2xl mx-auto space-y-10">
                            <div className="text-center space-y-3">
                                <h2 className="text-4xl font-black tracking-tighter">ARE YOU AN <span className="text-gold">ALUMNUS?</span></h2>
                                <p className="text-white/50 font-medium">
                                    If you served in the AFLEWO choir, band, or production teams in previous years, reconnect with the network below.
                                </p>
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="inline-flex items-center gap-2 mt-2 text-gold text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
                                >
                                    {showForm ? "Hide Form" : "Open Registration Form"} <SvgIcon name="arrow_forward" size={14} />
                                </button>
                            </div>

                            {showForm && (
                                submitted ? (
                                    <div className="text-center py-12 space-y-4">
                                        <SvgIcon name="verified" size={56} className="text-gold mx-auto" />
                                        <h4 className="text-xl font-black">Welcome back, {form.name}!</h4>
                                        <p className="text-white/50 text-sm">We&apos;ll reach you at {form.email} within 48 hours.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gold">Full Name *</label>
                                                <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-5 text-sm text-white outline-none focus:border-gold/50 transition-colors"
                                                    placeholder="Your full name" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gold">Email *</label>
                                                <input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-5 text-sm text-white outline-none focus:border-gold/50 transition-colors"
                                                    placeholder="you@email.com" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gold">Chapter</label>
                                                <select value={form.chapter} onChange={(e) => setForm((p) => ({ ...p, chapter: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-5 text-sm text-white outline-none focus:border-gold/50 appearance-none">
                                                    <option value="">Select your chapter</option>
                                                    {["Nairobi", "Mombasa", "Nakuru", "Eldoret", "Tanzania", "Rwanda", "Kampala", "Other"].map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gold">Years of Service</label>
                                                <input value={form.years} onChange={(e) => setForm((p) => ({ ...p, years: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-5 text-sm text-white outline-none focus:border-gold/50 transition-colors"
                                                    placeholder="e.g. 2012–2019" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Role(s) Served</label>
                                            <input value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-5 text-sm text-white outline-none focus:border-gold/50 transition-colors"
                                                placeholder="e.g. Soprano, Sound Engineer, Usher, Logistics" />
                                        </div>
                                        {error && (
                                            <p className="text-red-400 text-xs font-bold text-center">{error}</p>
                                        )}
                                        <button type="submit" disabled={submitting}
                                            className="w-full py-5 bg-gold text-brown rounded-lg font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-glow disabled:opacity-50 flex items-center justify-center gap-3">
                                            {submitting ? <><SvgIcon name="loader" size={20} className="animate-spin" /> Submitting...</> : <><SvgIcon name="check_circle" size={20} /> Register as Alumni</>}
                                        </button>
                                    </form>
                                )
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Link href="/join" className="press-scale inline-flex items-center gap-2 px-8 py-4 glass-card rounded-lg font-black text-[10px] uppercase tracking-widest text-gold hover:border-gold/30 transition-all">
                                    <SvgIcon name="group_add" size={16} /> Join 2026 Team
                                </Link>
                                <Link href="/testify" className="press-scale inline-flex items-center gap-2 px-8 py-4 glass-card rounded-lg font-black text-[10px] uppercase tracking-widest hover:text-gold hover:border-gold/30 transition-all">
                                    <SvgIcon name="format_quote" size={16} /> Testify
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
