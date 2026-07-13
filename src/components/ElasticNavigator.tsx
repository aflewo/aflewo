"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import SvgIcon from "@/components/ui/SvgIcon";
import { motion, animate, useMotionValue, useMotionValueEvent, useTransform, useSpring, AnimatePresence } from "framer-motion";
import './ElasticNavigator.css';

const sections = [
    { id: "hero", label: "Altar" },
    { id: "about", label: "Vision" },
    { id: "chapters", label: "Chapters" },
    { id: "events", label: "Calendar" },
    { id: "media", label: "Archive" },
    { id: "stories", label: "Echoes" },
    { id: "join", label: "Join" },
];

const MAX_OVERFLOW = 40;
const SPRING_CONFIG = { stiffness: 450, damping: 35, mass: 0.5 };
const PREDICTIVE_DAMPING = 0.8;

function decay(value: number, max: number) {
    if (max === 0) return 0;
    const entry = value / max;
    const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
    return sigmoid * max;
}

export default function ElasticNavigator() {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [region, setRegion] = useState<'top' | 'middle' | 'bottom'>('middle');
    const [activeIndex, setActiveIndex] = useState(0);
    const [isIdle, setIsIdle] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const sliderRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const idleTimeoutRef = useRef<number | null>(null);

    const resetIdleTimeout = useCallback((delay: number) => {
        setIsIdle(false);
        if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = window.setTimeout(() => setIsIdle(true), delay);
    }, []);
    const rafRef = useRef<number | null>(null);
    const lastYRef = useRef(0);
    const lastTimeRef = useRef(0);
    const velocityRef = useRef(0);

    const value = useMotionValue(0);
    const overflow = useMotionValue(0);
    const predictiveValue = useMotionValue(0);
    const thumbY = useMotionValue(0);
    const thumbLeft = useMotionValue(0);

    const springOverflow = useSpring(overflow, SPRING_CONFIG);
    const springScaleX = useTransform(springOverflow, [0, MAX_OVERFLOW], [1, 0.75]);
    const springScaleY = useTransform(springOverflow, (v) => 1 + (v / 200));

    const rangeHeight = useTransform(value, (v) => `${v}%`);
    const predictiveHeight = useTransform(predictiveValue, (v) => `${v}%`);

    // Brand Colors (White Theme)
    const PRIMARY_COLOR = "#ffffff";
    const PRIMARY_MUTED = "rgba(255, 255, 255, 0.2)";

    const getClosestSectionIndex = useCallback((percentage: number) => {
        const span = 100 / (sections.length - 1);
        return Math.max(0, Math.min(sections.length - 1, Math.round(percentage / span)));
    }, []);

    const scrollToPercentage = useCallback((percentage: number, behavior: ScrollBehavior = 'auto') => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = (percentage / 100) * scrollableHeight;

        window.scrollTo({
            top: targetScroll,
            behavior: behavior === 'auto' ? 'auto' : 'smooth'
        });
        value.set(percentage);
    }, [value]);

    const updateThumbPosition = useCallback(() => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const currentPct = value.get();
        const y = rect.top + (currentPct / 100) * rect.height;
        thumbY.set(y);
        thumbLeft.set(rect.left + rect.width / 2);
    }, [value, thumbY, thumbLeft]);

    useMotionValueEvent(value, "change", (latest) => {
        const index = getClosestSectionIndex(latest);
        if (index !== activeIndex) setActiveIndex(index);
        updateThumbPosition();
    });

    useEffect(() => {
        const handleInteraction = () => resetIdleTimeout(5000); // 5s screen inactivity
        const handleScroll = () => {
            handleInteraction();
            if (isDragging) return;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;
            const scrollPercent = (window.scrollY / docHeight) * 100;
            value.set(scrollPercent);
            // Show after just 80px scroll — visible much sooner
            setIsVisible(window.scrollY > 80);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        window.addEventListener('resize', updateThumbPosition);

        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('resize', updateThumbPosition);
            if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            try { value.stop(); overflow.stop(); predictiveValue.stop(); } catch (e) { }
        };
    }, [isDragging, value, updateThumbPosition, resetIdleTimeout]);

    const handleTrackPointer = (ev: React.PointerEvent) => {
        if (!trackRef.current) return;
        ev.preventDefault();
        const rect = trackRef.current.getBoundingClientRect();
        const clickY = Math.max(rect.top, Math.min(ev.clientY, rect.bottom));
        const perc = ((clickY - rect.top) / rect.height) * 100;

        const idx = getClosestSectionIndex(perc);
        const targetPerc = (100 / (sections.length - 1)) * idx;

        animate(value, targetPerc, {
            type: "spring",
            stiffness: 400,
            damping: 30,
            onUpdate: (v) => scrollToPercentage(v, 'auto')
        });
    };

    const onPointerDown = (ev: React.PointerEvent) => {
        if (!trackRef.current) return;
        (ev.target as Element).setPointerCapture(ev.pointerId);
        setIsDragging(true);
        lastYRef.current = ev.clientY;
        lastTimeRef.current = performance.now();
        velocityRef.current = 0;
    };

    const onPointerMove = (ev: PointerEvent) => {
        if (!isDragging || !trackRef.current) return;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            const rect = trackRef.current!.getBoundingClientRect();
            const now = performance.now();
            const dt = Math.max(1, now - lastTimeRef.current);

            const dy = ev.clientY - lastYRef.current;
            velocityRef.current = (dy / dt) * 1000;
            lastYRef.current = ev.clientY;
            lastTimeRef.current = now;

            const constrainedY = Math.max(rect.top - MAX_OVERFLOW, Math.min(ev.clientY, rect.bottom + MAX_OVERFLOW));

            if (constrainedY < rect.top) {
                setRegion('top');
                overflow.set(decay(rect.top - constrainedY, MAX_OVERFLOW));
            } else if (constrainedY > rect.bottom) {
                setRegion('bottom');
                overflow.set(decay(constrainedY - rect.bottom, MAX_OVERFLOW));
            } else {
                setRegion('middle');
                overflow.set(0);
            }

            const clampedY = Math.max(rect.top, Math.min(constrainedY, rect.bottom));
            const newPerc = ((clampedY - rect.top) / rect.height) * 100;
            value.set(newPerc);
            scrollToPercentage(newPerc, 'auto');

            const pred = newPerc + (velocityRef.current * PREDICTIVE_DAMPING * 0.05);
            predictiveValue.set(Math.max(0, Math.min(pred, 100)));
        });
    };

    const onPointerUp = (ev: React.PointerEvent) => {
        setIsDragging(false);
        setRegion('middle');
        animate(overflow, 0, { type: "spring", stiffness: 500, damping: 30 });

        const currentPerc = value.get();
        const span = 100 / (sections.length - 1);
        const targetIdx = getClosestSectionIndex(currentPerc + (velocityRef.current * 0.1));
        const targetPerc = targetIdx * span;

        animate(value, targetPerc, {
            type: "spring",
            stiffness: 300,
            damping: 30,
            onUpdate: (v) => scrollToPercentage(v, 'auto')
        });

        try { (ev.target as Element).releasePointerCapture(ev.pointerId); } catch (e) { }
    };

    useEffect(() => {
        const moveHandler = (e: PointerEvent) => onPointerMove(e);
        window.addEventListener('pointermove', moveHandler);
        return () => window.removeEventListener('pointermove', moveHandler);
    }, [isDragging]);

    return (
        <div
            className={cn(
                "fixed right-8 bottom-28 z-[100] transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1)",
                isVisible ? "translate-x-0" : "translate-x-32",
                !isVisible ? "opacity-0" : isIdle ? "opacity-[0.05]" : "opacity-100"
            )}
            onPointerEnter={() => {
                setIsIdle(false);
                if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
            }}
            onPointerLeave={() => {
                if (!isExpanded) resetIdleTimeout(3500); // 3.5s nav inactivity
            }}
        >
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    /* ── Collapsed FAB ── */
                    <motion.button
                        key="fab"
                        initial={{ opacity: 0, scale: 0.7, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.7, y: 16 }}
                        transition={{ type: "spring", stiffness: 420, damping: 28 }}
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(255,255,255,0.1)] border border-white/10 hover:border-white/30 cursor-pointer overflow-hidden transition-all duration-300 group"
                        style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)"
                        }}
                        onClick={() => {
                            setIsExpanded(true);
                            setTimeout(updateThumbPosition, 50);
                        }}
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.93 }}
                        aria-label="Open page navigator"
                    >
                        {/* Premium Glossy Inset Ring */}
                        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/20 to-transparent z-10 pointer-events-none" />

                        {/* Hover Ping Glow */}
                        <div className="absolute inset-0 rounded-full bg-white transition-all duration-1000 ease-out opacity-0 group-hover:opacity-20 group-hover:animate-ping z-0 pointer-events-none" />

                        {/* Centered Icon */}
                        <div className="relative z-20 flex items-center justify-center">
                            <SvgIcon name="navigation" size={26} className="text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]" />
                        </div>
                    </motion.button>
                ) : (
                    /* ── Expanded Slider Panel ── */
                    <motion.div
                        key="slider"
                        className="slider-container"
                        initial={{ opacity: 0, scale: 0.85, y: 24, originY: 1 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 24 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    >
                        {/* Close button */}
                        <motion.button
                            onClick={() => setIsExpanded(false)}
                            className="text-white/40 hover:text-white mb-4 transition-colors duration-200 flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Close navigator"
                            title="Close"
                        >
                            <SvgIcon name="close" size={20} className="text-current" />
                        </motion.button>

                        <div
                            ref={sliderRef}
                            className="slider-root"
                            onPointerDown={onPointerDown}
                            onPointerUp={onPointerUp}
                        >
                            <motion.div
                                ref={trackRef}
                                className="slider-track"
                                onPointerDown={handleTrackPointer}
                                style={{
                                    scaleX: springScaleX,
                                    scaleY: springScaleY,
                                    transformOrigin: region === 'top' ? 'top center' : region === 'bottom' ? 'bottom center' : 'center center'
                                }}
                            >
                                <motion.div className="slider-fill" style={{ height: rangeHeight }} />
                                <motion.div className="predictive-fill" style={{ height: predictiveHeight }} />

                                {sections.map((section, i) => {
                                    const nodePos = (i / (sections.length - 1)) * 100;
                                    const isActive = activeIndex === i;

                                    return (
                                        <motion.div
                                            key={section.id}
                                            className={cn("section-node", isActive && "active")}
                                            style={{
                                                top: `${nodePos}%`,
                                                x: "-50%",
                                                y: "-50%"
                                            }}
                                            animate={{
                                                scale: isActive ? 1.5 : 1,
                                                backgroundColor: isActive ? PRIMARY_COLOR : PRIMARY_MUTED
                                            }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        >
                                            {/* Label — shown on active node, slides in from left */}
                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.div
                                                        className="value-indicator"
                                                        initial={{ opacity: 0, x: 8, scale: 0.92 }}
                                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                                        exit={{ opacity: 0, x: 8, scale: 0.92 }}
                                                        transition={{ type: "spring", stiffness: 450, damping: 28 }}
                                                    >
                                                        {section.label}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <div className="node-hit-area" onClick={() => scrollToPercentage(nodePos, 'smooth')} />
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </div>

                        {/* Drag thumb — only visible while dragging */}
                        <AnimatePresence>
                            {isDragging && (
                                <motion.div
                                    className="slider-thumb"
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.6 }}
                                    transition={{ duration: 0.12 }}
                                    style={{
                                        y: thumbY,
                                        "--thumb-left": `${thumbLeft.get()}px`
                                    } as any}
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

}