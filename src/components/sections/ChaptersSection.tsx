"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AppIcon from "@/components/ui/AppIcon";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface Chapter {
    name: string;
    status: string;
    established: string;
    venue: string;
    capacity?: string;
    highlight: string;
    size: "hero" | "featured" | "standard";
    link: string;
    color: string;
    hasQr?: boolean;
    hasPrayerCircle?: boolean;
    country: string;
    description: string;
    upcomingEvent?: string;
    registrationOpen?: boolean;
    venueImage?: string;
    contactPhone?: string;
    contactEmail?: string;
    socialLinks?: { platform: string; url: string }[];
}

const chapters: Chapter[] = [
    {
        name: "Nairobi",
        status: "Mother Chapter",
        established: "2004",
        venue: "Winners' Chapel International, Likoni Road",
        capacity: "15,000+",
        highlight: "Latest: Grace for Wholeness (Oct 2025)",
        size: "hero",
        link: "https://aflewo.org",
        color: "from-gold/20 to-gold/5",
        country: "Kenya",
        description: "The inaugural chapter coordinating the movement's prophetic 22nd year. The flagship location where AFLEWO began its journey of continental worship.",
        upcomingEvent: "April 10, 2026 - Pre-Launch",
        venueImage: "/archival-1.jpg",
        registrationOpen: true,
        contactPhone: "+254 700 000 000",
        contactEmail: "nairobi@aflewo.org",
        socialLinks: [
            { platform: "Facebook", url: "https://facebook.com/aflewoke" },
            { platform: "Instagram", url: "https://instagram.com/aflewoke" }
        ]
    },
    {
        name: "Tanzania",
        status: "Dar es Salaam",
        established: "2010",
        venue: "CCC Upanga Church",
        highlight: "4,000+ Participants",
        size: "featured",
        link: "https://facebook.com/aflewotanzania",
        color: "from-emerald/20 to-emerald/5",
        country: "Tanzania",
        description: "The movement's first international chapter, a major hub for AFLEWO's expansion in East Africa drawing over 4,000 people per event.",
        upcomingEvent: "TBA 2026",
        venueImage: "/archival-2.jpg"
    },
    {
        name: "Rwanda",
        status: "Kigali Chapter",
        established: "2011",
        venue: "Christian Life Assembly, Nyarutarama",
        highlight: "NYE 2026 Ushered",
        size: "featured",
        link: "https://facebook.com/afleworwanda",
        color: "from-blue-500/20 to-blue-500/5",
        country: "Rwanda",
        description: "Held a massive event in March 2014 for the 20th genocide commemoration with the theme 'Healing and Reconciliation'.",
        upcomingEvent: "March 2026 - Commemoration Service"
    },
    {
        name: "Nakuru",
        status: "Registration Open",
        established: "2013",
        venue: "Deliverance Church, Nakuru",
        highlight: "2026 Season Registration Active",
        size: "standard",
        link: "https://facebook.com/aflewonakuru",
        color: "from-orange-500/20 to-orange-500/5",
        hasQr: true,
        country: "Kenya",
        description: "Birthed during the 1,000-voice national choir event. Registration is currently open for the 2026 season.",
        upcomingEvent: "Mar 02, 2026 - Rehearsals",
        registrationOpen: true
    },
    {
        name: "Eldoret",
        status: "Auditions Active",
        established: "2025",
        venue: "Regional Hub",
        highlight: "Choir, Band, Media & Dance",
        size: "standard",
        link: "https://facebook.com/aflewoeldoret",
        color: "from-purple-500/20 to-purple-500/5",
        hasQr: true,
        country: "Kenya",
        description: "Highly active chapter with auditions for Choir, Band, Media, Ushering, Security, and Dancing categories.",
        upcomingEvent: "Feb 15, 2026 - Auditions",
        registrationOpen: true
    },
    {
        name: "Mombasa",
        status: "Prayer Circle",
        established: "2009",
        venue: "JCC Bamburi Centre",
        highlight: "Nightly Zoom Prayer Circle",
        size: "standard",
        link: "https://facebook.com/aflewomombasa",
        color: "from-cyan-500/20 to-cyan-500/5",
        hasPrayerCircle: true,
        country: "Kenya",
        description: "Known for its 'Prayer Circle' that meets nightly via Zoom. Latest event was September 27, 2025.",
        upcomingEvent: "Every Night - Prayer Circle"
    },
    {
        name: "Nyeri",
        status: "Mt. Kenya Hub",
        established: "2010",
        venue: "PCEA Nyamachaki",
        highlight: "Pastors' Fellowship Support",
        size: "standard",
        link: "https://aflewo.org",
        color: "from-green-600/20 to-green-600/5",
        country: "Kenya",
        description: "Historically held at PCEA Nyamachaki, supported by the Nyeri Pastors' Fellowship."
    },
    {
        name: "Meru",
        status: "Active Chapter",
        established: "2012",
        venue: "KEMU Chapel",
        highlight: "Expansion Vision Active",
        size: "standard",
        link: "https://aflewo.org",
        color: "from-lime-500/20 to-lime-500/5",
        country: "Kenya",
        description: "Historically held at Gikumene High School and KEMU Chapel."
    },
    {
        name: "Machakos",
        status: "Emerging",
        established: "2026",
        venue: "Community Center",
        highlight: "Birthed from the Eastern Choir",
        size: "standard",
        link: "https://aflewo.org",
        color: "from-amber-500/20 to-amber-500/5",
        country: "Kenya",
        description: "An emerging chapter birthed from the Eastern Choir movement."
    },
    {
        name: "Kisumu",
        status: "Lake Hub",
        established: "2026",
        venue: "Jomo Kenyatta Ground",
        highlight: "Expansion Vision Active",
        size: "standard",
        link: "https://aflewo.org",
        color: "from-teal-500/20 to-teal-500/5",
        country: "Kenya",
        description: "Part of the long-term expansion vision for the movement."
    }
];

interface ChapterModalProps {
    chapter: Chapter | null;
    isOpen: boolean;
    onClose: () => void;
}

function ChapterModal({ chapter, isOpen, onClose }: ChapterModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && modalRef.current && contentRef.current) {
            gsap.fromTo(modalRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }
            );
            gsap.fromTo(contentRef.current,
                { scale: 0.9, y: 40, opacity: 0 },
                { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "expo.out", delay: 0.1 }
            );
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !chapter) return null;

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
        >
            <div
                ref={contentRef}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card-elevated rounded-[2rem] border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-3 rounded-full glass-card hover:bg-white/10 transition-colors"
                >
                    <AppIcon name="close" size={20} />
                </button>

                {chapter.venueImage && (
                    <div className="relative h-64 w-full overflow-hidden rounded-t-[2rem]">
                        <Image
                            src={chapter.venueImage}
                            alt={chapter.venue}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </div>
                )}

                <div className="p-8 md:p-12 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${chapter.color} text-white`}>
                                {chapter.status}
                            </span>
                            {chapter.hasPrayerCircle && (
                                <span className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/20 text-red-400">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
                                    </span>
                                    Live Nightly
                                </span>
                            )}
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                            AFLEWO <span className="text-gold">{chapter.name}</span>
                        </h2>
                        <p className="text-foreground/60 leading-relaxed max-w-2xl">
                            {chapter.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card p-6 rounded-2xl space-y-2">
                            <AppIcon name="calendar_month" className="text-gold" size={20} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Established</p>
                            <p className="text-2xl font-black">{chapter.established}</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl space-y-2">
                            <AppIcon name="church" className="text-gold" size={20} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Primary Venue</p>
                            <p className="text-sm font-bold">{chapter.venue}</p>
                        </div>
                        {chapter.capacity && (
                            <div className="glass-card p-6 rounded-2xl space-y-2">
                                <AppIcon name="groups" className="text-gold" size={20} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Capacity</p>
                                <p className="text-2xl font-black">{chapter.capacity}</p>
                            </div>
                        )}
                    </div>

                    {chapter.upcomingEvent && (
                        <div className="glass-card p-6 rounded-2xl border-gold/20 bg-gold/5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gold">Next Event</p>
                                    <p className="text-lg font-bold">{chapter.upcomingEvent}</p>
                                </div>
                                {chapter.registrationOpen && (
                                    <Link
                                        href={chapter.link}
                                        target="_blank"
                                        className="px-6 py-3 rounded-full bg-gold text-brown text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
                                    >
                                        Register <AppIcon name="arrow_forward" size={14} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href={chapter.link}
                            target="_blank"
                            className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-3 px-8 py-4 glass-card hover:bg-gold hover:text-brown transition-all rounded-full font-black text-[10px] uppercase tracking-widest"
                        >
                            <AppIcon name="public" size={16} /> Visit Chapter Page
                        </Link>
                        {chapter.contactPhone && (
                            <Link
                                href={`tel:${chapter.contactPhone}`}
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 glass-card hover:bg-white/10 transition-all rounded-full font-black text-[10px] uppercase tracking-widest"
                            >
                                <AppIcon name="call" size={16} /> Call
                            </Link>
                        )}
                        {chapter.contactEmail && (
                            <Link
                                href={`mailto:${chapter.contactEmail}`}
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 glass-card hover:bg-white/10 transition-all rounded-full font-black text-[10px] uppercase tracking-widest"
                            >
                                <AppIcon name="mail" size={16} /> Email
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface QrModalProps {
    chapter: Chapter | null;
    isOpen: boolean;
    onClose: () => void;
}

function QrModal({ chapter, isOpen, onClose }: QrModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && modalRef.current) {
            gsap.fromTo(modalRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.4, ease: "expo.out" }
            );
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen || !chapter) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="relative glass-card-elevated p-8 rounded-[2rem] border-white/10 text-center max-w-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full glass-card hover:bg-white/10 transition-colors"
                >
                    <AppIcon name="close" size={16} />
                </button>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tighter">
                            Register for <span className="text-gold">{chapter.name}</span>
                        </h3>
                        <p className="text-foreground/50 text-sm">Scan to register for the 2026 season</p>
                    </div>

                    <div className="relative mx-auto w-48 h-48 bg-white rounded-2xl p-4 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent rounded-2xl" />
                        <div className="relative grid grid-cols-5 gap-1">
                            {Array.from({ length: 25 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-6 h-6 rounded-sm ${Math.random() > 0.5 ? "bg-brown" : "bg-transparent"
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                                <AppIcon name="music_note" className="text-gold" size={24} />
                            </div>
                        </div>
                    </div>

                    <Link
                        href={chapter.link}
                        target="_blank"
                        className="block w-full py-4 rounded-full bg-gold text-brown font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                        Open Registration Link
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ChaptersSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [qrChapter, setQrChapter] = useState<Chapter | null>(null);
    const magneticRefs = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc }[]>([]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
        if (!magneticRefs.current[index]) return;
        const card = cardsRef.current[index];
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        magneticRefs.current[index].x(x * 0.1);
        magneticRefs.current[index].y(y * 0.1);
    }, []);

    const handleMouseLeave = useCallback((index: number) => {
        if (!magneticRefs.current[index]) return;
        magneticRefs.current[index].x(0);
        magneticRefs.current[index].y(0);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            cardsRef.current.forEach((card, index) => {
                if (card) {
                    magneticRefs.current[index] = {
                        x: gsap.quickTo(card, "x", { duration: 0.5, ease: "power3.out" }),
                        y: gsap.quickTo(card, "y", { duration: 0.5, ease: "power3.out" })
                    };
                }
            });

            gsap.from(".chapter-card", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
                y: 100,
                opacity: 0,
                stagger: 0.08,
                duration: 1.2,
                ease: "expo.out"
            });

            gsap.from(".chapter-header", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                },
                y: 60,
                opacity: 0,
                duration: 1.4,
                ease: "expo.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const getGridClasses = (size: string) => {
        switch (size) {
            case "hero":
                return "md:col-span-2 md:row-span-2";
            case "featured":
                return "md:col-span-2 md:row-span-1";
            default:
                return "md:col-span-1 md:row-span-1";
        }
    };

    return (
        <section ref={containerRef} className="section-padding bg-background relative overflow-hidden" id="chapters">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gold/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-container relative z-10">
                <div className="chapter-header flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.2em]">
                            <AppIcon name="location_on" size={12} /> The Prophetic House
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            CHAPTERS OF <br /><span className="text-gold">IDENTITY</span>
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4 text-right">
                        <p className="text-foreground/50 max-w-sm font-bold text-sm uppercase tracking-widest leading-relaxed">
                            A continental network of worship, uniting 10+ major hubs across East Africa.
                        </p>
                        <Link href="https://whatsapp.com/channel/AFLEWO" className="press-scale inline-flex items-center gap-2 text-gold font-black uppercase tracking-widest text-[10px] hover:gap-4 transition-all justify-end">
                            Join our WhatsApp Channel <AppIcon name="forum" size={14} />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
                    {chapters.map((chapter, i) => (
                        <div
                            key={i}
                            ref={(el) => { cardsRef.current[i] = el; }}
                            className={`chapter-card bento-card glass-card-elevated p-8 md:p-10 flex flex-col justify-between group cursor-pointer relative overflow-hidden min-h-[280px] rounded-lg ${getGridClasses(chapter.size)}`}
                            onMouseMove={(e) => handleMouseMove(e, i)}
                            onMouseLeave={() => handleMouseLeave(i)}
                            onClick={() => setSelectedChapter(chapter)}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${chapter.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                            <div className="absolute -right-8 -top-8 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                                <svg viewBox="0 0 200 200" className="w-full h-full fill-current">
                                    <path d="M100,10 L120,90 L200,100 L120,110 L100,190 L80,110 L0,100 L80,90 Z" />
                                </svg>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/80">
                                                {chapter.status}
                                            </span>
                                            {chapter.hasPrayerCircle && (
                                                <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full">
                                                    <AppIcon name="radio" size={8} className="animate-pulse" /> Live
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={`font-black tracking-tighter group-hover:text-gold transition-colors ${chapter.size === "hero" ? "text-5xl md:text-6xl" :
                                            chapter.size === "featured" ? "text-4xl" : "text-3xl"
                                            }`}>
                                            {chapter.name}
                                        </h3>
                                    </div>
                                    {chapter.hasQr && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setQrChapter(chapter);
                                            }}
                                            className="p-3 glass-card bg-gold/10 border-gold/30 rounded-lg text-gold hover:bg-gold hover:text-brown transition-all"
                                        >
                                            <AppIcon name="qr_code_2" size={20} />
                                        </button>
                                    )}
                                </div>
                                <p className="text-foreground/40 text-sm font-medium leading-relaxed max-w-[300px]">
                                    {chapter.highlight}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-white/5 relative z-10 space-y-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/50">
                                        <AppIcon name="calendar_month" size={14} className="text-gold" />
                                        <span>EST. {chapter.established}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/50">
                                        <AppIcon name="location_on" size={14} className="text-gold" />
                                        <span className="truncate">{chapter.venue.split(",")[0]}</span>
                                    </div>
                                    {chapter.capacity && (
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/50">
                                            <AppIcon name="groups" size={14} className="text-gold" />
                                            <span>{chapter.capacity} Souls</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <Link
                                        href={`/chapters/${chapter.name.toLowerCase()}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="press-scale flex-1 inline-flex items-center justify-between px-5 py-3 glass-card group-hover:bg-gold group-hover:text-brown transition-all duration-500 rounded-full font-black text-[9px] uppercase tracking-widest"
                                    >
                                        Explore Chapter <AppIcon name="arrow_forward" size={12} />
                                    </Link>
                                    {chapter.registrationOpen && (
                                        <span className="px-3 py-1 rounded-full bg-emerald/20 text-emerald text-[8px] font-black uppercase tracking-widest">
                                            Open
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                    ))}
                </div>

                <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-12 glass-card-elevated p-10 md:p-12 rounded-lg border-gold/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -z-10" />
                    <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="p-5 rounded-lg bg-gold/10 text-gold border border-gold/20 shadow-glow">
                            <AppIcon name="public" size={40} />
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-3xl font-black tracking-tighter text-white">Central Administration</h4>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold/60 max-w-sm">
                                Connect with AFLEWO HQ for global partnerships, support, and resource inquiries.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <Link
                            href="https://aflewo.org"
                            target="_blank"
                            className="flex-1 sm:flex-none px-10 py-5 glass-card-elevated hover:bg-white/10 rounded-lg font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border-white/10"
                        >
                            aflewo.org <AppIcon name="open_in_new" size={14} className="text-gold" />
                        </Link>
                        <Link
                            href="tel:*456*819867#"
                            className="flex-1 sm:flex-none px-10 py-5 bg-gold text-brown rounded-lg font-black text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-glow"
                        >
                            M-Pesa: 819867 <AppIcon name="call" size={14} />
                        </Link>
                    </div>
                </div>
            </div>

            <ChapterModal
                chapter={selectedChapter}
                isOpen={!!selectedChapter}
                onClose={() => setSelectedChapter(null)}
            />

            <QrModal
                chapter={qrChapter}
                isOpen={!!qrChapter}
                onClose={() => setQrChapter(null)}
            />
        </section>
    );
}
