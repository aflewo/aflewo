"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import SvgIcon from "@/components/ui/SvgIcon";
import GlassSurface from "@/components/GlassSurface";
import { motion, AnimatePresence } from "framer-motion";
import { getIslandDisplayItems } from "@/lib/events";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { usePointerCapability } from "@/hooks/usePointerCapability";
import { useAccessibilityPrefs } from "@/hooks/useAccessibilityPrefs";
import { ISLAND_CONFIG } from "@/lib/islandConfig";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────
const dynamicItems = getIslandDisplayItems();

// ─── Slide animation variants for the inner carousel ─────────────────────────
const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

// ─── HeroSection ─────────────────────────────────────────────────────────────
export default function HeroSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const islandRef = useRef<HTMLDivElement>(null);

    // ─── GSAP entrance animations ─────────────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".hero-title",
                { opacity: 0, y: 100, rotateX: 45 },
                { opacity: 1, y: 0, rotateX: 0, duration: 1.5, ease: "power4.out", delay: 0.5 }
            );
            gsap.fromTo(
                ".hero-sub",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1.2 }
            );
            gsap.fromTo(
                ".hero-btn",
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", delay: 1.5, stagger: 0.2 }
            );
            if (videoRef.current) {
                gsap.to(videoRef.current, {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    },
                    scale: 1.2,
                    opacity: 0.6,
                });
            }
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    // ─── Capability detection hooks ───────────────────────────────────────────
    const tier = useDeviceTier();
    const { hasHover } = usePointerCapability();
    const { prefersReducedMotion, supportsGlass } = useAccessibilityPrefs();
    const config = ISLAND_CONFIG[tier];

    // Combine: if the browser can't do glass OR user asked for reduced motion → plain surface
    const useSimpleSurface = !supportsGlass || prefersReducedMotion;

    // Chevrons: hidden-until-hover only when the device has a real mouse cursor
    const showChevrons = !config.chevronRequiresHover || hasHover;

    // ─── Carousel state ───────────────────────────────────────────────────────
    const [eventIndex, setEventIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const dragStartXRef = useRef(0);
    const dragCurrentXRef = useRef(0);

    const currentItem = dynamicItems[eventIndex];
    const hasMap = typeof currentItem.lat === "number" && typeof currentItem.lng === "number";

    const nextEvent = useCallback(() => {
        if (isExpanded) return;
        setDirection(1);
        setEventIndex((prev) => (prev + 1) % dynamicItems.length);
    }, [isExpanded]);

    const prevEvent = useCallback(() => {
        if (isExpanded) return;
        setDirection(-1);
        setEventIndex((prev) => (prev - 1 + dynamicItems.length) % dynamicItems.length);
    }, [isExpanded]);

    const expand = useCallback(() => setIsExpanded(true), []);
    const collapse = useCallback(() => setIsExpanded(false), []);

    // ─── Drag / swipe handlers ────────────────────────────────────────────────
    const onDragStart = useCallback((clientX: number) => {
        if (isExpanded) return;
        dragStartXRef.current = clientX;
        dragCurrentXRef.current = clientX;
        setIsDragging(true);
    }, [isExpanded]);

    const onDragMove = useCallback((clientX: number) => {
        if (!isDragging) return;
        dragCurrentXRef.current = clientX;
    }, [isDragging]);

    const onDragEnd = useCallback(() => {
        if (!isDragging) return;
        const delta = dragCurrentXRef.current - dragStartXRef.current;
        if (delta > 50) prevEvent();
        else if (delta < -50) nextEvent();
        setIsDragging(false);
    }, [isDragging, nextEvent, prevEvent]);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        onDragStart(e.clientX);
    }, [onDragStart]);
    const handlePointerMove = useCallback((e: React.PointerEvent) => onDragMove(e.clientX), [onDragMove]);
    const handlePointerUp = useCallback(() => onDragEnd(), [onDragEnd]);

    // ─── Keyboard close ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!isExpanded) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") collapse(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isExpanded, collapse]);

    // ─── Click-outside close (inline only) ───────────────────────────────────
    useEffect(() => {
        if (!isExpanded) return;
        const onPointerDown = (e: PointerEvent) => {
            if (isDragging) return;
            if (islandRef.current && !islandRef.current.contains(e.target as Node)) collapse();
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [isExpanded, isDragging, collapse]);

    // ─── Surface renderer (glass or plain fallback) ───────────────────────────
    const renderSurface = (radius: number) => {
        if (useSimpleSurface) {
            return (
                <div
                    className="absolute inset-0 border border-white/10"
                    style={{ borderRadius: radius, background: "hsl(20 14% 6% / 0.92)" }}
                />
            );
        }
        return (
            <GlassSurface
                width="100%"
                height="100%"
                borderRadius={radius}
                borderWidth={0.07}
                brightness={50}
                opacity={0.93}
                blur={config.blur}
                backgroundOpacity={0.1}
                saturation={1}
                displace={0.5}
                distortionScale={-180}
                redOffset={0}
                greenOffset={10}
                blueOffset={20}
                className="absolute inset-0"
                style={{ position: "absolute", inset: 0, borderRadius: radius, zIndex: 0 }}
            />
        );
    };

    // ─── Expanded card content (shared between inline and mobile) ─────────────
    const expandedCardContent = (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { delay: prefersReducedMotion ? 0 : 0.18, duration: 0.22 },
            }}
            className="relative z-10 p-5 text-left space-y-3"
        >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="relative flex h-2 w-2 flex-shrink-0 mt-0.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentItem.isLive ? "bg-red-500" : "bg-gold"}`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${currentItem.isLive ? "bg-red-500" : "bg-gold"}`} />
                    </span>
                    <p className="text-white font-black text-sm tracking-tight leading-snug truncate">{currentItem.title}</p>
                </div>
                <button
                    onClick={collapse}
                    aria-label="Close"
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                    <SvgIcon name="close" size={14} />
                </button>
            </div>

            {/* Venue + time */}
            {currentItem.venueName && (
                <p className="text-white/55 text-xs leading-tight">{currentItem.venueName}</p>
            )}
            {currentItem.startTime && (
                <p className="text-white/40 text-[11px] uppercase tracking-widest font-bold">{currentItem.startTime}</p>
            )}

            {/* Embedded map — only rendered if we have coordinates */}
            {hasMap && (
                <iframe
                    src={`https://www.google.com/maps?q=${currentItem.lat},${currentItem.lng}&z=15&output=embed`}
                    className="w-full rounded-xl border border-white/10"
                    style={{ height: config.mapHeight }}
                    loading="lazy"
                    title={`Map — ${currentItem.title}`}
                />
            )}

            {/* Description */}
            {currentItem.description && (
                <p className="text-white/60 text-xs leading-relaxed">{currentItem.description}</p>
            )}

            {/* Open link */}
            <Link
                href={currentItem.url}
                target={currentItem.isExternal ? "_blank" : undefined}
                rel={currentItem.isExternal ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 text-gold text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors duration-200"
            >
                Open <SvgIcon name="arrow_right" size={11} />
            </Link>
        </motion.div>
    );

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div ref={sectionRef}>
            <section
                id="hero"
                className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background"
            >
                {/* Immersive Video Layer */}
                <div className="absolute inset-0 z-0">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-80 media-mask"
                    >
                        <source src="/hero-bg.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
                </div>

                {/* Content Layer */}
                <div ref={contentRef} className="relative z-10 text-center px-8 max-w-6xl mt-20 w-full">

                    {/* ── Dynamic Island ── */}
                    {/* Wrapper holds exact collapsed height (44px) in the document flow to prevent layout shifting. */}
                    <div className="mb-8 relative z-50 w-full h-[44px]">
                        
                        {/* Fullscreen Dimmer Backdrop */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={collapse}
                                    className="fixed inset-0 bg-background/80 z-[-1] backdrop-blur-sm"
                                />
                            )}
                        </AnimatePresence>

                        {/* Absolute Overlay Layer — anchors from the top, expands downwards */}
                        <div className="absolute top-0 inset-x-0 flex justify-center items-start gap-3">

                            {/* Left chevron — hidden when expanded or when hover-gated on desktop */}
                            {showChevrons && !isExpanded && dynamicItems.length > 1 && (
                                <button
                                    onClick={prevEvent}
                                    aria-label="Previous announcement"
                                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200 mt-2"
                                >
                                    <SvgIcon name="arrow_left" size={14} />
                                </button>
                            )}

                            {/* ── The morphing island pill ── */}
                            <motion.div
                                ref={islandRef}
                                layout={!prefersReducedMotion}
                                transition={{ type: "spring", stiffness: 340, damping: 32 }}
                                className="relative overflow-hidden shadow-2xl"
                                style={{
                                    borderRadius: isExpanded ? 24 : 50,
                                    maxWidth: isExpanded ? config.expandedMaxWidth : config.collapsedMaxWidth,
                                    width: "100%",
                                }}
                            >
                                {/* Framer layout also animates border-radius — wrap in motion.div to apply */}
                                <motion.div
                                    layout={!prefersReducedMotion}
                                    style={{ borderRadius: "inherit" }}
                                    className="relative overflow-hidden"
                                    transition={{ type: "spring", stiffness: 340, damping: 32 }}
                                >
                                    {renderSurface(isExpanded ? 24 : 50)}

                                    <AnimatePresence mode="wait" initial={false}>

                                        {/* ── COLLAPSED state: sliding carousel pill ── */}
                                        {!isExpanded && (
                                            <motion.div
                                                key="collapsed"
                                                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                                                className="relative z-10 overflow-hidden h-[44px] flex items-center"
                                                style={{ touchAction: "pan-y" }}
                                                onPointerDown={handlePointerDown}
                                                onPointerMove={handlePointerMove}
                                                onPointerUp={handlePointerUp}
                                                onPointerCancel={handlePointerUp}
                                            >
                                                <AnimatePresence mode="wait" initial={false} custom={direction}>
                                                    <motion.div
                                                        key={currentItem.id}
                                                        custom={direction}
                                                        variants={slideVariants}
                                                        initial="enter"
                                                        animate="center"
                                                        exit="exit"
                                                        transition={{ type: "spring", stiffness: 380, damping: 35 }}
                                                        className="w-full h-full"
                                                    >
                                                        {/* Tap = expand. No navigation on pill tap. */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (Math.abs(dragCurrentXRef.current - dragStartXRef.current) > 10) return;
                                                                expand();
                                                            }}
                                                            draggable={false}
                                                            className="inline-flex h-full items-center gap-3 px-5 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-gold transition-colors animate-breathe w-full justify-center"
                                                        >
                                                            <span className="relative flex h-2 w-2 flex-shrink-0">
                                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentItem.isLive ? "bg-red-500" : "bg-gold"}`} />
                                                                <span className={`relative inline-flex rounded-full h-2 w-2 ${currentItem.isLive ? "bg-red-500" : "bg-gold"}`} />
                                                            </span>
                                                            <span className="truncate">{currentItem.title}</span>
                                                        </button>
                                                    </motion.div>
                                                </AnimatePresence>
                                            </motion.div>
                                        )}

                                        {/* ── EXPANDED state: full event card ── */}
                                        {isExpanded && (
                                            <motion.div
                                                key="expanded"
                                                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                                            >
                                                {expandedCardContent}
                                            </motion.div>
                                        )}

                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>

                            {/* Right chevron */}
                            {showChevrons && !isExpanded && dynamicItems.length > 1 && (
                                <button
                                    onClick={nextEvent}
                                    aria-label="Next announcement"
                                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200 mt-2"
                                >
                                    <SvgIcon name="arrow_right" size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── Main Headline ── */}
                    <h1
                        className="hero-title font-black tracking-tighter text-white leading-[0.85] perspective-1000 mb-8"
                        style={{
                            fontSize: "clamp(4rem, 12vw, 9rem)",
                            padding: "0.08em 0.12em",
                            overflow: "visible",
                            lineHeight: "0.88",
                        }}
                    >
                        AFRICA <br />
                        <span
                            className="text-gradient-gold"
                            style={{ display: "inline-block", padding: "0.06em 0.1em", overflow: "visible" }}
                        >
                            LET{"'"}S WORSHIP
                        </span>
                    </h1>

                    <p className="hero-sub text-xl md:text-2xl text-white/70 font-medium max-w-2xl mx-auto mb-12 leading-relaxed font-serif-spiritual">
                        One God. One People. One Africa. <br />
                        Stirring up hope in Jesus through a united voice since 2004.
                    </p>

                    {/* Mobile CTA buttons */}
                    <div className="flex flex-col md:hidden gap-6 justify-center items-center">
                        <Link href="/media" className="hero-btn press-scale bg-white text-brown px-12 py-5 rounded-full font-black uppercase tracking-tighter flex items-center gap-3 group hover:bg-gold transition-all">
                            <SvgIcon name="play" size={20} className="group-hover:scale-110 transition-transform" />
                            Watch Archive
                        </Link>
                        <Link href="#about" className="hero-btn press-scale glass-card-elevated px-12 py-5 rounded-full font-black uppercase tracking-tighter text-white hover:bg-white/10 transition-all border-white/20">
                            Our Vision
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-0 sm:bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 z-0 pointer-events-none">
                    <span className="text-[10px] font-black tracking-widest uppercase">Scroll</span>
                    <div className="w-[2px] h-4 bg-gradient-to-b from-white to-transparent" />
                </div>
            </section>

            {/* Desktop CTA buttons below hero */}
            <div className="hidden md:flex w-full bg-background pt-12 pb-20 justify-center items-center gap-6 relative z-10">
                <Link href="/media" className="hero-btn press-scale bg-white text-brown px-12 py-5 rounded-full font-black uppercase tracking-tighter flex items-center gap-3 group hover:bg-gold transition-all">
                    <SvgIcon name="play" size={20} className="group-hover:scale-110 transition-transform" />
                    Watch This
                </Link>
                <Link href="#about" className="hero-btn press-scale glass-card-elevated px-12 py-5 rounded-full font-black uppercase tracking-tighter text-white hover:bg-white/10 transition-all border-white/20">
                    Our Vision
                </Link>
            </div>
        </div>
    );
}
