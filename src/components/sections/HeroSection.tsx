"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import SvgIcon from "@/components/ui/SvgIcon";
import GlassSurface from "@/components/GlassSurface";
import { motion, AnimatePresence } from "framer-motion";
import { getIslandDisplayItems } from "@/lib/events";

gsap.registerPlugin(ScrollTrigger);

const dynamicItems = getIslandDisplayItems();

export default function HeroSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Entrance
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

            // Scroll Video Zoom
            if (videoRef.current) {
                gsap.to(videoRef.current, {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    },
                    scale: 1.2,
                    opacity: 0.6
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const [eventIndex, setEventIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartXRef = useRef(0);
    const dragCurrentXRef = useRef(0);
    const pillRef = useRef<HTMLDivElement>(null);

    const nextEvent = useCallback(() => {
        setDirection(1);
        setEventIndex((prev: number) => (prev + 1) % dynamicItems.length);
    }, []);
    
    const prevEvent = useCallback(() => {
        setDirection(-1);
        setEventIndex((prev: number) => (prev - 1 + dynamicItems.length) % dynamicItems.length);
    }, []);

    const currentItem = dynamicItems[eventIndex];

    // Touch/pointer drag handlers for horizontal swipe
    const onDragStart = useCallback((clientX: number) => {
        dragStartXRef.current = clientX;
        dragCurrentXRef.current = clientX;
        setIsDragging(true);
    }, []);

    const onDragMove = useCallback((clientX: number) => {
        if (!isDragging) return;
        dragCurrentXRef.current = clientX;
    }, [isDragging]);

    const onDragEnd = useCallback(() => {
        if (!isDragging) return;
        const delta = dragCurrentXRef.current - dragStartXRef.current;
        const threshold = 50;
        if (delta > threshold) {
            prevEvent();
        } else if (delta < -threshold) {
            nextEvent();
        }
        setIsDragging(false);
    }, [isDragging, nextEvent, prevEvent]);

    // Pointer events (covers both mouse and touch)
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        onDragStart(e.clientX);
    }, [onDragStart]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        onDragMove(e.clientX);
    }, [onDragMove]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        onDragEnd();
    }, [onDragEnd]);

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

                {/* Premium Typography Layer */}
                <div ref={contentRef} className="relative z-10 text-center px-8 max-w-6xl mt-20 w-full">

                    {/* ── Notification Pill (GlassSurface, horizontal swipe, chevrons outside) ── */}
                    <div className="mb-8 flex justify-center items-center gap-3">
                        {/* Left chevron — outside pill */}
                        {dynamicItems.length > 1 && (
                            <button
                                onClick={prevEvent}
                                aria-label="Previous announcement"
                                className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                            >
                                <SvgIcon name="arrow_left" size={14} />
                            </button>
                        )}

                        {/* Pill container */}
                        <div className="relative overflow-hidden rounded-full" style={{ maxWidth: '340px', width: '100%' }}>
                            <GlassSurface
                                width="100%"
                                height="100%"
                                borderRadius={50}
                                borderWidth={0.07}
                                brightness={50}
                                opacity={0.93}
                                blur={11}
                                backgroundOpacity={0.1}
                                saturation={1}
                                displace={0.5}
                                distortionScale={-180}
                                redOffset={0}
                                greenOffset={10}
                                blueOffset={20}
                                className="absolute inset-0"
                                style={{ position: 'absolute', inset: 0, borderRadius: '50px', zIndex: 0 }}
                            />

                            <div
                                ref={pillRef}
                                className="relative z-10 overflow-hidden"
                                style={{ touchAction: 'pan-y' }}
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerUp}
                            >
                                <AnimatePresence mode="wait" initial={false} custom={direction}>
                                    <motion.div
                                        key={currentItem.id}
                                        custom={direction}
                                        initial={(dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 })}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={(dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 })}
                                        transition={{ type: "spring", stiffness: 380, damping: 35 }}
                                        className="w-full"
                                    >
                                        <Link
                                            href={currentItem.url}
                                            target={currentItem.isExternal ? "_blank" : undefined}
                                            draggable={false}
                                            className="inline-flex items-center gap-3 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-gold transition-colors animate-breathe w-full justify-center"
                                            onClick={(e) => {
                                                // Don't navigate if user was dragging
                                                if (Math.abs(dragCurrentXRef.current - dragStartXRef.current) > 10) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            <span className="relative flex h-2 w-2 flex-shrink-0">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                                            </span>
                                            <span className="truncate">{currentItem.title}</span>
                                        </Link>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right chevron — outside pill */}
                        {dynamicItems.length > 1 && (
                            <button
                                onClick={nextEvent}
                                aria-label="Next announcement"
                                className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                            >
                                <SvgIcon name="arrow_right" size={14} />
                            </button>
                        )}
                    </div>

                    {/* ── Main Headline — padding to prevent clipping ── */}
                    <h1
                        className="hero-title font-black tracking-tighter text-white leading-[0.85] perspective-1000 mb-8"
                        style={{
                            fontSize: 'clamp(4rem, 12vw, 9rem)',
                            padding: '0.08em 0.12em',
                            overflow: 'visible',
                            lineHeight: '0.88',
                        }}
                    >
                        AFRICA <br />
                        <span
                            className="text-gradient-gold"
                            style={{ display: 'inline-block', padding: '0.06em 0.1em', overflow: 'visible' }}
                        >
                            LET{"'"}S WORSHIP
                        </span>
                    </h1>

                    <p className="hero-sub text-xl md:text-2xl text-white/70 font-medium max-w-2xl mx-auto mb-12 leading-relaxed font-serif-spiritual">
                        One God. One People. One Africa. <br />
                        Stirring up hope in Jesus through a united voice since 2004.
                    </p>

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

            {/* Desktop Buttons Below Hero */}
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
