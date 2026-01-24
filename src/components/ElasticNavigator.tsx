"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import AppIcon from "@/components/ui/AppIcon";
import { motion, animate, useMotionValue, useMotionValueEvent, useTransform, useSpring, AnimatePresence, PanInfo } from "framer-motion";
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
const SPRING_CONFIG = { stiffness: 400, damping: 30, mass: 0.8 };
const PREDICTIVE_DAMPING = 0.9;

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
    const [isIdle, setIsIdle] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const sliderRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const velocityRef = useRef(0);
    const lastYRef = useRef(0);
    const lastTimeRef = useRef(0);

    const value = useMotionValue(0);
    const clientY = useMotionValue(0);
    const overflow = useMotionValue(0);
    const scale = useMotionValue(1);
    const panOffset = useMotionValue(0);

    const springOverflow = useSpring(overflow, SPRING_CONFIG);
    const springScaleX = useTransform(springOverflow, [0, MAX_OVERFLOW], [1, 0.8]);
    const springScaleY = useTransform(springOverflow, (v) => {
        if (sliderRef.current) {
            const { height } = sliderRef.current.getBoundingClientRect();
            return 1 + v / height;
        }
        return 1;
    });

    const [activeIndex, setActiveIndex] = useState(0);

    // Track active index reactively
    useMotionValueEvent(value, "change", (latest) => {
        const index = getClosestSectionIndex(latest);
        setActiveIndex(index);
    });

    // Brand Colors (Standard)
    const GOLD = "#f5a623";
    const GOLD_MUTED = "rgba(245, 166, 35, 0.2)";

    const rangeHeight = useTransform(value, (v) => `${v}%`);
    const predictiveValue = useMotionValue(0);
    const predictiveHeight = useTransform(predictiveValue, (v) => `${v}%`);

    const transformOrigin = region === 'top' ? 'top center' : region === 'bottom' ? 'bottom center' : 'center center';

    const scrollToPercentage = useCallback((percentage: number, behavior: ScrollBehavior = 'auto') => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = (percentage / 100) * scrollableHeight;

        window.scrollTo({
            top: targetScroll,
            behavior: behavior === 'auto' ? 'auto' : 'smooth'
        });

        value.set(percentage);
    }, [value]);

    const getClosestSectionIndex = useCallback((percentage: number) => {
        const sectionPercentage = 100 / (sections.length - 1);
        return Math.round(percentage / sectionPercentage);
    }, []);

    const snapToNearestSection = useCallback((currentPercentage: number) => {
        const sectionPercentage = 100 / (sections.length - 1);
        const closestIndex = getClosestSectionIndex(currentPercentage);
        const targetPercentage = closestIndex * sectionPercentage;

        animate(value, targetPercentage, {
            type: "spring",
            stiffness: 300,
            damping: 30,
            onUpdate: (latest) => {
                scrollToPercentage(latest, 'auto');
            }
        });
    }, [getClosestSectionIndex, scrollToPercentage, value]);

    useEffect(() => {
        const handleScroll = () => {
            if (isDragging) return;

            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            value.set(scrollPercent);
            setIsVisible(window.scrollY > window.innerHeight * 0.8);

            setIsIdle(false);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            idleTimeoutRef.current = setTimeout(() => {
                setIsIdle(true);
                setIsExpanded(false);
            }, 5000);
        };

        const handleResize = () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            value.set(scrollPercent);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        };
    }, [isDragging, value]);

    const handleDragStart = () => {
        setIsDragging(true);
        setIsIdle(false);
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        velocityRef.current = 0;
        lastYRef.current = 0;
        lastTimeRef.current = Date.now();
    };

    const handleDrag = (event: any, info: PanInfo) => {
        if (!sliderRef.current || !trackRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const trackRect = trackRef.current.getBoundingClientRect();
        const currentY = info.point.y;

        const now = Date.now();
        const deltaTime = now - lastTimeRef.current;

        if (deltaTime > 0) {
            const deltaY = currentY - lastYRef.current;
            velocityRef.current = (deltaY / deltaTime) * 1000;
        }

        lastYRef.current = currentY;
        lastTimeRef.current = now;

        const relativeY = currentY - rect.top;
        let newPercentage = (relativeY / rect.height) * 100;

        const trackTop = trackRect.top - rect.top;
        const trackBottom = trackRect.bottom - rect.top;
        const trackHeight = trackRect.height;

        if (relativeY < trackTop) {
            setRegion('top');
            const overflowAmount = trackTop - relativeY;
            overflow.set(decay(overflowAmount, MAX_OVERFLOW));

            const overflowFactor = 1 - (overflowAmount / MAX_OVERFLOW);
            newPercentage = 0 - (10 * (1 - overflowFactor));
        } else if (relativeY > trackBottom) {
            setRegion('bottom');
            const overflowAmount = relativeY - trackBottom;
            overflow.set(decay(overflowAmount, MAX_OVERFLOW));

            const overflowFactor = 1 - (overflowAmount / MAX_OVERFLOW);
            newPercentage = 100 + (10 * (1 - overflowFactor));
        } else {
            setRegion('middle');
            overflow.set(0);

            const trackRelativeY = relativeY - trackTop;
            newPercentage = (trackRelativeY / trackHeight) * 100;
        }

        newPercentage = Math.max(0, Math.min(newPercentage, 100));
        value.set(newPercentage);
        scrollToPercentage(newPercentage, 'auto');

        const predictedPercentage = newPercentage + (velocityRef.current * PREDICTIVE_DAMPING);
        predictiveValue.set(Math.max(0, Math.min(predictedPercentage, 100)));
    };

    const handleDragEnd = () => {
        setIsDragging(false);

        const finalVelocity = velocityRef.current;
        const currentPercentage = value.get();

        let targetPercentage = currentPercentage + (finalVelocity * PREDICTIVE_DAMPING);
        targetPercentage = Math.max(0, Math.min(targetPercentage, 100));

        animate(overflow, 0, {
            type: 'spring',
            bounce: 0.5,
            duration: 0.3
        });

        if (Math.abs(finalVelocity) > 50) {
            animate(value, targetPercentage, {
                type: "spring",
                stiffness: 200,
                damping: 20,
                onUpdate: (latest) => {
                    scrollToPercentage(latest, 'auto');
                },
                onComplete: () => {
                    snapToNearestSection(value.get());
                }
            });
        } else {
            snapToNearestSection(currentPercentage);
        }
    };

    const handleNodeClick = useCallback((index: number) => {
        const sectionPercentage = (100 / (sections.length - 1)) * index;
        scrollToPercentage(sectionPercentage, 'smooth');
    }, [scrollToPercentage]);

    return (
        <div className={cn(
            "fixed right-6 bottom-8 z-[100] transition-all duration-700",
            isVisible ? "translate-x-0" : "translate-x-32"
        )}>
            <AnimatePresence>
                {!isExpanded ? (
                    <motion.button
                        key="fab"
                        layoutId="nav-container"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={() => setIsExpanded(true)}
                        className="fab-trigger"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <AppIcon name="navigation" size={24} />
                    </motion.button>
                ) : (
                    <motion.div
                        key="slider"
                        layoutId="nav-container"
                        initial={{ opacity: 0, scale: 0.8, height: 56, width: 56 }}
                        animate={{ opacity: 1, scale: 1, height: 420, width: 48 }}
                        exit={{ opacity: 0, scale: 0.8, height: 56, width: 56 }}
                        className="slider-container"
                    >
                        <motion.button
                            onClick={() => setIsExpanded(false)}
                            className="text-gold/50 hover:text-gold mb-4 p-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <AppIcon name="close" size={16} />
                        </motion.button>

                        <motion.div
                            ref={sliderRef}
                            className="slider-root"
                            onPanStart={handleDragStart}
                            onPan={handleDrag}
                            onPanEnd={handleDragEnd}
                            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                        >
                            <motion.div
                                ref={trackRef}
                                style={{
                                    scaleY: springScaleY,
                                    scaleX: springScaleX,
                                    transformOrigin,
                                }}
                                className="slider-track"
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
                                                scale: isActive ? 1.5 : 1,
                                                backgroundColor: isActive ? GOLD : GOLD_MUTED
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNodeClick(i);
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
                                            <div className="node-hit-area" />
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="nav-arrow"
                            animate={{
                                y: region === 'bottom' ? [0, 5, 0] : region === 'top' ? [0, -5, 0] : 0,
                                opacity: activeIndex === sections.length - 1 ? 0.3 : 1
                            }}
                            transition={{ repeat: region !== 'middle' ? Infinity : 0, duration: 1 }}
                        >
                            <AppIcon name={region === 'top' ? "expand_less" : "expand_more"} size={20} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
