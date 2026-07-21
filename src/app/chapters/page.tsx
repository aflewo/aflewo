"use client";

import { chapters } from "@/lib/chapters";
import { events, parseEventDate } from "@/lib/events";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import SvgIcon from "@/components/ui/SvgIcon";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ─── Spring presets (Apple Design) ──────────────────────────────────────────────
const SPRING_DEFAULT = { type: "spring", stiffness: 380, damping: 38, mass: 0.9 } as const;
const SPRING_ENTRANCE = { type: "spring", stiffness: 260, damping: 32, mass: 1.0 } as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CONTINENT_FILTERS = ["All", "Kenya", "Tanzania", "Rwanda", "Uganda"];

function getUpcomingEventsForChapter(chapterName: string) {
    const now = new Date();
    return events
        .filter((e) => {
            if (e.chapter !== chapterName) return false;
            const d = parseEventDate(e.date);
            return d && d >= now;
        })
        .sort((a, b) => {
            const da = parseEventDate(a.date);
            const db = parseEventDate(b.date);
            return (da?.getTime() ?? 0) - (db?.getTime() ?? 0);
        })
        .slice(0, 2);
    }

function getTypeColor(type: string) {
    switch (type) {
        case "Audition": return "bg-purple-500/15 text-purple-300 border-purple-500/25";
        case "Rehearsal": return "bg-blue-500/15 text-blue-300 border-blue-500/25";
        case "Mission": return "bg-emerald-500/15 text-emerald-300 border-emerald-500/25";
        case "Commissioning": return "bg-gold/15 text-gold border-gold/25";
        default: return "bg-white/5 text-white/50 border-white/10";
    }
}

// ─── Chapter Card ─────────────────────────────────────────────────────────────
function ChapterCard({ chapter, index }: { chapter: typeof chapters[0]; index: number }) {
    const shouldReduceMotion = useReducedMotion();
    const upcomingChapterEvents = getUpcomingEventsForChapter(chapter.name);
    const [hovered, setHovered] = useState(false);
    
    const isHero = chapter.size === "hero";
    const isFeatured = chapter.size === "featured";

    return (
        <motion.div
            layoutId={`chapter-card-${chapter.slug}`}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={shouldReduceMotion ? { duration: 0.2 } : { ...SPRING_ENTRANCE, delay: index * 0.05 }}
            className={`group relative rounded-[2rem] overflow-hidden border border-white/6 cursor-pointer
                ${isHero ? "md:col-span-2 lg:col-span-2 min-h-[520px]" : isFeatured ? "min-h-[400px]" : "min-h-[320px]"}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileHover={{ y: -4, borderColor: "rgba(212,175,55,0.25)" }}
            whileTap={{ scale: 0.98 }}
            style={{ WebkitTapHighlightColor: "transparent" }}
        >
            {/* Background Image / Material */}
            {chapter.venueImage ? (
                <div className="absolute inset-0">
                    <motion.div 
                        className="w-full h-full"
                        animate={{ scale: hovered ? 1.05 : 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        <Image
                            src={chapter.venueImage}
                            alt={chapter.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-background/10" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${chapter.color} opacity-40 mix-blend-overlay`} />
                </div>
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${chapter.color} opacity-20`} />
            )}

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col justify-between p-8">
                {/* Top Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{chapter.flag}</span>
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white/70 bg-black/30 backdrop-blur-md border border-white/10">
                            {chapter.status}
                        </span>
                        {chapter.registrationOpen && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" title="Registration Open" />
                        )}
                    </div>
                    <span className="text-white/30 font-black text-[9px] uppercase tracking-[0.25em]">Est. {chapter.established}</span>
                </div>

                {/* Main Body */}
                <div className="space-y-5">
                    {/* Upcoming Events Pills */}
                    {upcomingChapterEvents.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                            {upcomingChapterEvents.map((ev) => (
                                <Link
                                    key={ev.id}
                                    href={`/events?chapter=${encodeURIComponent(chapter.name)}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 group/ev w-fit"
                                >
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${getTypeColor(ev.type)}`}>
                                        {ev.type}
                                    </span>
                                    <span className="text-[10px] font-bold text-white/50 group-hover/ev:text-white/80 transition-colors">
                                        {ev.date} · {ev.location}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Headline */}
                    <div>
                        <p className="text-gold/80 text-[9px] font-black uppercase tracking-[0.3em] mb-1.5">{chapter.country}</p>
                        <h2 className={`font-black tracking-tighter leading-none text-white ${isHero ? "text-6xl md:text-8xl" : isFeatured ? "text-5xl" : "text-4xl"}`}>
                            {chapter.name.toUpperCase()}
                        </h2>
                        {(isHero || isFeatured) && (
                            <p className="text-white/45 text-sm font-medium mt-3 leading-relaxed max-w-sm line-clamp-2">
                                {chapter.description}
                            </p>
                        )}
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center gap-2 flex-wrap pt-2">
                        <Link
                            href={`/chapters/${chapter.slug}`}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gold text-brown rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all"
                        >
                            <SvgIcon name="arrow_forward" size={12} />
                            View Chapter
                        </Link>
                        <Link
                            href={`/events?chapter=${encodeURIComponent(chapter.name)}`}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white hover:bg-white/10 border border-white/10 active:scale-95 transition-all"
                            style={{ backdropFilter: "blur(12px)" }}
                        >
                            <SvgIcon name="calendar_today" size={12} />
                            Events
                        </Link>
                    </div>
                </div>
            </div>

            {/* Subdued Number Watermark */}
            <div className="absolute top-4 right-4 opacity-[0.03] pointer-events-none select-none">
                <span className="text-[100px] font-black text-white leading-none tracking-tighter">
                    {String(chapters.indexOf(chapter) + 1).padStart(2, "0")}
                </span>
            </div>
        </motion.div>
    );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const upcomingCount = mounted ? events.filter((e) => {
        const d = parseEventDate(e.date);
        return d && d >= new Date();
    }).length : "…";

    const stats = [
        { label: "Chapters", value: `${chapters.length}` },
        { label: "Countries", value: "4" },
        { label: "Upcoming Events", value: `${upcomingCount}` },
        { label: "Years Active", value: "20+" },
        { label: "Souls Reached", value: "15K+" },
    ];

    return (
        <div 
            className="flex items-center overflow-x-auto hide-scrollbar rounded-3xl mt-8 border border-white/6"
            style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}
        >
            {stats.map((s, i) => (
                <div key={s.label} className={`flex-1 min-w-[120px] px-6 py-5 text-center ${i < stats.length - 1 ? "border-r border-white/5" : ""}`}>
                    <p className="text-3xl font-black text-gold tracking-tight leading-none mb-1">{s.value}</p>
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">{s.label}</p>
                </div>
            ))}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ChaptersPage() {
    const shouldReduceMotion = useReducedMotion();
    const [countryFilter, setCountryFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const filtered = chapters.filter((c) => {
        const countryOk = countryFilter === "All" || c.country === countryFilter;
        const searchOk = search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase());
        return countryOk && searchOk;
    });

    const stagger = (i: number) => shouldReduceMotion ? { duration: 0.15 } : { ...SPRING_ENTRANCE, delay: i * 0.05 };

    return (
        <main className="bg-background min-h-screen">
            {/* ── Hero ─────────────────────────────────────────── */}
            <section className="pt-36 pb-12 px-6 border-b border-white/5 relative overflow-hidden">
                {/* Immersive ambient glows */}
                <div className="absolute top-[-10%] left-[10%] w-[600px] h-[500px] rounded-full bg-gold/5 blur-[120px] pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[400px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none mix-blend-screen" />

                <div className="max-container relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <motion.div 
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={stagger(0)}
                            className="space-y-4"
                        >
                            <span className="inline-block text-gold font-black uppercase tracking-[0.4em] text-[10px]">
                                One God. One People. One Africa.
                            </span>
                            <h1 className="text-[clamp(3.5rem,10vw,7rem)] font-black tracking-tighter leading-[0.85] text-white">
                                OUR<br />
                                <span className="text-gold">CHAPTERS.</span>
                            </h1>
                            <p className="text-white/40 max-w-md font-bold text-xs uppercase tracking-[0.2em] leading-relaxed pt-2">
                                {chapters.length} active chapters across East & Central Africa — united in worship since 2004.
                            </p>
                        </motion.div>

                        {/* Nav quick-links */}
                        <motion.div 
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={stagger(1)}
                            className="flex flex-col gap-3 shrink-0"
                        >
                            {[
                                { href: "/events", icon: "event", label: "Full Event Calendar" },
                                { href: "/media", icon: "photo_library", label: "Media Archive" },
                            ].map(link => (
                                <Link 
                                    key={link.href}
                                    href={link.href} 
                                    className="flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-white/6 hover:border-gold/30 hover:bg-white/5 transition-colors text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-gold group"
                                    style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}
                                >
                                    <SvgIcon name={link.icon} size={16} className="text-gold/70 group-hover:text-gold transition-colors" />
                                    {link.label}
                                    <SvgIcon name="arrow_forward" size={14} className="ml-auto opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                            <Link 
                                href="/join" 
                                className="flex items-center gap-3 px-6 py-3.5 bg-gold text-brown rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all group shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                            >
                                <SvgIcon name="group_add" size={16} />
                                Join a Chapter
                                <SvgIcon name="arrow_forward" size={14} className="ml-auto group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={stagger(2)}>
                        <StatsBar />
                    </motion.div>

                    {/* Filters + Search */}
                    <motion.div 
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={stagger(3)}
                        className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                    >
                        {/* Country filter pills */}
                        <div className="flex overflow-x-auto hide-scrollbar gap-1.5 p-1.5 rounded-full border border-white/6 bg-white/2" style={{ backdropFilter: "blur(12px)" }}>
                            {CONTINENT_FILTERS.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setCountryFilter(f)}
                                    className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                                        countryFilter === f
                                        ? "bg-gold text-brown shadow-glow"
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full sm:w-auto shrink-0">
                            <SvgIcon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search chapters..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-64 pl-11 pr-4 py-3 rounded-full text-xs font-bold text-white placeholder:text-white/20 outline-none focus:border-gold/50 border border-white/10 bg-white/5 transition-colors"
                            />
                        </div>
                    </motion.div>

                    <motion.p 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={stagger(4)}
                        className="mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/25"
                    >
                        Showing {filtered.length} of {chapters.length} chapters
                    </motion.p>
                </div>
            </section>

            {/* ── Grid ───────────────────────────────────────────── */}
            <section className="px-6 py-16">
                <div className="max-container">
                    <AnimatePresence mode="wait">
                        {filtered.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={SPRING_DEFAULT}
                                className="text-center py-32 space-y-5"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                                    <SvgIcon name="explore_off" size={32} className="text-white/20" />
                                </div>
                                <p className="text-white/30 font-black uppercase tracking-[0.2em] text-xs">No chapters found</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="grid"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filtered.map((chapter, i) => (
                                    <ChapterCard key={chapter.slug} chapter={chapter} index={i} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* ── Continental Map CTA ──────────────────────────── */}
            <section className="px-6 py-20 border-t border-white/5 relative overflow-hidden">
                {/* Subtle bottom glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gold/5 blur-[120px] pointer-events-none rounded-t-[100%]" />
                
                <div className="max-container relative z-10">
                    <div 
                        className="rounded-[2.5rem] border border-gold/15 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12"
                        style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.01) 100%)", backdropFilter: "blur(20px)" }}
                    >
                        <div className="space-y-5 text-center md:text-left">
                            <span className="inline-block text-gold font-black uppercase tracking-[0.4em] text-[10px]">Continental Vision</span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                                ONE AFRICA,<br /><span className="text-gold">ONE VOICE.</span>
                            </h2>
                            <p className="text-white/40 max-w-md font-bold text-xs uppercase tracking-[0.2em] leading-relaxed">
                                Every chapter is a node in a continental worship network that has been building since 2004. Join us on October 2nd, 2026 in Nairobi for the flagship all-night worship gathering.
                            </p>
                        </div>
                        <div className="flex flex-col w-full md:w-auto gap-3 shrink-0">
                            <Link
                                href="/events"
                                className="flex items-center justify-center gap-3 px-10 py-5 bg-gold text-brown rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                            >
                                <SvgIcon name="event" size={18} />
                                View All Events
                            </Link>
                            <Link
                                href="/join"
                                className="flex items-center justify-center gap-3 px-10 py-5 rounded-2xl border border-gold/20 text-gold font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gold/10 active:scale-95 transition-all"
                                style={{ background: "rgba(212,175,55,0.03)" }}
                            >
                                <SvgIcon name="group_add" size={18} />
                                Join the Movement
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
