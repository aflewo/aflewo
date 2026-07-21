"use client";

import { events, parseEventDate, AFLEWOEvent } from "@/lib/events";
import { chapters } from "@/lib/chapters";
import Footer from "@/components/Footer";
import Link from "next/link";
import SvgIcon from "@/components/ui/SvgIcon";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ─── Spring presets (Apple Design) ──────────────────────────────────────────────
const SPRING_DEFAULT = { type: "spring", stiffness: 380, damping: 38, mass: 0.9 } as const;
const SPRING_ENTRANCE = { type: "spring", stiffness: 260, damping: 32, mass: 1.0 } as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const EVENT_TYPES = ["All", "Rehearsal", "Audition", "Mission", "Commissioning", "Training", "Event", "Meeting"];
const CHAPTER_NAMES = ["All Chapters", ...Array.from(new Set(events.map((e) => e.chapter))).sort()];

function getTypeColor(type: string) {
    switch (type) {
        case "Audition":      return { pill: "bg-purple-500/15 text-purple-300 border-purple-500/25",  dot: "bg-purple-400" };
        case "Rehearsal":     return { pill: "bg-blue-500/15 text-blue-300 border-blue-500/25",        dot: "bg-blue-400" };
        case "Mission":       return { pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25", dot: "bg-emerald-400" };
        case "Commissioning": return { pill: "bg-gold/15 text-gold border-gold/25",                    dot: "bg-yellow-400" };
        case "Training":      return { pill: "bg-orange-500/15 text-orange-300 border-orange-500/25",  dot: "bg-orange-400" };
        case "Event":         return { pill: "bg-pink-500/15 text-pink-300 border-pink-500/25",        dot: "bg-pink-400" };
        default:              return { pill: "bg-white/5 text-white/50 border-white/10",               dot: "bg-white/30" };
    }
}

function getChapterSlug(name: string): string {
    return chapters.find((c) => c.name.toLowerCase() === name.toLowerCase())?.slug ?? name.toLowerCase();
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ event, past, delay = 0 }: { event: AFLEWOEvent; past: boolean; delay?: number }) {
    const shouldReduceMotion = useReducedMotion();
    const colors = getTypeColor(event.type);

    const handleAddToCalendar = () => {
        if (!event.start || !event.end) return;
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("AFLEWO: " + event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description ?? "")}&location=${encodeURIComponent(event.location)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <motion.div 
            layoutId={`event-${event.id}`}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={shouldReduceMotion ? { duration: 0.2 } : { ...SPRING_ENTRANCE, delay }}
            className={`group relative rounded-[2rem] border overflow-hidden flex flex-col ${past ? "border-white/5 opacity-50" : "border-white/8"}`}
            style={{ 
                background: past ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.02)", 
                backdropFilter: "blur(20px)" 
            }}
            whileHover={{ y: -4, borderColor: past ? "rgba(255,255,255,0.15)" : "rgba(212,175,55,0.25)" }}
        >
            {/* Ambient hover glow */}
            <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-500 pointer-events-none" />

            {/* Top stripe (Signature accent) */}
            <div className={`h-1 w-full ${past ? "bg-white/10" : "bg-gradient-to-r from-gold/70 via-gold/40 to-transparent"}`} />

            <div className="p-7 flex flex-col gap-5 flex-1 relative z-10">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${colors.pill}`}>
                            {event.type}
                        </span>
                        {event.isLive && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] bg-red-500/15 border border-red-500/25 text-red-300 shadow-[0_0_8px_rgba(239,68,68,0.2)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                LIVE
                            </span>
                        )}
                        {past && (
                            <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-white/40">
                                Past
                            </span>
                        )}
                    </div>
                    {event.visibility === "member" && (
                        <SvgIcon name="lock" size={14} className="text-white/20 shrink-0 mt-0.5" />
                    )}
                </div>

                {/* Date + Time block — Editorial Typography */}
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold/70">{event.chapter}</p>
                    <p className="text-[2.5rem] font-black tracking-tighter text-white leading-none">
                        {event.date === "TBD" ? "TBD" : event.time}
                    </p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.25em]">{event.date}</p>
                </div>

                {/* Title */}
                <div>
                    <h3 className="text-lg font-black tracking-tight text-white leading-tight group-hover:text-gold transition-colors duration-300">
                        {event.title}
                    </h3>
                    <p className="text-white/40 text-[11px] font-medium mt-1.5 leading-relaxed line-clamp-2">
                        {event.description ?? event.location}
                    </p>
                </div>

                {/* Venue */}
                <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60 transition-colors">
                    <SvgIcon name="location_on" size={14} className="text-gold/50 shrink-0" />
                    <span className="text-[10px] font-bold tracking-wide truncate">{event.location}</span>
                </div>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2 flex-wrap pt-4 border-t border-white/5">
                    <Link
                        href={`/chapters/${getChapterSlug(event.chapter)}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-gold/10 border border-white/5 hover:border-gold/25 text-white/50 hover:text-gold text-[9px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                        <SvgIcon name="groups" size={12} />
                        Chapter
                    </Link>
                    <Link
                        href={`/media?chapter=${encodeURIComponent(event.chapter)}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/40 hover:text-white/70 text-[9px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                        <SvgIcon name="photo_library" size={12} />
                        Archive
                    </Link>
                    {event.start && !past && (
                        <button
                            onClick={handleAddToCalendar}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold/10 hover:bg-gold border border-gold/20 hover:border-gold text-gold hover:text-brown text-[9px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all ml-auto shadow-glow"
                            style={{ WebkitTapHighlightColor: "transparent" }}
                            title="Add to Google Calendar"
                        >
                            <SvgIcon name="event" size={12} />
                            + Cal
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Countdown to Oct 2 ───────────────────────────────────────────────────────
function FlagshipCountdown() {
    const shouldReduceMotion = useReducedMotion();
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
    
    // Animate numbers smoothly
    const unit = (v: number, label: string) => (
        <div className="flex flex-col items-center gap-1.5">
            <div className="w-16 h-20 md:w-24 md:h-28 rounded-2xl flex items-center justify-center border border-gold/15 bg-[rgba(212,175,55,0.03)] backdrop-blur-md shadow-[inset_0_0_20px_rgba(212,175,55,0.05)] overflow-hidden relative">
                <AnimatePresence mode="popLayout">
                    <motion.span 
                        key={v}
                        initial={shouldReduceMotion ? { opacity: 0 } : { y: 20, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { y: -20, opacity: 0, scale: 0.8 }}
                        transition={SPRING_DEFAULT}
                        className="text-4xl md:text-6xl font-black text-gold tabular-nums tracking-tighter"
                    >
                        {pad(v)}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">{label}</span>
        </div>
    );

    if (diff === 0) return null;
    return (
        <div 
            className="rounded-[2rem] border border-gold/15 p-10 md:p-14 flex flex-col md:flex-row items-center gap-10 justify-between relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.01) 100%)", backdropFilter: "blur(20px)" }}
        >
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.1),transparent_70%)] pointer-events-none" />
            
            <div className="space-y-3 text-center md:text-left relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/70">Flagship Night · Oct 2, 2026</span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">NAIROBI <br/><span className="text-gold">AFLEWO NIGHT</span></h2>
                <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">Winners' Chapel International · 06:00 PM EAT</p>
            </div>
            <div className="flex items-end gap-2 md:gap-4 relative z-10">
                {unit(days, "Days")}
                <span className="text-gold/30 font-black text-3xl mb-6">:</span>
                {unit(hours, "Hrs")}
                <span className="text-gold/30 font-black text-3xl mb-6">:</span>
                {unit(minutes, "Min")}
                <span className="text-gold/30 font-black text-3xl mb-6 hidden sm:block">:</span>
                <div className="hidden sm:block">{unit(seconds, "Sec")}</div>
            </div>
        </div>
    );
}

// ─── Inner page (uses useSearchParams so needs Suspense) ─────────────────────
function EventsInner() {
    const shouldReduceMotion = useReducedMotion();
    const searchParams = useSearchParams();
    const defaultChapter = searchParams.get("chapter") ?? "All Chapters";

    const [typeFilter, setTypeFilter]       = useState("All");
    const [chapterFilter, setChapterFilter] = useState(defaultChapter);
    const [showPast, setShowPast]           = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { upcoming, past } = useMemo(() => {
        if (!mounted) return { upcoming: [], past: [] };
        const now = new Date();
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
    }, [typeFilter, chapterFilter, mounted]);

    const stagger = (i: number) => shouldReduceMotion ? { duration: 0.15 } : { ...SPRING_ENTRANCE, delay: i * 0.05 };

    return (
        <>
            {/* Filters */}
            <motion.section 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_ENTRANCE, delay: 0.3 }}
                className="px-6 pt-6 pb-4 sticky top-0 z-30 border-b border-white/5"
                style={{ background: "rgba(12,10,8,0.75)", backdropFilter: "blur(24px) saturate(180%)" }}
            >
                <div className="max-container flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Type filter */}
                    <div className="flex overflow-x-auto hide-scrollbar gap-1.5 p-1.5 rounded-full border border-white/6 bg-white/2">
                        {EVENT_TYPES.map((t) => (
                            <button 
                                key={t} 
                                onClick={() => setTypeFilter(t)}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${typeFilter === t ? "bg-gold text-brown shadow-glow" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    {/* Chapter filter */}
                    <div className="flex overflow-x-auto hide-scrollbar gap-1.5 p-1.5 rounded-full border border-white/6 bg-white/2">
                        {CHAPTER_NAMES.map((c) => (
                            <button 
                                key={c} 
                                onClick={() => setChapterFilter(c)}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${chapterFilter === c ? "bg-white/20 text-white border border-white/10" : "text-white/30 hover:text-white hover:bg-white/5 border border-transparent"}`}
                            >
                                {c === "All Chapters" ? "All" : c}
                            </button>
                        ))}
                    </div>
                    {/* Past toggle */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        transition={SPRING_DEFAULT}
                        onClick={() => setShowPast((v) => !v)}
                        className={`ml-auto shrink-0 px-6 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${showPast ? "bg-white/10 border-white/20 text-white/70" : "border-white/8 text-white/30 hover:text-white/50"}`}
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                        {showPast ? "Hide Past" : "Show Past"}
                    </motion.button>
                </div>
                <div className="max-container mt-3 flex items-center gap-3">
                    <div className="h-px bg-white/10 flex-1" />
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25">
                        {upcoming.length} upcoming · {past.length} past
                    </p>
                    <div className="h-px bg-white/10 flex-1" />
                </div>
            </motion.section>

            {/* Upcoming */}
            <section className="px-6 py-16 min-h-[50vh]">
                <div className="max-container space-y-10">
                    <motion.div 
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={stagger(0)}
                        className="flex items-center gap-4"
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_12px_rgba(212,175,55,0.6)] animate-pulse" />
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gold/80">Upcoming Events</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent" />
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {upcoming.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={SPRING_DEFAULT}
                                className="text-center py-32 space-y-5"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                                    <SvgIcon name="event_busy" size={32} className="text-white/20" />
                                </div>
                                <p className="text-white/30 font-black uppercase tracking-[0.2em] text-xs">No upcoming events for this filter</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="grid"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {upcoming.map((ev, i) => <EventCard key={ev.id} event={ev} past={false} delay={i * 0.05} />)}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Past events */}
            <AnimatePresence>
                {showPast && past.length > 0 && (
                    <motion.section 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={SPRING_DEFAULT}
                        className="px-6 pb-20 overflow-hidden"
                    >
                        <div className="max-container space-y-10">
                            <div className="flex items-center gap-4">
                                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Past Events</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {past.map((ev, i) => <EventCard key={ev.id} event={ev} past={true} delay={i * 0.05} />)}
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EventsPage() {
    const shouldReduceMotion = useReducedMotion();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const totalEvents = events.length;
    const upcomingCount = mounted ? events.filter((e) => { const d = parseEventDate(e.date); return d && d >= new Date(); }).length : "…";
    const chapterCount  = new Set(events.map((e) => e.chapter)).size;

    const stagger = (i: number) => shouldReduceMotion ? { duration: 0.15 } : { ...SPRING_ENTRANCE, delay: i * 0.05 };

    return (
        <main className="bg-background min-h-screen">
            {/* ── Hero ──────────────────────────────────────────── */}
            <section className="pt-36 pb-16 px-6 border-b border-white/5 relative overflow-hidden">
                {/* Immersive glow */}
                <div className="absolute top-[-20%] right-[10%] w-[600px] h-[500px] rounded-full bg-gold/5 blur-[120px] pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[300px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none mix-blend-screen" />

                <div className="max-container relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <motion.div 
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={stagger(0)}
                            className="space-y-4"
                        >
                            <span className="inline-block text-gold font-black uppercase tracking-[0.4em] text-[10px]">
                                2026 Season Calendar
                            </span>
                            <h1 className="text-[clamp(3.5rem,10vw,7rem)] font-black tracking-tighter leading-[0.85] text-white">
                                IT'S ALL<br />
                                ABOUT <span className="text-gold">EVENTS.</span>
                            </h1>
                            <p className="text-white/40 max-w-md font-bold text-xs uppercase tracking-[0.2em] leading-relaxed pt-2">
                                {upcomingCount} upcoming events across {chapterCount} chapters — rehearsals, auditions, missions, and worship nights.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={stagger(1)}
                            className="grid grid-cols-3 gap-4 shrink-0"
                        >
                            {[
                                { label: "Total Events", value: `${totalEvents}` },
                                { label: "Upcoming",     value: `${upcomingCount}` },
                                { label: "Chapters",     value: `${chapterCount}` },
                            ].map((s) => (
                                <div key={s.label} className="p-5 rounded-[1.5rem] border border-white/6 text-center" style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}>
                                    <p className="text-3xl font-black text-gold tracking-tight">{s.value}</p>
                                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Deep nav links */}
                    <motion.div 
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={stagger(2)}
                        className="mt-10 flex flex-wrap gap-4"
                    >
                        <Link href="/chapters" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-white/6 hover:border-gold/30 hover:bg-white/5 text-white/50 hover:text-gold text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all" style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}>
                            <SvgIcon name="groups" size={14} /> All Chapters
                        </Link>
                        <Link href="/media" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-white/6 hover:border-gold/30 hover:bg-white/5 text-white/50 hover:text-gold text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all" style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}>
                            <SvgIcon name="photo_library" size={14} /> Media Archive
                        </Link>
                        <Link href="/join" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gold text-brown rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                            <SvgIcon name="group_add" size={14} /> Join the Movement
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── Countdown ─────────────────────────────────────── */}
            <section className="px-6 py-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={stagger(3)}
                    className="max-container"
                >
                    <FlagshipCountdown />
                </motion.div>
            </section>

            {/* ── Filtered event list (needs Suspense for useSearchParams) ── */}
            <Suspense fallback={
                <div className="flex items-center justify-center py-40">
                    <SvgIcon name="loader" size={40} className="text-gold/40 animate-spin" />
                </div>
            }>
                <EventsInner />
            </Suspense>

            {/* ── CTA ───────────────────────────────────────────── */}
            <section className="px-6 py-20 border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-gold/5 blur-[120px] pointer-events-none rounded-tl-[100%]" />
                <div className="max-container relative z-10">
                    <div 
                        className="rounded-[2.5rem] border border-gold/15 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12"
                        style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.01) 100%)", backdropFilter: "blur(20px)" }}
                    >
                        <div className="space-y-5 text-center md:text-left">
                            <span className="inline-block text-gold font-black uppercase tracking-[0.4em] text-[10px]">Be Part of Something Eternal</span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">JOIN THE <br/><span className="text-gold">MOVEMENT.</span></h2>
                            <p className="text-white/40 max-w-md font-bold text-xs uppercase tracking-[0.2em] leading-relaxed">
                                Register for auditions across Choir, Band, Media, Ushering, Security, and Dance at any AFLEWO chapter near you.
                            </p>
                        </div>
                        <div className="flex flex-col w-full md:w-auto gap-3 shrink-0">
                            <Link href="/join" className="flex items-center justify-center gap-3 px-10 py-5 bg-gold text-brown rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-glow">
                                <SvgIcon name="group_add" size={18} /> Join Now
                            </Link>
                            <Link href="/chapters" className="flex items-center justify-center gap-3 px-10 py-5 rounded-2xl border border-gold/20 text-gold font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gold/10 active:scale-95 transition-all" style={{ background: "rgba(212,175,55,0.03)" }}>
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
