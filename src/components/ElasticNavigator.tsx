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

function decay(value: number, max: number) {
    if (max === 0) return 0;
    const entry = value / max;
    const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
    return sigmoid * max;
}

export default function ElasticNavigator() {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [value, setValue] = useState(0);
    const [region, setRegion] = useState<'top' | 'middle' | 'bottom'>('middle');
    const [isIdle, setIsIdle] = useState(false);

    const sliderRef = useRef<HTMLDivElement>(null);
    const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clientY = useMotionValue(0);
    const overflow = useMotionValue(0);
    const scale = useMotionValue(1);

    const springOverflow = useSpring(overflow, { stiffness: 400, damping: 30 });
    const springScaleX = useTransform(springOverflow, [0, MAX_OVERFLOW], [1, 0.8]);
    const springScaleY = useTransform(springOverflow, (v) => {
        if (sliderRef.current) {
            const { height } = sliderRef.current.getBoundingClientRect();
            return 1 + v / height;
        }
        return 1;
    });

    useEffect(() => {
        const handleScroll = () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            setValue(scrollPercent);
            setIsVisible(window.scrollY > window.innerHeight * 0.8);

            // Reset idle timer
            setIsIdle(false);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            idleTimeoutRef.current = setTimeout(() => {
                setIsIdle(true);
                setIsExpanded(false);
            }, 5000);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        };
    }, []);

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!sliderRef.current || e.buttons !== 1) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const y = e.clientY - rect.top;
        let newValue = 100 - (y / rect.height) * 100; // Inverted for vertical bottom-up

        if (newValue < 0) {
            setRegion('bottom');
            overflow.set(decay(Math.abs(clientY.get() - e.clientY), MAX_OVERFLOW));
        } else if (newValue > 100) {
            setRegion('top');
            overflow.set(decay(Math.abs(clientY.get() - e.clientY), MAX_OVERFLOW));
        } else {
            setRegion('middle');
            overflow.set(0);
            newValue = Math.min(Math.max(newValue, 0), 100);

            setValue(newValue);
            clientY.set(e.clientY);

            // Translate to page scroll
            const scrollPos = (newValue / 100) * (document.documentElement.scrollHeight - window.innerHeight);
            window.scrollTo({
                top: (1 - newValue / 100) * (document.documentElement.scrollHeight - window.innerHeight),
                behavior: 'auto'
            });
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsIdle(false);
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        handlePointerMove(e);
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    };

    const handlePointerUp = () => {
        animate(overflow, 0, { type: 'spring', bounce: 0.5 });
    };

    return (
        <div className={cn(
            "fixed right-6 bottom-8 z-[100] transition-all duration-700",
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
                        onClick={() => setIsExpanded(true)}
                        className="fab-trigger"
                    >
                        <AppIcon name="navigation" size={24} />
                    </motion.button>
                ) : (
                    <motion.div
                        key="slider"
                        initial={{ height: 56, width: 56, borderRadius: 20 }}
                        animate={{ height: 400, width: 32, borderRadius: 16 }}
                        exit={{ height: 56, width: 56, borderRadius: 20 }}
                        className="bg-brown/90 backdrop-blur-2xl border border-gold/20 flex flex-col items-center py-4 relative shadow-2xl"
                    >
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-gold/50 hover:text-gold mb-2"
                        >
                            <AppIcon name="close" size={16} />
                        </button>

                        <div
                            ref={sliderRef}
                            className="slider-root"
                            onPointerMove={handlePointerMove}
                            onPointerDown={handlePointerDown}
                            onPointerUp={handlePointerUp}
                        >
                            <motion.div
                                style={{
                                    scaleX: springScaleX,
                                    scaleY: springScaleY,
                                }}
                                className="slider-track"
                            >
                                {/* Nodes */}
                                {sections.map((section, i) => {
                                    const nodePos = (i / (sections.length - 1)) * 100;
                                    const activeIndex = Math.round(((100 - value) / 100) * (sections.length - 1));
                                    const isActive = activeIndex === i;

                                    return (
                                        <div
                                            key={section.id}
                                            className={cn("section-node", isActive && "active")}
                                            style={{ top: `${nodePos}%` }}
                                        >
                                            {isActive && (
                                                <div className="value-indicator">
                                                    {section.label}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                <div
                                    className="slider-range"
                                    style={{ height: `${100 - value}%` }}
                                />
                            </motion.div>
                        </div>

                        <motion.div
                            className="mt-2 text-gold"
                            animate={{
                                y: region === 'bottom' ? springOverflow.get() / 2 : 0,
                                opacity: value > 99 ? 0.3 : 1
                            }}
                        >
                            <AppIcon name="keyboard_double_arrow_down" size={20} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
