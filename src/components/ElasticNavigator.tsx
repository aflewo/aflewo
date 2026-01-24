"use client";

import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import AppIcon from '@/components/ui/AppIcon';
import './ElasticNavigator.css';

const MAX_OVERFLOW = 50;
const SECTIONS = [
    { id: 'hero', label: 'Top' },
    { id: 'about', label: 'About' },
    { id: 'chapters', label: 'Chapters' },
    { id: 'events', label: 'Events' },
    { id: 'media', label: 'Archive' },
    { id: 'stories', label: 'Stories' },
    { id: 'partners', label: 'Partners' },
    { id: 'leadership', label: 'Summit' },
    { id: 'join', label: 'Join' }
];

export default function ElasticNavigator() {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [isIdle, setIsIdle] = useState(false);
    const idleTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > window.innerHeight);
            setIsIdle(false);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            idleTimeoutRef.current = setTimeout(() => setIsIdle(true), 5000);

            // Find active section
            const current = SECTIONS.find(s => {
                const el = document.getElementById(s.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });
            if (current) setActiveSection(current.id);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className={cn(
            "fixed bottom-8 right-8 z-[100] transition-all duration-500",
            isIdle && !isExpanded ? "opacity-30 scale-90" : "opacity-100 scale-100"
        )}>
            {!isExpanded ? (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-14 h-14 bg-gold text-brown rounded-full flex items-center justify-center shadow-glow press-scale border-4 border-background"
                >
                    <AppIcon name="anchor" size={24} />
                </button>
            ) : (
                <SliderContainer
                    onClose={() => setIsExpanded(false)}
                    activeSection={activeSection}
                />
            )}
        </div>
    );
}

function SliderContainer({ onClose, activeSection }: { onClose: () => void, activeSection: string }) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState(0);
    const clientY = useMotionValue(0);
    const overflow = useMotionValue(0);
    const scale = useMotionValue(1);

    useEffect(() => {
        const index = SECTIONS.findIndex(s => s.id === activeSection);
        if (index !== -1) {
            setValue((index / (SECTIONS.length - 1)) * 100);
        }
    }, [activeSection]);

    useMotionValueEvent(clientY, 'change', latest => {
        if (sliderRef.current) {
            const { top, bottom } = sliderRef.current.getBoundingClientRect();
            let newValue;
            if (latest < top) newValue = top - latest;
            else if (latest > bottom) newValue = latest - bottom;
            else newValue = 0;
            overflow.jump(decay(newValue, MAX_OVERFLOW));
        }
    });

    const handlePointerMove = (e: React.PointerEvent) => {
        if (e.buttons > 0 && sliderRef.current) {
            const { top, height } = sliderRef.current.getBoundingClientRect();
            let newValue = ((e.clientY - top) / height) * 100;
            newValue = Math.min(Math.max(newValue, 0), 100);
            setValue(newValue);
            clientY.jump(e.clientY);

            // Scroll to mapped position
            const targetScroll = (newValue / 100) * (document.documentElement.scrollHeight - window.innerHeight);
            window.scrollTo({ top: targetScroll, behavior: 'auto' });
        }
    };

    const handlePointerUp = () => {
        animate(overflow, 0, { type: 'spring', bounce: 0.5 });
        // Snap to nearest section
        const nearestIndex = Math.round((value / 100) * (SECTIONS.length - 1));
        const targetId = SECTIONS[nearestIndex].id;
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="elastic-nav-card glass-card-elevated p-6 rounded-[2rem] flex flex-col items-center gap-6 border-gold/30"
            onPointerLeave={handlePointerUp}
        >
            <button onClick={onClose} className="p-2 text-gold/50 hover:text-gold">
                <AppIcon name="north" size={20} />
            </button>

            <div
                ref={sliderRef}
                className="navigator-track-root"
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <div className="navigator-track">
                    <motion.div
                        className="navigator-range"
                        style={{
                            height: `${value}%`,
                            background: 'hsl(var(--gold))'
                        }}
                    />
                    {SECTIONS.map((s, i) => (
                        <div
                            key={s.id}
                            className="navigator-node"
                            style={{ top: `${(i / (SECTIONS.length - 1)) * 100}%` }}
                        >
                            <span className={cn(
                                "node-label",
                                activeSection === s.id ? "opacity-100 scale-110 text-gold" : "opacity-0 scale-90"
                            )}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                    <motion.div
                        className="navigator-handle"
                        style={{
                            top: `${value}%`,
                            y: useTransform(overflow, [0, MAX_OVERFLOW], [0, 20])
                        }}
                    />
                </div>
            </div>

            <button onClick={handlePointerUp} className="p-2 text-gold/50 hover:text-gold">
                <AppIcon name="south" size={20} />
            </button>
            <div className="text-[8px] font-black uppercase tracking-widest text-gold/30">Navigator</div>
        </motion.div>
    );
}

function decay(value: number, max: number) {
    if (max === 0) return 0;
    const entry = value / max;
    const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
    return sigmoid * max;
}
