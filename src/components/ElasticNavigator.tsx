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

const MAX_OVERFLOW = 50;
const SCROLL_DEBOUNCE_MS = 16; // ~60fps
const IDLE_TIMEOUT_MS = 5000;

function decay(value: number, max: number) {
    if (max === 0) return 0;
    const entry = value / max;
    const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
    return sigmoid * max;
}

function getScrollPercent() {
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    return totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
}

export default function ElasticNavigator() {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [region, setRegion] = useState<'top' | 'middle' | 'bottom'>('middle');
    const [isIdle, setIsIdle] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const sliderRef = useRef<HTMLDivElement>(null);
    const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isDraggingRef = useRef(false);
    const lastScrollY = useRef(0);
    const rafRef = useRef<number | null>(null);

    const clientY = useMotionValue(0);
    const overflow = useMotionValue(0);
    const scale = useMotionValue(1);
    const scrollProgress = useMotionValue(0);

    const springOverflow = useSpring(overflow, {
        stiffness: 400,
        damping: 30,
        mass: 0.5
    });

    const springScaleX = useTransform(springOverflow, [0, MAX_OVERFLOW], [1, 0.8]);
    const springScaleY = useTransform(springOverflow, (v) => {
        if (sliderRef.current) {
            const { height } = sliderRef.current.getBoundingClientRect();
            return 1 + Math.min(v / height, 0.3);
        }
        return 1;
    });

    const heightPercent = useTransform(scrollProgress, (v) => `${100 - v}%`);

    // Calculate active section index based on scroll progress
    const updateActiveSection = useCallback((progress: number) => {
        const invertedProgress = 100 - progress;
        const index = Math.round((invertedProgress / 100) * (sections.length - 1));
        const clampedIndex = Math.max(0, Math.min(sections.length - 1, index));

        if (clampedIndex !== activeSectionIndex) {
            setActiveSectionIndex(clampedIndex);
        }
    }, [activeSectionIndex]);

    // Handle scroll with RAF for smooth updates
    const handleScroll = useCallback(() => {
        if (isDraggingRef.current) return;

        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
            const scrollPercent = getScrollPercent();

            // Update visibility
            const shouldBeVisible = window.scrollY > window.innerHeight * 0.8;
            if (shouldBeVisible !== isVisible) {
                setIsVisible(shouldBeVisible);
            }

            // Update scroll progress
            scrollProgress.set(scrollPercent);
            updateActiveSection(scrollPercent);

            // Reset idle timer
            setIsIdle(false);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            idleTimeoutRef.current = setTimeout(() => {
                setIsIdle(true);
                setIsExpanded(false);
            }, IDLE_TIMEOUT_MS);
        });
    }, [isVisible, scrollProgress, updateActiveSection]);

    useEffect(() => {
        const throttledScroll = () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = setTimeout(handleScroll, SCROLL_DEBOUNCE_MS);
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });

        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener('scroll', throttledScroll);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [handleScroll]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!sliderRef.current || !isDraggingRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const y = e.clientY - rect.top;
        let newValue = 100 - (y / rect.height) * 100;

        if (newValue < 0) {
            setRegion('bottom');
            const overflowAmount = Math.min(Math.abs(newValue), MAX_OVERFLOW * 2);
            overflow.set(decay(overflowAmount, MAX_OVERFLOW));
        } else if (newValue > 100) {
            setRegion('top');
            const overflowAmount = Math.min(newValue - 100, MAX_OVERFLOW * 2);
            overflow.set(decay(overflowAmount, MAX_OVERFLOW));
        } else {
            setRegion('middle');
            overflow.set(0);
            newValue = Math.min(Math.max(newValue, 0), 100);

            scrollProgress.set(newValue);
            updateActiveSection(newValue);
            clientY.set(e.clientY);

            // Calculate scroll position (inverted for bottom-up navigation)
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPos = ((100 - newValue) / 100) * totalScroll;

            window.scrollTo({
                top: scrollPos,
                behavior: 'instant' as ScrollBehavior
            });
        }
    }, [overflow, scrollProgress, updateActiveSection]);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        e.preventDefault();
        setIsDragging(true);
        isDraggingRef.current = true;
        setIsIdle(false);

        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

        handlePointerMove(e);
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    }, [handlePointerMove]);

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
        isDraggingRef.current = false;

        animate(overflow, 0, {
            type: 'spring',
            stiffness: 400,
            damping: 30
        });
    }, [overflow]);

    const handlePointerLeave = useCallback(() => {
        if (isDraggingRef.current) {
            handlePointerUp();
        }
    }, [handlePointerUp]);

    const scrollToSection = useCallback((index: number) => {
        const element = document.getElementById(sections[index].id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsExpanded(false);
        }
    }, []);

    return (
        <div className={cn(
            "fixed right-6 bottom-8 z-[100] transition-all duration-700 pointer-events-auto",
            isVisible ? "translate-x-0" : "translate-x-32",
            isIdle && !isExpanded ? "opacity-20 scale-90" : "opacity-100 scale-100"
        )}>
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.button
                        key="fab"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 45 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsExpanded(true)}
                        className="fab-trigger w-14 h-14 rounded-full bg-brown/90 backdrop-blur-xl border border-gold/30 flex items-center justify-center shadow-2xl hover:shadow-3xl hover:border-gold/50 transition-shadow duration-300"
                    >
                        <AppIcon name="navigation" size={24} className="text-gold" />
                    </motion.button>
                ) : (
                    <motion.div
                        key="slider"
                        initial={{ height: 56, width: 56, borderRadius: 20, opacity: 0, scale: 0.8 }}
                        animate={{
                            height: 400,
                            width: 32,
                            borderRadius: 16,
                            opacity: 1,
                            scale: 1,
                            transition: { type: "spring", damping: 25 }
                        }}
                        exit={{ height: 56, width: 56, borderRadius: 20, opacity: 0, scale: 0.8 }}
                        className="bg-brown/90 backdrop-blur-2xl border border-gold/20 flex flex-col items-center py-4 relative shadow-2xl"
                    >
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-gold/50 hover:text-gold mb-2 transition-colors duration-200 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gold/10"
                        >
                            <AppIcon name="close" size={14} />
                        </button>

                        <div
                            ref={sliderRef}
                            className="slider-root w-full flex-1 relative touch-none select-none"
                            onPointerMove={handlePointerMove}
                            onPointerDown={handlePointerDown}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerLeave}
                            onPointerCancel={handlePointerUp}
                        >
                            <motion.div
                                style={{
                                    scaleX: springScaleX,
                                    scaleY: springScaleY,
                                }}
                                className="slider-track absolute inset-0 mx-auto w-1 bg-gold/20 rounded-full overflow-hidden"
                            >
                                {/* Active range indicator */}
                                <motion.div
                                    className="slider-range absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gold/80 to-gold/40"
                                    style={{ height: heightPercent }}
                                />

                                {/* Nodes */}
                                {sections.map((section, i) => {
                                    const nodePos = (i / (sections.length - 1)) * 100;
                                    const isActive = activeSectionIndex === i;
                                    const distanceFromActive = Math.abs(i - activeSectionIndex);

                                    return (
                                        <motion.button
                                            key={section.id}
                                            className={cn(
                                                "section-node absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-all duration-300",
                                                isActive
                                                    ? "bg-gold border-gold scale-125"
                                                    : "bg-brown border-gold/30 hover:border-gold/60 hover:scale-110"
                                            )}
                                            style={{ top: `${nodePos}%` }}
                                            whileHover={{ scale: 1.3 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => scrollToSection(i)}
                                            animate={{
                                                opacity: 0.3 + (0.7 / (distanceFromActive + 1))
                                            }}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: -24 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    className="value-indicator absolute right-full mr-2 px-2 py-1 bg-brown/90 backdrop-blur-sm border border-gold/20 rounded-md text-xs text-gold whitespace-nowrap"
                                                >
                                                    {section.label}
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    );
                                })}

                                {/* Draggable handle */}
                                <motion.div
                                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-gold/90 to-gold/60 border-2 border-gold/30 shadow-lg cursor-grab active:cursor-grabbing"
                                    style={{ top: `${100 - scrollProgress.get()}%` }}
                                    animate={{
                                        scale: isDragging ? 1.2 : 1,
                                        boxShadow: isDragging
                                            ? "0 10px 25px -5px rgba(245, 158, 11, 0.4), 0 0 15px rgba(245, 158, 11, 0.3)"
                                            : "0 4px 12px -2px rgba(245, 158, 11, 0.3)"
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                />
                            </motion.div>
                        </div>

                        <motion.div
                            className="mt-4 text-gold/60"
                            animate={{
                                y: region === 'bottom' ? springOverflow.get() / 2 : region === 'top' ? -springOverflow.get() / 2 : 0,
                                opacity: scrollProgress.get() > 99 ? 0.3 : 1
                            }}
                            transition={{ type: "spring", damping: 30 }}
                        >
                            <AppIcon
                                name={region === 'top' ? "keyboard_double_arrow_up" : "keyboard_double_arrow_down"}
                                size={20}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}