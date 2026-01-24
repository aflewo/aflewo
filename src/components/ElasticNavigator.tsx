"use client";

import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import AppIcon from '@/components/ui/AppIcon';
import { cn } from '@/lib/utils';

import './ElasticNavigator.css';

const sections = [
    { id: 'hero', icon: 'home', label: 'Top' },
    { id: 'about', icon: 'info', label: 'About' },
    { id: 'chapters', icon: 'map', label: 'Hubs' },
    { id: 'events', icon: 'calendar_month', label: 'Events' },
    { id: 'media', icon: 'play_arrow', label: 'Legacy' },
    { id: 'stories', icon: 'format_quote', label: 'Voice' },
    { id: 'partners', icon: 'handshake', label: 'Unity' },
    { id: 'leadership', icon: 'shield', label: 'Lead' },
    { id: 'join', icon: 'favorite', label: 'Join' },
];

const MAX_OVERFLOW = 50;

export default function ElasticNavigator() {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [isIdle, setIsIdle] = useState(false);
    const idleTimeout = useRef<NodeJS.Timeout>();

    const resetIdle = useCallback(() => {
        setIsIdle(false);
        if (idleTimeout.current) clearTimeout(idleTimeout.current);
        idleTimeout.current = setTimeout(() => {
            if (!isExpanded) setIsIdle(true);
        }, 5000);
    }, [isExpanded]);

    useEffect(() => {
        const handleScroll = () => {
            resetIdle();
            const scrollPos = window.scrollY;
            const windowHeight = window.innerHeight;

            // Activate after one page length
            setIsVisible(scrollPos > windowHeight);

            // Detect active section
            for (const section of [...sections].reverse()) {
                const el = document.getElementById(section.id);
                if (el && scrollPos >= el.offsetTop - windowHeight / 2) {
                    setActiveSection(section.id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        resetIdle();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (idleTimeout.current) clearTimeout(idleTimeout.current);
        };
    }, [resetIdle]);

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-8 right-8 z-[100] md:hidden transition-opacity duration-1000",
                isIdle ? "opacity-5" : "opacity-100"
            )}
            onClick={resetIdle}
            onTouchStart={resetIdle}
        >
            <div className="relative flex flex-col items-center">
                {!isExpanded ? (
                    <motion.button
                        layoutId="nav-container"
                        onClick={() => setIsExpanded(true)}
                        className="w-14 h-14 bg-gold text-brown rounded-full flex items-center justify-center shadow-glow press-scale border-4 border-white/10"
                    >
                        <AppIcon name="navigation" size={24} />
                    </motion.button>
                ) : (
                    <motion.div
                        layoutId="nav-container"
                        className="relative bg-card/90 backdrop-blur-2xl border border-white/10 rounded-full py-6 px-4 shadow-2xl flex flex-col items-center gap-4"
                    >
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="mb-4 text-gold/40 hover:text-gold transition-colors"
                        >
                            <AppIcon name="close" size={20} />
                        </button>

                        <Slider
                            sections={sections}
                            activeSection={activeSection}
                            onClose={() => setIsExpanded(false)}
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function Slider({ sections, activeSection, onClose }: { sections: any[], activeSection: string, onClose: () => void }) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [region, setRegion] = useState('middle');
    const clientY = useMotionValue(0);
    const overflow = useMotionValue(0);
    const scale = useMotionValue(1);

    // Map section index to slider range
    const activeIndex = sections.findIndex(s => s.id === activeSection);
    const defaultValue = (activeIndex / (sections.length - 1)) * 100;
    const [value, setValue] = useState(defaultValue);

    useMotionValueEvent(clientY, 'change', latest => {
        if (sliderRef.current) {
            const { top, bottom } = sliderRef.current.getBoundingClientRect();
            let newValue;

            if (latest < top) {
                setRegion('top');
                newValue = top - latest;
            } else if (latest > bottom) {
                setRegion('bottom');
                newValue = latest - bottom;
            } else {
                setRegion('middle');
                newValue = 0;
            }

            overflow.jump(decay(newValue, MAX_OVERFLOW));
        }
    });

    const handlePointerMove = (e: React.PointerEvent) => {
        if (e.buttons > 0 && sliderRef.current) {
            const { top, height } = sliderRef.current.getBoundingClientRect();
            let newValue = ((e.clientY - top) / height) * 100;

            // Snap to nodes
            const nodeStep = 100 / (sections.length - 1);
            const snappedIndex = Math.round(newValue / nodeStep);
            newValue = Math.min(Math.max(newValue, 0), 100);

            setValue(newValue);
            clientY.jump(e.clientY);

            // Scroll to section
            const targetSection = sections[snappedIndex];
            const el = document.getElementById(targetSection.id);
            if (el) {
                window.scrollTo({
                    top: el.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        handlePointerMove(e);
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    };

    const handlePointerUp = () => {
        animate(overflow, 0, { type: 'spring', bounce: 0.5 });
    };

    return (
        <div className="flex flex-col items-center gap-6 h-[400px]">
            <motion.div
                animate={{
                    scale: region === 'top' ? [1, 1.4, 1] : 1,
                    transition: { duration: 0.25 }
                }}
                style={{
                    y: useTransform(() => (region === 'top' ? -overflow.get() / scale.get() : 0))
                }}
                className="text-gold"
            >
                <AppIcon name="keyboard_double_arrow_up" size={24} />
            </motion.div>

            <div
                ref={sliderRef}
                className="relative flex flex-col items-center h-full w-8 cursor-grab active:cursor-grabbing touch-none select-none"
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
            >
                <motion.div
                    style={{
                        scaleY: useTransform(() => {
                            if (sliderRef.current) {
                                const { height } = sliderRef.current.getBoundingClientRect();
                                return 1 + overflow.get() / height;
                            }
                        }),
                        scaleX: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
                        transformOrigin: useTransform(() => {
                            if (sliderRef.current) {
                                const { top, height } = sliderRef.current.getBoundingClientRect();
                                return clientY.get() < top + height / 2 ? 'bottom' : 'top';
                            }
                        }),
                        width: 4
                    }}
                    className="h-full bg-gold/20 rounded-full relative"
                >
                    {/* Active Range Overlay */}
                    <div
                        className="absolute top-0 left-0 right-0 bg-gold rounded-full"
                        style={{ height: `${value}%` }}
                    />

                    {/* Section Nodes */}
                    {sections.map((section, i) => (
                        <div
                            key={section.id}
                            className={cn(
                                "absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background transition-all duration-300",
                                Math.round((value / 100) * (sections.length - 1)) === i ? "bg-gold scale-125 shadow-glow" : "bg-white/20"
                            )}
                            style={{ top: `${(i / (sections.length - 1)) * 100}%` }}
                        >
                            {Math.round((value / 100) * (sections.length - 1)) === i && (
                                <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-gold text-brown px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                                    {section.label}
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                animate={{
                    scale: region === 'bottom' ? [1, 1.4, 1] : 1,
                    transition: { duration: 0.25 }
                }}
                style={{
                    y: useTransform(() => (region === 'bottom' ? overflow.get() / scale.get() : 0))
                }}
                className="text-gold"
            >
                <AppIcon name="keyboard_double_arrow_down" size={24} />
            </motion.div>
        </div>
    );
}

function decay(value: number, max: number) {
    if (max === 0) return 0;
    const entry = value / max;
    const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
    return sigmoid * max;
}
