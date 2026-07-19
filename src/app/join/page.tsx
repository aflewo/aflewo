"use client";

import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SvgIcon from "@/components/ui/SvgIcon";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";

gsap.registerPlugin(ScrollTrigger);

const MicIcon = ({ className }: { className?: string }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fillRule="nonzero" fill="currentColor"></path>
        <path d="M4.10002,6 L8,6 C8.55228,6 9,6.44772 9,7 C9,7.55228 8.55228,8 8,8 L4,8 L4,11 L8,11 C8.55228,11 9,11.4477 9,12 C9,12.5523 8.55228,13 8,13 L4,13 C4,15.7614 6.23858,18 9,18 L11,18 L11,20 L9,20 C8.44772,20 8,20.4477 8,21 C8,21.5523 8.44772,22 9,22 L15,22 C15.5523,22 16,21.5523 16,21 C16,20.4477 15.5523,20 15,20 L13,20 L13,18 L15,18 C17.7614,18 20,15.7614 20,13 L16,13 C15.4477,13 15,12.5523 15,12 C15,11.4477 15.4477,11 16,11 L20,11 L20,8 L16,8 C15.4477,8 15,7.55228 15,7 C15,6.44772 15.4477,6 16,6 L19.9,6 C19.4367,3.71776 17.419,2 15,2 L9,2 C6.58104,2 4.56329,3.71776 4.10002,6 Z" fill="currentColor"></path>
    </svg>
);

const VideoIcon = ({ className }: { className?: string }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const HomeSmileIcon = ({ className }: { className?: string }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const DonateIcon = ({ className }: { className?: string }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.91" d="M16.77,2.45A5.62,5.62,0,0,0,12,5.3,5.62,5.62,0,0,0,7.23,2.45C4.06,2.45,1.5,5.3,1.5,8.82,1.5,15.18,12,21.55,12,21.55S22.5,15.18,22.5,8.82C22.5,5.3,19.94,2.45,16.77,2.45Z"/>
        <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.91" d="M5.32,8.18H7.23A4.77,4.77,0,0,1,12,13v0a0,0,0,0,1,0,0H10.09A4.77,4.77,0,0,1,5.32,8.18v0A0,0,0,0,1,5.32,8.18Z"/>
        <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.91" d="M16.77,9.14h1.91a0,0,0,0,1,0,0v0a4.77,4.77,0,0,1-4.77,4.77H12a0,0,0,0,1,0,0v0A4.77,4.77,0,0,1,16.77,9.14Z" transform="translate(30.68 23.05) rotate(-180)"/>
        <line fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.91" x1="12" y1="21.55" x2="12" y2="12.95"/>
    </svg>
);

const tracks = [
    {
        id: "music",
        title: "Music & Choir",
        desc: "Join the mass choir or instrumental team. Open to vocalists, pianists, drummers, and string players. Registration leads to auditions.",
        Icon: MicIcon,
        color: "from-gold/20 to-gold/5",
        requirements: ["Ability to read sheet music or learn by ear", "Commitment to attend all rehearsals", "Fill registration form below"],
    },
    {
        id: "production",
        title: "Production & Media",
        desc: "Run cameras, sound boards, and live stream desks. Capture the moment for thousands watching online across Africa.",
        Icon: VideoIcon,
        color: "from-cyan-500/20 to-cyan-500/5",
        requirements: ["Experience in video/sound production", "Own or access equipment", "Attend 2 pre-event tech rehearsals"],
    },
    {
        id: "hospitality",
        title: "Hospitality & Logistics",
        desc: "Ensuring every worshipper feels at home. Ushering, crowd flow, welcome teams, and on-site logistics.",
        Icon: HomeSmileIcon,
        color: "from-emerald/20 to-emerald/5",
        requirements: ["Friendly and servant-hearted", "Physically able to stand for long hours", "Bilingual (Swahili + English) preferred"],
    },
    {
        id: "partners",
        title: "Partners & Sponsors",
        desc: "For corporate and individual supporters powering the vision. M-Pesa, bank transfer, and in-kind partnerships available.",
        Icon: DonateIcon,
        color: "from-purple-500/20 to-purple-500/5",
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
        // Delay GSAP slightly to allow Next.js page transition to complete and DOM to settle
        const timer = setTimeout(() => {
            const ctx = gsap.context(() => {
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
            return () => ctx.revert();
        }, 100);

        return () => clearTimeout(timer);
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
                    <div className="tracks-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tracks.map((track) => (
                            <div
                                key={track.id}
                                id={`track-${track.id}`}
                                className={`track-card glass-card-elevated p-10 space-y-6 group cursor-pointer rounded-lg transition-all duration-500 border ${activeTrack === track.id ? "border-gold/50 bg-gold/5" : "border-white/5 hover:border-gold/20"}`}
                                onClick={() => {
                                    setActiveTrack(activeTrack === track.id ? null : track.id);
                                    setFormState((prev) => ({ ...prev, track: track.title }));
                                }}
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-500`}>
                                    <track.Icon className={track.id === 'partners' ? 'text-purple-500' : 'text-gold'} />
                                </div>
                                <h3 className="text-2xl font-black tracking-tighter group-hover:text-gold transition-colors">{track.title}</h3>
                                <p className="text-foreground/50 text-sm font-bold leading-relaxed">{track.desc}</p>
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
                                <div className="pt-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeTrack === track.id ? "text-gold" : "text-gold/50 group-hover:text-gold"}`}>
                                        {activeTrack === track.id ? "Selected ✓" : "Select to Apply →"}
                                    </span>
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
                            <p className="text-sm font-black group-hover:text-gold transition-colors">Our History &rarr;</p>
                            <p className="text-white/30 text-xs font-medium">22 seasons of worship and prayer across Africa.</p>
                        </Link>
                        <Link
                            href="/testimonies"
                            className="group glass-card rounded-xl p-6 border-white/5 hover:border-gold/20 transition-all space-y-3"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-gold">Inspired By</p>
                            <p className="text-sm font-black group-hover:text-gold transition-colors">Echoes of Grace &rarr;</p>
                            <p className="text-white/30 text-xs font-medium">Read why thousands choose to serve year after year.</p>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

