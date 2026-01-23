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
    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const flipRef = useRef<HTMLDivElement>(null);
    const prevValueRef = useRef(value);
    const currentValueRef = useRef(value);
    const [displayValue, setDisplayValue] = useState(value);
    const [nextValue, setNextValue] = useState(value);

    useEffect(() => {
        if (prevValueRef.current !== value) {
            setNextValue(value);
            currentValueRef.current = value;

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
                    duration: 0.6,
                    ease: "power2.inOut"
                });
            }
        }
    }, [value]);

    const formattedDisplay = displayValue.toString().padStart(2, '0');
    const formattedNext = nextValue.toString().padStart(2, '0');

    return (
        <div className="flip-countdown-unit flex flex-col items-center gap-3">
            <div className="relative" style={{ perspective: "400px" }}>
                <div className="flip-card-container relative w-16 h-20 sm:w-20 sm:h-24 md:w-28 md:h-32">
                    <div
                        ref={topRef}
                        className="flip-card-top absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[hsl(30,6%,14%)] to-[hsl(30,6%,11%)] rounded-t-xl overflow-hidden border border-white/5 border-b-0"
                    >
                        <div className="absolute inset-0 flex items-end justify-center pb-0">
                            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white translate-y-1/2">
                                {formattedDisplay}
                            </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
                    </div>

                    <div
                        ref={bottomRef}
                        className="flip-card-bottom absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[hsl(30,6%,14%)] to-[hsl(30,6%,11%)] rounded-b-xl overflow-hidden border border-white/5 border-t-0"
                    >
                        <div className="absolute inset-0 flex items-start justify-center pt-0">
                            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white -translate-y-1/2">
                                {formattedDisplay}
                            </span>
                        </div>
                    </div>

                    <div
                        ref={flipRef}
                        className="flip-card-flip absolute inset-x-0 top-0 h-1/2 origin-bottom rounded-t-xl overflow-hidden"
                        style={{
                            backfaceVisibility: "hidden",
                            transformStyle: "preserve-3d"
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(30,6%,14%)] to-[hsl(30,6%,11%)] border border-white/5 border-b-0 rounded-t-xl" style={{ backfaceVisibility: "hidden" }}>
                            <div className="absolute inset-0 flex items-end justify-center pb-0">
                                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white translate-y-1/2">
                                    {formattedDisplay}
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
                        </div>

                        <div
                            className="absolute inset-0 bg-gradient-to-t from-[hsl(30,6%,14%)] to-[hsl(30,6%,11%)] border border-white/5 border-t-0 rounded-b-xl"
                            style={{
                                backfaceVisibility: "hidden",
                                transform: "rotateX(180deg)"
                            }}
                        >
                            <div className="absolute inset-0 flex items-start justify-center pt-0">
                                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white -translate-y-1/2">
                                    {formattedNext}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-y-0 left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-black/40 z-10" />

                    <div className="absolute inset-0 rounded-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] pointer-events-none" />

                    <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute inset-0 rounded-xl shadow-[0_0_40px_-10px_hsl(45,100%,50%,0.3)]" />
                    </div>
                </div>
            </div>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gold/60">
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
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
            );
        }
    }, []);

    return (
        <div ref={containerRef} className="flip-countdown-wrapper space-y-8">
            {(eventTitle || eventLocation) && (
                <div className="text-center space-y-2">
                    {eventTitle && (
                        <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-white">
                            {eventTitle}
                        </h3>
                    )}
                    {eventLocation && (
                        <p className="text-sm font-medium text-white/50">
                            {eventLocation}
                        </p>
                    )}
                </div>
            )}

            <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4">
                <FlipCard value={timeLeft.days} label="Days" />
                <div className="flex flex-col gap-3 pb-6">
                    <div className="w-2 h-2 rounded-full bg-gold/50" />
                    <div className="w-2 h-2 rounded-full bg-gold/50" />
                </div>
                <FlipCard value={timeLeft.hours} label="Hours" />
                <div className="flex flex-col gap-3 pb-6">
                    <div className="w-2 h-2 rounded-full bg-gold/50" />
                    <div className="w-2 h-2 rounded-full bg-gold/50" />
                </div>
                <FlipCard value={timeLeft.mins} label="Mins" />
                <div className="flex flex-col gap-3 pb-6">
                    <div className="w-2 h-2 rounded-full bg-gold/50" />
                    <div className="w-2 h-2 rounded-full bg-gold/50" />
                </div>
                <FlipCard value={timeLeft.secs} label="Secs" />
            </div>

            {isComplete && (
                <div className="text-center animate-pulse">
                    <span className="text-gold font-black uppercase tracking-[0.3em] text-sm">
                        Event Has Started!
                    </span>
                </div>
            )}
        </div>
    );
}
