"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import AppIcon from "@/components/ui/AppIcon";

gsap.registerPlugin(ScrollTrigger);

interface Event {
    id: string;
    title: string;
    date: string;
    start: string;
    end: string;
    time: string;
    type: string;
    chapter: string;
    location: string;
    description?: string;
}

const events: Event[] = [
    {
        id: "1",
        title: "Eldoret Auditions",
        date: "Feb 15, 2026",
        start: "20260215T090000",
        end: "20260215T170000",
        time: "09:00 AM",
        type: "Audition",
        chapter: "Eldoret",
        location: "Eldoret Regional Hub",
        description: "Auditions for Choir, Band, Media, Ushering, Security, and Dancing categories."
    },
    {
        id: "2",
        title: "Nakuru Rehearsals",
        date: "Mar 02, 2026",
        start: "20260302T170000",
        end: "20260302T200000",
        time: "05:00 PM",
        type: "Rehearsal",
        chapter: "Nakuru",
        location: "Deliverance Church, Nakuru",
        description: "2026 season rehearsals for registered choir members."
    },
    {
        id: "3",
        title: "Mombasa Prayer Circle",
        date: "Every Night",
        start: "20260123T210000",
        end: "20260123T220000",
        time: "09:00 PM",
        type: "Zoom",
        chapter: "Mombasa",
        location: "Zoom Virtual Altar",
        description: "Nightly prayer circle gathering via Zoom."
    },
    {
        id: "4",
        title: "Nairobi Pre-Launch",
        date: "Apr 10, 2026",
        start: "20260410T180000",
        end: "20260410T220000",
        time: "06:00 PM",
        type: "Event",
        chapter: "Nairobi",
        location: "Winners' Chapel International",
        description: "Pre-launch event for the 2026 main gathering."
    },
    {
        id: "5",
        title: "Tanzania Worship Night",
        date: "Mar 21, 2026",
        start: "20260321T190000",
        end: "20260321T230000",
        time: "07:00 PM",
        type: "Event",
        chapter: "Tanzania",
        location: "CCC Upanga Church, Dar es Salaam",
        description: "An evening of worship and praise."
    },
    {
        id: "6",
        title: "Rwanda Commemoration",
        date: "Apr 07, 2026",
        start: "20260407T100000",
        end: "20260407T160000",
        time: "10:00 AM",
        type: "Event",
        chapter: "Rwanda",
        location: "Christian Life Assembly, Kigali",
        description: "Annual commemoration service for healing and reconciliation."
    },
    {
        id: "7",
        title: "Nyeri Regional Gathering",
        date: "May 15, 2026",
        start: "20260515T140000",
        end: "20260515T200000",
        time: "02:00 PM",
        type: "Event",
        chapter: "Nyeri",
        location: "PCEA Nyamachaki",
        description: "Mt. Kenya regional worship gathering."
    },
    {
        id: "8",
        title: "Main Nairobi Event",
        date: "Oct 03, 2026",
        start: "20261003T180000",
        end: "20261004T060000",
        time: "06:00 PM",
        type: "Main Event",
        chapter: "Nairobi",
        location: "Winners' Chapel International",
        description: "The flagship all-night worship experience."
    }
];

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

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseEventDate(dateStr: string): Date | null {
    if (dateStr === "Every Night") return null;
    const parts = dateStr.replace(",", "").split(" ");
    const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(parts[0]);
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    if (monthIndex === -1 || isNaN(day) || isNaN(year)) return null;
    return new Date(year, monthIndex, day);
}

function getNextAFLEWOEvent(): Event | null {
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
    const digitRef = useRef<HTMLDivElement>(null);
    const prevValue = useRef(value);

    useEffect(() => {
        if (prevValue.current !== value && digitRef.current) {
            gsap.fromTo(digitRef.current,
                { rotateX: -60, opacity: 0.5 },
                { rotateX: 0, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.75)" }
            );
        }
        prevValue.current = value;
    }, [value]);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative group">
                <div className="absolute inset-0 bg-gold/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div
                    ref={digitRef}
                    className="countdown-digit relative w-20 h-24 md:w-28 md:h-32 flex items-center justify-center rounded-[1rem] bg-gradient-to-b from-white/10 to-transparent border border-white/5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-md"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 opacity-20" />
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 border-b border-white/5" />

                    <span className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                        {value.toString().padStart(2, '0')}
                    </span>

                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black/40 shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
                </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gold/40">{label}</span>
        </div>
    );
}

export default function EventHub() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
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

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, mins, secs });
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

    const getDaysInMonth = useCallback((date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }, []);

    const getFirstDayOfMonth = useCallback((date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    }, []);

    const getEventsForDate = useCallback((date: Date) => {
        return events.filter(event => {
            const eventDate = parseEventDate(event.date);
            if (!eventDate) return false;
            return eventDate.toDateString() === date.toDateString();
        });
    }, []);

    const filteredEvents = useMemo(() => {
        let filtered = events;
        if (activeFilters.length > 0) {
            filtered = filtered.filter(e => activeFilters.includes(e.chapter));
        }
        if (selectedDate) {
            filtered = filtered.filter(e => {
                const eventDate = parseEventDate(e.date);
                return eventDate && eventDate.toDateString() === selectedDate.toDateString();
            });
        }
        return filtered;
    }, [activeFilters, selectedDate]);

    const toggleFilter = (chapter: string) => {
        setActiveFilters(prev =>
            prev.includes(chapter)
                ? prev.filter(c => c !== chapter)
                : [...prev, chapter]
        );
    };

    const navigateMonth = (direction: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
    };

    const addToGoogleCalendar = (event: Event) => {
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent((event.description || "") + " | AFLEWO " + event.chapter)}&location=${encodeURIComponent(event.location)}`;
        window.open(url, '_blank');
    };

    const downloadICS = (event: Event) => {
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AFLEWO//Events//EN
BEGIN:VEVENT
UID:${event.id}@aflewo.org
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.description || event.type + " for AFLEWO " + event.chapter}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadAllICS = () => {
        const icsEvents = events.filter(e => e.date !== "Every Night").map(event =>
            `BEGIN:VEVENT
UID:${event.id}@aflewo.org
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.description || event.type + " for AFLEWO " + event.chapter}
LOCATION:${event.location}
END:VEVENT`
        ).join('\n');

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AFLEWO//Events//EN
X-WR-CALNAME:AFLEWO Events 2026
${icsEvents}
END:VCALENDAR`;
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'AFLEWO_Events_2026.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderCalendarGrid = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 md:h-14" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const dayEvents = getEventsForDate(date);
            const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
            const hasEvents = dayEvents.length > 0;

            days.push(
                <button
                    key={day}
                    onClick={() => setSelectedDate(isSelected ? null : date)}
                    className={`relative h-10 md:h-14 w-full flex items-center justify-center text-sm font-black transition-all group overflow-hidden ${isSelected ? "text-brown" : hasEvents ? "text-white" : "text-white/30"
                        }`}
                >
                    {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute w-full h-full bg-gold rounded-full scale-90 md:scale-75 animate-scale-in" />
                            <div className="spirit-wave absolute w-full h-full opacity-40 bg-[radial-gradient(circle,white_0%,transparent_70%)] blur-md animate-pulse" />
                        </div>
                    )}

                    {!isSelected && hasEvents && (
                        <div className="absolute bottom-1.5 w-1 h-1 bg-gold rounded-full" />
                    )}

                    <span className="relative z-10">{day}</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                </button>
            );
        }

        return days;
    };

    const chapters = Object.keys(chapterColors);

    return (
        <section ref={sectionRef} className="section-padding bg-background relative overflow-hidden" id="events">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-container relative z-10">
                <div className="hub-panel mb-16">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mb-12 text-center md:text-left">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.2em] mx-auto md:mx-0">
                                <AppIcon name="calendar-month" size={12} /> Events & Calendar
                            </div>
                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                                THE <span className="text-gold">CALENDAR</span>
                            </h2>
                        </div>
                        <button
                            onClick={downloadAllICS}
                            className="press-scale px-10 py-5 bg-gold text-brown rounded-lg font-black text-[11px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-4 shadow-glow"
                        >
                            <AppIcon name="download" size={18} /> Sync 2026 Roadmap
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 hub-panel space-y-6">
                        <div className="glass-card-elevated p-6 md:p-8 rounded-lg border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => navigateMonth(-1)}
                                    className="p-3 rounded-lg glass-card hover:bg-white/10 transition-colors"
                                >
                                    <AppIcon name="chevron-left" size={20} />
                                </button>
                                <h3 className="text-xl font-black tracking-tight">
                                    {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </h3>
                                <button
                                    onClick={() => navigateMonth(1)}
                                    className="p-3 rounded-lg glass-card hover:bg-white/10 transition-colors"
                                >
                                    <AppIcon name="chevron-right" size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {weekDays.map(day => (
                                    <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-white/30 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {renderCalendarGrid()}
                            </div>

                            {selectedDate && (
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="mt-4 w-full py-3 glass-card rounded-lg text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <AppIcon name="close" size={14} /> Clear Selection
                                </button>
                            )}
                        </div>

                        <div className="glass-card p-6 rounded-lg border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-black uppercase tracking-widest">Filter by Chapter</h4>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`p-2 rounded-lg transition-colors ${showFilters ? "bg-gold text-brown" : "glass-card"}`}
                                >
                                    <AppIcon name="filter-list" size={16} />
                                </button>
                            </div>

                            {showFilters && (
                                <div className="flex flex-wrap gap-2">
                                    {chapters.map(chapter => {
                                        const colors = chapterColors[chapter];
                                        const isActive = activeFilters.includes(chapter);
                                        return (
                                            <button
                                                key={chapter}
                                                onClick={() => toggleFilter(chapter)}
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isActive
                                                    ? `${colors.bg} ${colors.text} ${colors.border} border`
                                                    : "glass-card text-white/50 hover:text-white"
                                                    }`}
                                            >
                                                {isActive && <AppIcon name="check" size={12} />}
                                                {chapter}
                                            </button>
                                        );
                                    })}
                                    {activeFilters.length > 0 && (
                                        <button
                                            onClick={() => setActiveFilters([])}
                                            className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-white/30">
                            <span>* All times in EAT (UTC+3)</span>
                        </div>
                    </div>

                    <div className="lg:col-span-7 hub-panel space-y-6">
                        <div className="glass-card-elevated p-6 md:p-8 rounded-lg border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black tracking-tight">
                                    {selectedDate
                                        ? `Events on ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                        : activeFilters.length > 0
                                            ? `Filtered Events (${filteredEvents.length})`
                                            : "Upcoming Events"
                                    }
                                </h3>
                                <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/50">
                                    {filteredEvents.length} Events
                                </span>
                            </div>

                            <div className="space-y-3 max-h-[500px] overflow-y-auto hide-scrollbar">
                                {filteredEvents.length === 0 ? (
                                    <div className="text-center py-12 text-white/30">
                                        <AppIcon name="event-busy" size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-sm font-bold">No events found</p>
                                        <p className="text-[10px] uppercase tracking-widest mt-2">Try adjusting your filters</p>
                                    </div>
                                ) : (
                                    filteredEvents.map((event, i) => {
                                        const colors = chapterColors[event.chapter] || chapterColors.Nairobi;
                                        return (
                                            <div
                                                key={event.id}
                                                className={`group flex flex-col md:flex-row md:items-center justify-between p-5 glass-card rounded-lg hover:border-gold/30 transition-all border ${colors.border}`}
                                                style={{ animationDelay: `${i * 50}ms` }}
                                            >
                                                <div className="flex items-start md:items-center gap-4 mb-4 md:mb-0">
                                                    <div className={`w-14 h-14 rounded-lg ${colors.bg} flex flex-col items-center justify-center ${colors.text} border ${colors.border}`}>
                                                        <span className="text-lg font-black leading-none">
                                                            {event.date === "Every Night" ? "∞" : event.date.split(' ')[1]?.replace(',', '')}
                                                        </span>
                                                        <span className="text-[8px] font-black uppercase">
                                                            {event.date === "Every Night" ? "DAILY" : event.date.split(' ')[0]}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1 flex-1">
                                                        <h4 className="text-base font-bold tracking-tight text-white group-hover:text-gold transition-colors">
                                                            {event.title}
                                                        </h4>
                                                        <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40">
                                                            <span className="flex items-center gap-1">
                                                                <AppIcon name="schedule" size={12} /> {event.time} EAT
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                                                                {event.chapter}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[10px] text-white/30">
                                                            <AppIcon name="location-on" size={10} />
                                                            <Link
                                                                href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                                                                target="_blank"
                                                                className="hover:text-gold transition-colors underline-offset-2 hover:underline"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {event.location}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => downloadICS(event)}
                                                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                                                        title="Add to Apple Calendar"
                                                    >
                                                        <AppIcon name="terminal" size={14} /> iOS
                                                    </button>
                                                    <button
                                                        onClick={() => addToGoogleCalendar(event)}
                                                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold text-brown text-[8px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
                                                        title="Add to Google Calendar"
                                                    >
                                                        <AppIcon name="calendar-add-on" size={14} /> Google
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="glass-card-elevated p-8 md:p-10 rounded-lg border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 text-gold">
                                <AppIcon name="auto-awesome" className="animate-pulse" />
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="space-y-3 text-center">
                                    <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">Prophetic Countdown</span>
                                    <h2 className="text-3xl font-black tracking-tighter">
                                        {nextEvent ? nextEvent.title : "THE NEXT ALTAR"}
                                    </h2>
                                    <p className="text-foreground/40 text-xs font-medium">
                                        {nextEvent
                                            ? `${nextEvent.chapter} • ${nextEvent.date}`
                                            : "Stay tuned for upcoming events"
                                        }
                                    </p>
                                </div>

                                <div className="flex justify-center gap-2 md:gap-4">
                                    <FlipDigit value={timeLeft.days} label="Days" />
                                    <FlipDigit value={timeLeft.hours} label="Hours" />
                                    <FlipDigit value={timeLeft.mins} label="Mins" />
                                    <FlipDigit value={timeLeft.secs} label="Secs" />
                                </div>

                                <button className="press-scale w-full py-4 rounded-lg bg-white text-brown font-black uppercase tracking-tighter hover:bg-gold transition-all shadow-lg">
                                    Register Now
                                </button>
                            </div>

                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                        </div>

                        <div className="glass-card p-6 rounded-2xl border-white/5 flex items-center justify-between group cursor-pointer hover:border-gold/30 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-gold/10 text-gold group-hover:scale-110 transition-transform">
                                    <AppIcon name="notifications" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-white">Event Alerts</h4>
                                    <p className="text-[10px] text-white/40 font-medium">Get notified for new events</p>
                                </div>
                            </div>
                            <div className="w-12 h-6 rounded-full bg-gold p-1 flex items-center justify-end">
                                <div className="w-4 h-4 rounded-full bg-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center">
                    <Link
                        href="#"
                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gold/60 hover:text-gold transition-colors"
                    >
                        View Full 2026 Roadmap <AppIcon name="open-in-new" size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
