"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SvgIcon from "@/components/ui/SvgIcon";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

import { events, parseEventDate, type AFLEWOEvent } from "@/lib/events";

const chapterColors: Record<string, { bg: string; text: string; border: string }> = {
    Nairobi: { bg: "bg-gold/20", text: "text-gold", border: "border-gold/30" },
    Nakuru: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
    Eldoret: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
    Mombasa: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
    Tanzania: { bg: "bg-emerald/20", text: "text-emerald", border: "border-emerald/30" },
    Rwanda: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
    Nyeri: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
    Meru: { bg: "bg-lime-500/20", text: "text-lime-400", border: "border-lime-500/30" }
};

const chapters = Object.keys(chapterColors);
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getNextAFLEWOEvent(): AFLEWOEvent | null {
    const now = new Date();
    const futureEvents = events
        .filter(e => {
            const date = parseEventDate(e.date);
            return date && date > now;
        })
        .sort((a, b) => {
            const dateA = parseEventDate(a.date);
            const dateB = parseEventDate(b.date);
            if (!dateA || !dateB) return 0;
            return dateA.getTime() - dateB.getTime();
        });
    return futureEvents[0] || null;
}

interface FlipDigitProps {
    value: number;
    label: string;
}

function FlipDigit({ value, label }: FlipDigitProps) {
    const flipRef = useRef<HTMLDivElement>(null);
    const prevValue = useRef(value);
    const [displayValue, setDisplayValue] = useState(value);
    const [nextValue, setNextValue] = useState(value);

    useEffect(() => {
        if (prevValue.current !== value) {
            setNextValue(value);
            const tl = gsap.timeline({
                onComplete: () => {
                    setDisplayValue(value);
                    if (flipRef.current) gsap.set(flipRef.current, { rotateX: 0 });
                }
            });
            if (flipRef.current) {
                tl.to(flipRef.current, { rotateX: -180, duration: 0.6, ease: "power2.inOut" });
            }
        }
        prevValue.current = value;
    }, [value]);

    const formattedDisplay = displayValue.toString().padStart(2, '0');
    const formattedNext = nextValue.toString().padStart(2, '0');

    return (
        <div className="flex flex-col items-center gap-2 group">
            <div className="relative" style={{ perspective: "1000px" }}>
                <div className="relative w-16 h-20 md:w-24 md:h-32 rounded-xl overflow-hidden glass-card shadow-2xl border border-white/5">
                    {/* Top Static */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-[hsl(20,20%,12%)] flex items-end justify-center overflow-hidden">
                        <span className="text-3xl md:text-5xl font-black text-white translate-y-1/2">{formattedNext}</span>
                    </div>
                    {/* Bottom Static */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[hsl(20,20%,10%)] flex items-start justify-center overflow-hidden">
                        <span className="text-3xl md:text-5xl font-black text-white -translate-y-1/2">{formattedDisplay}</span>
                    </div>
                    {/* Flipper */}
                    <div ref={flipRef} className="absolute inset-x-0 top-0 h-1/2 origin-bottom z-10" style={{ transformStyle: "preserve-3d" }}>
                        <div className="absolute inset-0 bg-[hsl(20,20%,12%)] flex items-end justify-center overflow-hidden rounded-t-xl" style={{ backfaceVisibility: "hidden" }}>
                            <span className="text-3xl md:text-5xl font-black text-white translate-y-1/2">{formattedDisplay}</span>
                        </div>
                        <div className="absolute inset-0 bg-[hsl(20,20%,10%)] flex items-start justify-center overflow-hidden rounded-b-xl" style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}>
                            <span className="text-3xl md:text-5xl font-black text-white -translate-y-1/2">{formattedNext}</span>
                        </div>
                    </div>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-black/40 z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
                </div>
            </div>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-gold transition-colors">{label}</span>
        </div>
    );
}

export default function EventHub() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [currentMonth, setCurrentMonth] = useState(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
    const nextEvent = useMemo(() => getNextAFLEWOEvent(), []);

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!nextEvent) return;
            const eventDate = parseEventDate(nextEvent.date);
            if (!eventDate) return;
            const now = new Date();
            const diff = eventDate.getTime() - now.getTime();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                secs: Math.floor((diff % (1000 * 60)) / 1000)
            });
        };
        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [nextEvent]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hub-panel", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
                y: 60,
                opacity: 0,
                stagger: 0.2,
                duration: 1.2,
                ease: "power4.out"
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const getDaysInMonth = useCallback((date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(), []);
    const getFirstDayOfMonth = useCallback((date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay(), []);
    const getEventsForDate = useCallback((date: Date) => events.filter(e => {
        const d = parseEventDate(e.date);
        return d && d.toDateString() === date.toDateString();
    }), []);

    const filteredEvents = useMemo(() => {
        let filtered = events;
        if (activeFilters.length > 0) filtered = filtered.filter(e => activeFilters.includes(e.chapter));
        if (selectedDate) filtered = filtered.filter(e => {
            const d = parseEventDate(e.date);
            return d && d.toDateString() === selectedDate.toDateString();
        });
        return filtered;
    }, [activeFilters, selectedDate]);

    const toggleFilter = (chapter: string) => {
        setActiveFilters(prev => prev.includes(chapter) ? prev.filter(c => c !== chapter) : [...prev, chapter]);
    };

    const navigateMonth = (direction: number) => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));

    const downloadAllICS = () => {
        const content = `BEGIN:VCALENDAR\nVERSION:2.0\nX-WR-CALNAME:AFLEWO 2026\n${events.map(e => `BEGIN:VEVENT\nSUMMARY:${e.title}\nDTSTART:${e.start}\nDTEND:${e.end}\nLOCATION:${e.location}\nEND:VEVENT`).join('\n')}\nEND:VCALENDAR`;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([content], { type: 'text/calendar' }));
        link.download = 'AFLEWO_2026.ics';
        link.click();
    };

    return (
        <section ref={sectionRef} id="events" className="section-padding bg-background relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-container relative z-10">
                <div className="hub-panel mb-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.2em]">
                                <SvgIcon name="calendar" size={12} /> Events & Calendar
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                                THE <span className="text-gold">CALENDAR</span>
                            </h2>
                        </div>
                        <button
                            onClick={downloadAllICS}
                            className="press-scale px-8 py-4 bg-gold text-brown rounded-lg font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-3"
                        >
                            <SvgIcon name="download" size={16} /> Download 2026 Calendar (.ics)
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 hub-panel space-y-6">
                        <div className="glass-card-elevated p-6 md:p-8 rounded-lg border-white/5">
                            <div className="flex items-center justify-between mb-6">
                        <button onClick={() => navigateMonth(-1)} className="p-3 rounded-lg glass-card hover:bg-white/10 flex items-center justify-center"><SvgIcon name="arrow_left" size={18} /></button>
                                <h3 className="text-xl font-black tracking-tight">{months[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
                                <button onClick={() => navigateMonth(1)} className="p-3 rounded-lg glass-card hover:bg-white/10 flex items-center justify-center"><SvgIcon name="arrow_right" size={18} /></button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {weekDays.map(day => <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-white/30 py-2">{day}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => <div key={`empty-${i}`} className="h-10 md:h-14" />)}
                                {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
                                    const hasEvents = getEventsForDate(date).length > 0;
                                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                                    return (
                                        <button key={i} onClick={() => setSelectedDate(isSelected ? null : date)} className={`relative h-10 md:h-14 rounded-lg text-sm font-bold transition-all ${isSelected ? "bg-gold text-brown" : hasEvents ? "bg-white/5 hover:bg-white/10" : "text-white/40 hover:bg-white/5"}`}>
                                            {i + 1}
                                            {hasEvents && !isSelected && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full" />}
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedDate && <button onClick={() => setSelectedDate(null)} className="mt-4 w-full py-3 glass-card rounded-lg text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white flex items-center justify-center gap-2"><SvgIcon name="close" size={14} /> Clear Selection</button>}
                        </div>

                        <div className="glass-card p-6 rounded-lg border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-black uppercase tracking-widest">Filter by Chapter</h4>
                                <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-lg transition-colors ${showFilters ? "bg-gold text-brown" : "glass-card"}`}><SvgIcon name="filter" size={16} /></button>
                            </div>
                            {showFilters && (
                                <div className="flex flex-wrap gap-2">
                                    {chapters.map((c: string) => <button key={c} onClick={() => toggleFilter(c)} className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeFilters.includes(c) ? "bg-gold/20 text-gold border border-gold/30" : "glass-card text-white/50"}`}>{activeFilters.includes(c) && <SvgIcon name="check" size={12} />}{c}</button>)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-7 hub-panel space-y-6">
                        <div className="glass-card-elevated p-6 md:p-8 rounded-lg border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black tracking-tight">{selectedDate ? `Events on ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : "Upcoming Events"}</h3>
                                <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black">{filteredEvents.length} Events</span>
                            </div>
                            <div className="space-y-3 max-h-[500px] overflow-y-auto hide-scrollbar">
                                {filteredEvents.map(e => (
                                    <div key={e.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 glass-card rounded-lg border-white/5 hover:border-gold/30 transition-all">
                                        <div className="flex items-start md:items-center gap-4">
                                            <div className="w-14 h-14 rounded-lg bg-gold/10 flex flex-col items-center justify-center text-gold border border-gold/20">
                                                <span className="text-lg font-black">{e.date === "Every Night" ? "∞" : e.date.split(' ')[1]}</span>
                                                <span className="text-[8px] font-black uppercase">{e.date === "Every Night" ? "DAILY" : e.date.split(' ')[0]}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-gold transition-colors">{e.title}</h4>
                                                <div className="flex items-center gap-3 text-[10px] font-black uppercase text-white/40 mt-1">
                                                    <span className="flex items-center gap-1"><SvgIcon name="schedule" size={12} /> {e.time}</span>
                                                    <span className="bg-gold/10 text-gold px-2 py-0.5 rounded-full">{e.chapter}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 md:mt-0">
                                            <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"><SvgIcon name="calendar" size={16} /></button>
                                            <Link href={`https://maps.google.com/?q=${encodeURIComponent(e.location)}`} target="_blank" className="p-2 bg-gold text-brown rounded-lg hover:brightness-110"><SvgIcon name="location" size={16} /></Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card-elevated p-8 md:p-10 rounded-lg border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6"><SvgIcon name="star" className="text-gold animate-pulse" size={20} /></div>
                            <div className="space-y-8 relative z-10">
                                <div className="text-center space-y-3">
                                    <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">Next Event Countdown</span>
                                    <h2 className="text-3xl font-black tracking-tighter">{nextEvent?.title || "THE NEXT EVENT"}</h2>
                                    <p className="text-white/40 text-xs">{nextEvent ? `${nextEvent.chapter} • ${nextEvent.date}` : ""}</p>
                                </div>
                                <div className="flex justify-center gap-2 md:gap-4">
                                    <FlipDigit value={timeLeft.days} label="Days" />
                                    <FlipDigit value={timeLeft.hours} label="Hours" />
                                    <FlipDigit value={timeLeft.mins} label="Mins" />
                                    <FlipDigit value={timeLeft.secs} label="Secs" />
                                </div>
                                <button
                                    onClick={() => { window.location.href = nextEvent?.url || '/join'; }}
                                    className="press-scale w-full py-4 rounded-lg bg-white text-brown font-black uppercase tracking-tighter hover:bg-gold transition-all shadow-lg"
                                >Register Now</button>
                            </div>
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
