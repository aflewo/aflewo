"use client";

import { chapters } from "@/lib/chapters";
import { events, parseEventDate } from "@/lib/events";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import SvgIcon from "@/components/ui/SvgIcon";
import { useEffect, useRef, useState } from "react";

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
        case "Audition": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
        case "Rehearsal": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
        case "Mission": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
        case "Commissioning": return "bg-gold/20 text-gold border-gold/30";
        default: return "bg-white/10 text-white/60 border-white/20";
    }
}

// ─── Chapter Card ─────────────────────────────────────────────────────────────
function ChapterCard({ chapter, index }: { chapter: typeof chapters[0]; index: number }) {
    const upcomingChapterEvents = getUpcomingEventsForChapter(chapter.name);
    const [hovered, setHovered] = useState(false);
    const isHero = chapter.size === "hero";
    const isFeatured = chapter.size === "featured";

    return (
        <div
            className={`group relative rounded-2xl overflow-hidden border border-white/5 transition-all duration-700 cursor-pointer
                ${isHero ? "md:col-span-2 lg:col-span-2 min-h-[520px]" : isFeatured ? "min-h-[380px]" : "min-h-[280px]"}
                hover:border-gold/30 bento-card`}
            style={{ animationDelay: `${index * 0.08}s` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Background image */}
            {chapter.venueImage && (
                <div className="absolute inset-0">
                    <Image
                        src={chapter.venueImage}
                        alt={chapter.name}
                        fill
                        className={`object-cover transition-transform duration-[1200ms] ${hovered ? "scale-110" : "scale-100"}`}
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${chapter.color} opacity-40`} />
                </div>
            )}
            {!chapter.venueImage && (
                <div className={`absolute inset-0 bg-gradient-to-br ${chapter.color}`} />
            )}

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-7">
                {/* Top row */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{chapter.flag}</span>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-sm border border-white/10 text-white/70`}>
                            {chapter.status}
                        </span>
                        {chapter.registrationOpen && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Registration Open" />
                        )}
                    </div>
                    <span className="text-white/20 font-black text-[9px] uppercase tracking-widest">Est. {chapter.established}</span>
                </div>

                {/* Main info */}
                <div className="space-y-4">
                    {/* Upcoming events strip */}
                    {upcomingChapterEvents.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                            {upcomingChapterEvents.map((ev) => (
                                <Link
                                    key={ev.id}
                                    href={`/events?chapter=${encodeURIComponent(chapter.name)}`}
                                    className="flex items-center gap-2 group/ev"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getTypeColor(ev.type)}`}>
                                        {ev.type}
                                    </span>
                                    <span className="text-[10px] font-bold text-white/50 group-hover/ev:text-white/80 transition-colors truncate">
                                        {ev.date} · {ev.location}
                                    </span>
                                    <SvgIcon name="arrow_forward" size={10} className="text-gold/40 group-hover/ev:text-gold transition-colors shrink-0" />
                                </Link>
                            ))}
                        </div>
                    )}

                    <div>
                        <p className="text-gold text-[9px] font-black uppercase tracking-[0.3em] mb-1">{chapter.country}</p>
                        <h2 className={`font-black tracking-tighter leading-none text-white ${isHero ? "text-5xl md:text-7xl" : isFeatured ? "text-4xl md:text-5xl" : "text-3xl"}`}>
                            {chapter.name.toUpperCase()}
                        </h2>
                        {(isHero || isFeatured) && (
                            <p className="text-white/40 text-xs font-medium mt-2 leading-relaxed max-w-sm">
                                {chapter.description.slice(0, 120)}…
                            </p>
                        )}
                    </div>

                    {/* Bottom actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            href={`/chapters/${chapter.slug}`}
                            className="press-scale inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-brown rounded-lg text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
                        >
                            <SvgIcon name="arrow_forward" size={12} />
                            Chapter Page
                        </Link>
                        <Link
                            href={`/events?chapter=${encodeURIComponent(chapter.name)}`}
                            className="press-scale inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/20 transition-all"
                        >
                            <SvgIcon name="calendar_today" size={12} />
                            Events
                        </Link>
                        <Link
                            href={`/media?chapter=${encodeURIComponent(chapter.name)}`}
                            className="press-scale inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/20 transition-all"
                        >
                            <SvgIcon name="photo_library" size={12} />
                            Archive
                        </Link>
                    </div>
                </div>
            </div>

            {/* Diagonal chapter number watermark */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.04] pointer-events-none select-none">
                <span className="text-[80px] font-black text-white leading-none">{String(chapters.indexOf(chapter) + 1).padStart(2, "0")}</span>
            </div>
        </div>
    );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
    const now = new Date();
    const upcomingCount = events.filter((e) => {
        const d = parseEventDate(e.date);
        return d && d >= now;
    }).length;

    const stats = [
        { label: "Chapters", value: `${chapters.length}` },
        { label: "Countries", value: "4" },
        { label: "Upcoming Events", value: `${upcomingCount}` },
        { label: "Years Active", value: "20+" },
        { label: "Souls Reached", value: "15K+" },
    ];

    return (
        <div className="flex items-center gap-px overflow-x-auto hide-scrollbar glass-card rounded-2xl p-1 mt-8">
            {stats.map((s, i) => (
                <div key={s.label} className={`flex-1 min-w-[100px] px-5 py-4 text-center ${i < stats.length - 1 ? "border-r border-white/5" : ""}`}>
                    <p className="text-2xl font-black text-gold leading-none">{s.value}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1">{s.label}</p>
                </div>
            ))}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ChaptersPage() {
    const [countryFilter, setCountryFilter] = useState("All");
    const [search, setSearch] = useState("");
    const heroRef = useRef<HTMLDivElement>(null);

    // Scroll-reveal
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add("revealed");
                });
            },
            { threshold: 0.08 }
        );
        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const filtered = chapters.filter((c) => {
        const countryOk = countryFilter === "All" || c.country === countryFilter;
        const searchOk = search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase());
        return countryOk && searchOk;
    });

    return (
        <main className="bg-background min-h-screen">
            {/* ── Hero ─────────────────────────────────────────── */}
            <section ref={heroRef} className="pt-36 pb-12 px-6 border-b border-white/5 relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-terracotta/5 blur-[100px] pointer-events-none" />

                <div className="max-container relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-3 animate-fade-in-up">
                            <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px]">
                                One God. One People. One Africa.
                            </span>
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85]">
                                OUR<br />
                                <span className="text-gold">CHAPTERS.</span>
                            </h1>
                            <p className="text-foreground/40 max-w-md font-bold text-xs uppercase tracking-widest leading-relaxed">
                                {chapters.length} active chapters across East & Central Africa — united in worship since 2004.
                            </p>
                        </div>

                        {/* Nav quick-links */}
                        <div className="flex flex-col gap-3 shrink-0 animate-fade-in-up stagger-2">
                            <Link href="/events" className="press-scale flex items-center gap-3 px-6 py-3 glass-card rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-gold hover:border-gold/30 transition-all border border-white/5">
                                <SvgIcon name="event" size={16} className="text-gold" />
                                Full Event Calendar
                                <SvgIcon name="arrow_forward" size={12} className="ml-auto" />
                            </Link>
                            <Link href="/media" className="press-scale flex items-center gap-3 px-6 py-3 glass-card rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-gold hover:border-gold/30 transition-all border border-white/5">
                                <SvgIcon name="photo_library" size={16} className="text-gold" />
                                Media Archive
                                <SvgIcon name="arrow_forward" size={12} className="ml-auto" />
                            </Link>
                            <Link href="/join" className="press-scale flex items-center gap-3 px-6 py-3 bg-gold text-brown rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                                <SvgIcon name="group_add" size={16} />
                                Join a Chapter
                                <SvgIcon name="arrow_forward" size={12} className="ml-auto" />
                            </Link>
                        </div>
                    </div>

                    <StatsBar />

                    {/* Filters + Search */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        {/* Country filter pills */}
                        <div className="flex overflow-x-auto hide-scrollbar gap-1.5 glass-card p-1.5 rounded-full">
                            {CONTINENT_FILTERS.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setCountryFilter(f)}
                                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${countryFilter === f
                                        ? "bg-gold text-brown"
                                        : "text-white/40 hover:text-white"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative ml-auto shrink-0">
                            <SvgIcon name="search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search chapters..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2.5 glass-card rounded-full text-[10px] font-bold text-white placeholder-white/20 outline-none focus:border-gold/40 border border-white/5 w-56 transition-all"
                            />
                        </div>
                    </div>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-white/20">
                        Showing {filtered.length} of {chapters.length} chapters
                    </p>
                </div>
            </section>

            {/* ── Bento Grid ───────────────────────────────────── */}
            <section className="px-6 py-12">
                <div className="max-container">
                    {filtered.length === 0 ? (
                        <div className="text-center py-32 space-y-4">
                            <SvgIcon name="explore_off" size={48} className="text-white/10 mx-auto" />
                            <p className="text-white/30 font-black uppercase tracking-widest text-sm">No chapters found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((chapter, i) => (
                                <div key={chapter.slug} className="reveal reveal-delay-1">
                                    <ChapterCard chapter={chapter} index={i} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Continental Map CTA ──────────────────────────── */}
            <section className="px-6 py-16 border-t border-white/5">
                <div className="max-container">
                    <div className="glass-card-elevated rounded-2xl border-gold/10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-4 text-center md:text-left">
                            <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px]">Continental Vision</span>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
                                ONE AFRICA,<br /><span className="text-gold">ONE VOICE.</span>
                            </h2>
                            <p className="text-foreground/40 max-w-md font-bold text-xs uppercase tracking-widest leading-relaxed">
                                Every chapter is a node in a continental worship network that has been building since 2004. Join us on October 2nd, 2026 in Nairobi for the flagship all-night worship gathering.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 shrink-0">
                            <Link
                                href="/events"
                                className="press-scale flex items-center gap-3 px-10 py-5 bg-gold text-brown rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all"
                            >
                                <SvgIcon name="event" size={18} />
                                View All Events
                            </Link>
                            <Link
                                href="/join"
                                className="press-scale flex items-center gap-3 px-10 py-5 glass-card border border-gold/20 text-gold rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gold/10 transition-all"
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
