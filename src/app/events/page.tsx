"use client";

import { events, parseEventDate, AFLEWOEvent } from "@/lib/events";
import { chapters } from "@/lib/chapters";
import Footer from "@/components/Footer";
import Link from "next/link";
import SvgIcon from "@/components/ui/SvgIcon";
import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const EVENT_TYPES = ["All", "Rehearsal", "Audition", "Mission", "Commissioning", "Training", "Event", "Meeting"];
const CHAPTER_NAMES = ["All Chapters", ...Array.from(new Set(events.map((e) => e.chapter))).sort()];

function getTypeColor(type: string) {
    switch (type) {
        case "Audition":      return { pill: "bg-purple-500/20 text-purple-300 border-purple-500/30",  dot: "bg-purple-400" };
        case "Rehearsal":     return { pill: "bg-blue-500/20 text-blue-300 border-blue-500/30",        dot: "bg-blue-400" };
        case "Mission":       return { pill: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" };
        case "Commissioning": return { pill: "bg-gold/20 text-gold border-gold/30",                    dot: "bg-yellow-400" };
        case "Training":      return { pill: "bg-orange-500/20 text-orange-300 border-orange-500/30",  dot: "bg-orange-400" };
        case "Event":         return { pill: "bg-pink-500/20 text-pink-300 border-pink-500/30",        dot: "bg-pink-400" };
        default:              return { pill: "bg-white/10 text-white/50 border-white/15",              dot: "bg-white/30" };
    }
}

function isDatePast(dateStr: string): boolean {
    const d = parseEventDate(dateStr);
    if (!d) return false;
    return d < new Date();
}

function getChapterSlug(name: string): string {
    return chapters.find((c) => c.name.toLowerCase() === name.toLowerCase())?.slug ?? name.toLowerCase();
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ event, past }: { event: AFLEWOEvent; past: boolean }) {
    const colors = getTypeColor(event.type);
    const [copied, setCopied] = useState(false);

    const handleAddToCalendar = () => {
        if (!event.start || !event.end) return;
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("AFLEWO: " + event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description ?? "")}&location=${encodeURIComponent(event.location)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className={`group relative glass-card rounded-2xl border border-white/5 hover:border-gold/25 transition-all duration-500 overflow-hidden flex flex-col bento-card ${past ? "opacity-50 hover:opacity-70" : ""}`}>
            {/* Top stripe */}
            <div className={`h-0.5 w-full ${past ? "bg-white/10" : "bg-gradient-to-r from-gold/60 via-gold/30 to-transparent"}`} />

            <div className="p-6 flex flex-col gap-4 flex-1">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${colors.pill}`}>
                            {event.type}
                        </span>
                        {event.isLive && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-red-500/20 border border-red-500/30 text-red-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                LIVE
                            </span>
                        )}
                        {past && (
                            <span className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white/30">
                                Past
                            </span>
                        )}
                    </div>
                    {event.visibility === "member" && (
                        <SvgIcon name="lock" size={12} className="text-white/20 shrink-0 mt-0.5" />
                    )}
                </div>

                {/* Date + Time block — inspo: large clock numbers */}
                <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold/60">{event.chapter}</p>
                    <p className="text-3xl font-black tracking-tighter text-white leading-none">
                        {event.date === "TBD" ? "TBD" : event.time}
                    </p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{event.date}</p>
                </div>

                {/* Title */}
                <div>
                    <h3 className="text-base font-black tracking-tight text-white leading-tight group-hover:text-gold transition-colors duration-300">
                        {event.title}
                    </h3>
                    <p className="text-white/35 text-[10px] font-medium mt-1 leading-relaxed line-clamp-2">
                        {event.description ?? event.location}
                    </p>
                </div>

                {/* Venue */}
                <div className="flex items-center gap-2 text-white/30">
                    <SvgIcon name="location_on" size={12} className="text-gold/40 shrink-0" />
                    <span className="text-[10px] font-bold truncate">{event.location}</span>
                </div>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2 flex-wrap pt-2 border-t border-white/5">
                    {/* Chapter link */}
                    <Link
                        href={`/chapters/${getChapterSlug(event.chapter)}`}
                        className="press-scale inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-gold/10 border border-white/5 hover:border-gold/20 text-white/50 hover:text-gold text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                        <SvgIcon name="groups" size={11} />
                        Chapter
                    </Link>
                    {/* Media link */}
                    <Link
                        href={`/media?chapter=${encodeURIComponent(event.chapter)}`}
                        className="press-scale inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-white/30 hover:text-white/60 text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                        <SvgIcon name="photo_library" size={11} />
                        Archive
                    </Link>
                    {/* Google Calendar */}
                    {event.start && (
                        <button
                            onClick={handleAddToCalendar}
                            className="press-scale inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-white/30 hover:text-white/60 text-[9px] font-black uppercase tracking-widest transition-all ml-auto"
                            title="Add to Google Calendar"
                        >
                            <SvgIcon name="event" size={11} />
                            + Cal
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Countdown to Oct 2 ───────────────────────────────────────────────────────
function FlagshipCountdown() {
    const target = new Date("2026-10-02T18:00:00+03:00");
    const [diff, setDiff] = useState(0);

    useEffect(() => {
        const tick = () => setDiff(Math.max(0, target.getTime() - Date.now()));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const pad = (n: number) => String(n).padStart(2, "0");
    const unit = (v: number, label: string) => (
        <div className="flex flex-col items-center gap-1">
            <div className="countdown-digit w-14 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center">
                <span className="text-2xl md:text-4xl font-black text-gold tabular-nums">{pad(v)}</span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{label}</span>
        </div>
    );

    if (diff === 0) return null;
    return (
        <div className="glass-card-elevated rounded-2xl border border-gold/15 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-2 text-center md:text-left">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gold/60">Flagship Night · Oct 2, 2026</span>
                <h2 className="text-2xl md:text-4xl font-black tracking-tighter">NAIROBI <span className="text-gold">AFLEWO NIGHT</span></h2>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Winners' Chapel International · 06:00 PM EAT</p>
            </div>
            <div className="flex items-end gap-2 md:gap-3">
                {unit(days, "Days")}
                <span className="text-gold/40 font-black text-xl mb-4">:</span>
                {unit(hours, "Hrs")}
                <span className="text-gold/40 font-black text-xl mb-4">:</span>
                {unit(minutes, "Min")}
                <span className="text-gold/40 font-black text-xl mb-4">:</span>
                {unit(seconds, "Sec")}
            </div>
            <Link
                href="/join"
                className="press-scale px-8 py-4 bg-gold text-brown rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shrink-0"
            >
                Join the Movement
            </Link>
        </div>
    );
}

// ─── Inner page (uses useSearchParams so needs Suspense) ─────────────────────
function EventsInner() {
    const searchParams = useSearchParams();
    const defaultChapter = searchParams.get("chapter") ?? "All Chapters";

    const [typeFilter, setTypeFilter]       = useState("All");
    const [chapterFilter, setChapterFilter] = useState(defaultChapter);
    const [showPast, setShowPast]           = useState(false);

    const now = new Date();

    const { upcoming, past } = useMemo(() => {
        const sorted = [...events].sort((a, b) => {
            const da = parseEventDate(a.date);
            const db = parseEventDate(b.date);
            if (!da) return 1;
            if (!db) return -1;
            return da.getTime() - db.getTime();
        });

        const matchFilter = (e: AFLEWOEvent) => {
            const typeOk    = typeFilter === "All" || e.type === typeFilter;
            const chapOk    = chapterFilter === "All Chapters" || e.chapter === chapterFilter;
            return typeOk && chapOk;
        };

        const u: AFLEWOEvent[] = [];
        const p: AFLEWOEvent[] = [];

        sorted.forEach((e) => {
            if (!matchFilter(e)) return;
            const d = parseEventDate(e.date);
            if (!d || d >= now) u.push(e);
            else p.push(e);
        });

        return { upcoming: u, past: p.reverse() };
    }, [typeFilter, chapterFilter]);

    return (
        <>
            {/* Filters */}
            <section className="px-6 pt-6 pb-4 sticky top-0 z-20 bg-background/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-container flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    {/* Type filter */}
                    <div className="flex overflow-x-auto hide-scrollbar gap-1.5 glass-card p-1.5 rounded-full">
                        {EVENT_TYPES.map((t) => (
                            <button key={t} onClick={() => setTypeFilter(t)}
                                className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${typeFilter === t ? "bg-gold text-brown" : "text-white/40 hover:text-white"}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    {/* Chapter filter */}
                    <div className="flex overflow-x-auto hide-scrollbar gap-1.5 glass-card p-1.5 rounded-full">
                        {CHAPTER_NAMES.map((c) => (
                            <button key={c} onClick={() => setChapterFilter(c)}
                                className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${chapterFilter === c ? "bg-white/20 text-white" : "text-white/30 hover:text-white"}`}>
                                {c === "All Chapters" ? "All" : c}
                            </button>
                        ))}
                    </div>
                    {/* Past toggle */}
                    <button
                        onClick={() => setShowPast((v) => !v)}
                        className={`ml-auto shrink-0 px-4 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${showPast ? "bg-white/10 border-white/20 text-white/60" : "border-white/5 text-white/20 hover:text-white/40"}`}
                    >
                        {showPast ? "Hide Past" : "Show Past"}
                    </button>
                </div>
                <p className="max-container mt-2 text-[9px] font-black uppercase tracking-widest text-white/15">
                    {upcoming.length} upcoming · {past.length} past
                </p>
            </section>

            {/* Upcoming */}
            <section className="px-6 py-10">
                <div className="max-container space-y-8">
                    <div className="flex items-center gap-4">
                        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gold/70">Upcoming Events</h2>
                        <div className="flex-1 h-px bg-gold/10" />
                    </div>

                    {upcoming.length === 0 ? (
                        <div className="text-center py-24 space-y-3">
                            <SvgIcon name="event_busy" size={40} className="text-white/10 mx-auto" />
                            <p className="text-white/20 font-black uppercase tracking-widest text-sm">No upcoming events for this filter</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {upcoming.map((ev) => <EventCard key={ev.id} event={ev} past={false} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* Past events (collapsible) */}
            {showPast && past.length > 0 && (
                <section className="px-6 pb-10">
                    <div className="max-container space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="w-2 h-2 rounded-full bg-white/20" />
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/30">Past Events</h2>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {past.map((ev) => <EventCard key={ev.id} event={ev} past={true} />)}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EventsPage() {
    // Scroll-reveal
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
            { threshold: 0.06 }
        );
        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const totalEvents = events.length;
    const now = new Date();
    const upcomingCount = events.filter((e) => { const d = parseEventDate(e.date); return d && d >= now; }).length;
    const chapterCount  = new Set(events.map((e) => e.chapter)).size;

    return (
        <main className="bg-background min-h-screen">
            {/* ── Hero ──────────────────────────────────────────── */}
            <section className="pt-36 pb-12 px-6 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[350px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
                <div className="max-container relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-3 animate-fade-in-up">
                            <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px]">2026 Season Calendar</span>
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85]">
                                IT'S ALL<br />
                                ABOUT <span className="text-gold">EVENTS.</span>
                            </h1>
                            <p className="text-foreground/40 max-w-md font-bold text-xs uppercase tracking-widest leading-relaxed">
                                {upcomingCount} upcoming events across {chapterCount} chapters — rehearsals, auditions, missions, and worship nights.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 shrink-0 animate-fade-in-up stagger-2">
                            {[
                                { label: "Total Events", value: `${totalEvents}` },
                                { label: "Upcoming",     value: `${upcomingCount}` },
                                { label: "Chapters",     value: `${chapterCount}` },
                            ].map((s) => (
                                <div key={s.label} className="glass-card p-4 rounded-xl text-center">
                                    <p className="text-2xl font-black text-gold">{s.value}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Deep nav links */}
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link href="/chapters" className="press-scale inline-flex items-center gap-2 px-5 py-2.5 glass-card rounded-full border border-white/5 hover:border-gold/25 text-white/50 hover:text-gold text-[9px] font-black uppercase tracking-widest transition-all">
                            <SvgIcon name="groups" size={14} /> All Chapters
                        </Link>
                        <Link href="/media" className="press-scale inline-flex items-center gap-2 px-5 py-2.5 glass-card rounded-full border border-white/5 hover:border-gold/25 text-white/50 hover:text-gold text-[9px] font-black uppercase tracking-widest transition-all">
                            <SvgIcon name="photo_library" size={14} /> Media Archive
                        </Link>
                        <Link href="/join" className="press-scale inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-brown rounded-full text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                            <SvgIcon name="group_add" size={14} /> Join the Movement
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Countdown ─────────────────────────────────────── */}
            <section className="px-6 py-8">
                <div className="max-container reveal">
                    <FlagshipCountdown />
                </div>
            </section>

            {/* ── Filtered event list (needs Suspense for useSearchParams) ── */}
            <Suspense fallback={
                <div className="flex items-center justify-center py-32">
                    <SvgIcon name="spinner" size={40} className="text-white/20 animate-spin" />
                </div>
            }>
                <EventsInner />
            </Suspense>

            {/* ── CTA ───────────────────────────────────────────── */}
            <section className="px-6 py-16 border-t border-white/5">
                <div className="max-container">
                    <div className="glass-card-elevated rounded-2xl border-gold/10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-3 text-center md:text-left">
                            <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px]">Be Part of Something Eternal</span>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">JOIN THE <span className="text-gold">MOVEMENT.</span></h2>
                            <p className="text-foreground/40 max-w-md font-bold text-xs uppercase tracking-widest leading-relaxed">
                                Register for auditions across Choir, Band, Media, Ushering, Security, and Dance at any AFLEWO chapter near you.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 shrink-0">
                            <Link href="/join" className="press-scale flex items-center gap-3 px-10 py-5 bg-gold text-brown rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
                                <SvgIcon name="group_add" size={18} /> Join Now
                            </Link>
                            <Link href="/chapters" className="press-scale flex items-center gap-3 px-10 py-5 glass-card border border-gold/15 text-gold/70 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gold/10 transition-all">
                                <SvgIcon name="groups" size={18} /> Browse Chapters
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
