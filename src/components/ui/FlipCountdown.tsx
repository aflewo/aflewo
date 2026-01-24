"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface FlipCountdownProps {
    targetDate: Date;
    eventTitle?: string;
    eventLocation?: string;
    onComplete?: () => void;
}

interface TimeLeft {
    days: number;
    hours: number;
    mins: number;
    secs: number;
}

function FlipCard({ value, label }: { value: number; label: string }) {
    const flipRef = useRef<HTMLDivElement>(null);
    const prevValueRef = useRef(value);
    const [displayValue, setDisplayValue] = useState(value);
    const [nextValue, setNextValue] = useState(value);

    useEffect(() => {
        if (prevValueRef.current !== value) {
            setNextValue(value);

            const tl = gsap.timeline({
                onComplete: () => {
                    setDisplayValue(value);
                    prevValueRef.current = value;
                    if (flipRef.current) {
                        gsap.set(flipRef.current, { rotateX: 0 });
                    }
                }
            });

            if (flipRef.current) {
                tl.to(flipRef.current, {
                    rotateX: -180,
                    duration: 0.7,
                    ease: "power2.inOut"
                });
            }
        }
    }, [value]);

    const formattedDisplay = displayValue.toString().padStart(2, '0');
    const formattedNext = nextValue.toString().padStart(2, '0');

    return (
        <div className="flip-countdown-unit flex flex-col items-center gap-4 group">
            <div className="relative" style={{ perspective: "1000px" }}>
                {/* Physical Base Shadow */}
                <div className="absolute inset-0 bg-black/40 blur-2xl translate-y-4 scale-90" />

                <div className="flip-card-container relative w-16 h-20 sm:w-20 sm:h-24 md:w-28 md:h-36 rounded-2xl overflow-hidden glass shadow-2xl border border-white/5">
                    {/* Top Static Part */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-[hsl(20,20%,12%)] flex items-end justify-center overflow-hidden">
                        <span className="text-4xl sm:text-5xl md:text-7xl font-black text-white translate-y-1/2 tracking-tighter">
                            {formattedNext}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
                    </div>

                    {/* Bottom Static Part */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[hsl(20,20%,10%)] flex items-start justify-center overflow-hidden">
                        <span className="text-4xl sm:text-5xl md:text-7xl font-black text-white -translate-y-1/2 tracking-tighter">
                            {formattedDisplay}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent" />
                    </div>

                    {/* Flipper */}
                    <div
                        ref={flipRef}
                        className="absolute inset-x-0 top-0 h-1/2 origin-bottom z-20"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* Front (Visible before flip) */}
                        <div className="absolute inset-0 bg-[hsl(20,20%,12%)] border-b border-black/40 flex items-end justify-center overflow-hidden rounded-t-2xl px-2" style={{ backfaceVisibility: "hidden" }}>
                            <span className="text-4xl sm:text-5xl md:text-7xl font-black text-white translate-y-1/2 tracking-tighter">
                                {formattedDisplay}
                            </span>
                        </div>

                        {/* Back (Visible after 180 deg) */}
                        <div
                            className="absolute inset-0 bg-[hsl(20,20%,10%)] border-t border-white/5 flex items-start justify-center overflow-hidden rounded-b-2xl px-2 shadow-inner"
                            style={{
                                backfaceVisibility: "hidden",
                                transform: "rotateX(180deg)"
                            }}
                        >
                            <span className="text-4xl sm:text-5xl md:text-7xl font-black text-white -translate-y-1/2 tracking-tighter">
                                {formattedNext}
                            </span>
                        </div>
                    </div>

                    {/* Center Groove */}
                    <div className="absolute inset-y-0 left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-black/60 z-30 shadow-[0_1px_0_rgba(255,255,255,0.05)]" />

                    {/* Ambient Occlusion Corner Shadows */}
                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_40px_rgba(0,0,0,0.4)] pointer-events-none z-40" />
                </div>
            </div>
            <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-gold/40 group-hover:text-gold transition-colors duration-500">
                {label}
            </span>
        </div>
    );
}

export default function FlipCountdown({
    targetDate,
    eventTitle,
    eventLocation,
    onComplete
}: FlipCountdownProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });
    const [isComplete, setIsComplete] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
                if (!isComplete) {
                    setIsComplete(true);
                    onComplete?.();
                }
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, mins, secs });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate, isComplete, onComplete]);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 1.5, ease: "power4.out" }
            );
        }
    }, []);

    return (
        <div ref={containerRef} className="flip-countdown-wrapper space-y-12 py-10">
            {(eventTitle || eventLocation) && (
                <div className="text-center space-y-4">
                    {eventTitle && (
                        <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
                            {eventTitle}
                        </h3>
                    )}
                    {eventLocation && (
                        <p className="text-sm md:text-lg font-bold uppercase tracking-widest text-gold bg-gold/10 inline-block px-6 py-2 rounded-full border border-gold/20">
                            {eventLocation}
                        </p>
                    )}
                </div>
            )}

            <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-10">
                <FlipCard value={timeLeft.days} label="Days" />
                <div className="flex flex-col gap-4 pb-10 opacity-30">
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                </div>
                <FlipCard value={timeLeft.hours} label="Hours" />
                <div className="flex flex-col gap-4 pb-10 opacity-30">
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                </div>
                <FlipCard value={timeLeft.mins} label="Mins" />
                <div className="flex flex-col gap-4 pb-10 opacity-30">
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                </div>
                <FlipCard value={timeLeft.secs} label="Secs" />
            </div>

            {isComplete && (
                <div className="text-center">
                    <div className="inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-gold text-brown font-black uppercase text-xl animate-bounce shadow-glow">
                        The Event is Live!
                    </div>
                </div>
            )}
        </div>
    );
}
