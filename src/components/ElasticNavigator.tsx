"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import AppIcon from "@/components/ui/AppIcon";
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
    const [isDragging, setIsDragging] = useState(false);

    const sliderRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const idleTimeoutRef = useRef<number | null>(null);
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

    // Brand Colors
    const GOLD = "#f5a623";
    const GOLD_MUTED = "rgba(245, 166, 35, 0.2)";

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
        const handleScroll = () => {
            if (isDragging) return;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;
            const scrollPercent = (window.scrollY / docHeight) * 100;
            value.set(scrollPercent);
            setIsVisible(window.scrollY > window.innerHeight * 0.5);

            if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
            idleTimeoutRef.current = window.setTimeout(() => setIsExpanded(false), 8000);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', updateThumbPosition);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateThumbPosition);
            if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            try { value.stop(); overflow.stop(); predictiveValue.stop(); } catch (e) { }
        };
    }, [isDragging, value, updateThumbPosition]);

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
        <div className={cn(
            "fixed right-6 bottom-8 z-[100] transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1)",
            isVisible ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"
        )}>
            <AnimatePresence mode="popLayout">
                {!isExpanded ? (
                    <motion.button
                        key="fab"
                        layoutId="navigator-frame"
                        className="fab-trigger"
                        onClick={() => {
                            setIsExpanded(true);
                            setTimeout(updateThumbPosition, 50);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <AppIcon name="navigation" size={28} />
                    </motion.button>
                ) : (
                    <motion.div
                        key="slider"
                        layoutId="navigator-frame"
                        className="slider-container"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <motion.button
                            onClick={() => setIsExpanded(false)}
                            className="text-gold/40 hover:text-gold mb-6 transition-colors"
                        >
                            <AppIcon name="close" size={20} />
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
                                            style={{ top: `${nodePos}%` }}
                                            animate={{
                                                scale: isActive ? 1.4 : 1,
                                                backgroundColor: isActive ? GOLD : GOLD_MUTED
                                            }}
                                        >
                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.div
                                                        className="value-indicator"
                                                        initial={{ opacity: 0, x: 10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 10 }}
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

                        <motion.div
                            className="nav-arrow"
                            animate={{
                                y: region === 'top' ? [-4, 0, -4] : region === 'bottom' ? [4, 0, 4] : 0,
                                opacity: isDragging ? 1 : 0.4
                            }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <AppIcon name={region === 'top' ? "stat_3" : region === 'bottom' ? "stat_minus_3" : "expand_more"} size={22} />
                        </motion.div>

                        {isDragging && (
                            <motion.div
                                className="slider-thumb"
                                style={{
                                    y: thumbY,
                                    "--thumb-left": `${thumbLeft.get()}px`
                                } as any}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}