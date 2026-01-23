"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const loaderRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(loaderRef.current, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: "expo.inOut",
                    onComplete
                });
            }
        });

        // Entrance
        tl.fromTo(logoRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: "power4.out" }
        )
            .fromTo(textRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
                "-=1"
            );

        // Progress mock (tied to actual duration for effect)
        const progressObj = { value: 0 };
        gsap.to(progressObj, {
            value: 100,
            duration: 2.5,
            ease: "none",
            onUpdate: () => setProgress(Math.round(progressObj.value)),
        });

        // Exit sequence
        tl.to(logoRef.current, {
            scale: 1.1,
            opacity: 0,
            filter: "blur(20px)",
            duration: 0.8,
            ease: "power2.in"
        }, "+=1");

    }, [onComplete]);

    return (
        <div
            ref={loaderRef}
            className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center overflow-hidden"
        >
            <div ref={logoRef} className="relative w-32 h-32 md:w-48 md:h-48 mb-12">
                <Image
                    src="/brand/AFLEWO-LOGO-1-Photoroom.svg"
                    alt="AFLEWO Logo"
                    fill
                    className="object-contain brightness-0 invert"
                />
            </div>

            <div ref={textRef} className="space-y-4 text-center">
                <div className="flex items-center gap-4 text-gold font-black uppercase tracking-[0.5em] text-[10px] md:text-xs">
                    <span>Uniting</span>
                    <span>•</span>
                    <span>Worshipping</span>
                    <span>•</span>
                    <span>Leading</span>
                </div>

                <div className="relative w-48 h-[1px] bg-white/10 mx-auto overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gold transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                    {progress}% Loading the sound of heaven
                </div>
            </div>

            {/* Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full animate-breathe" />
        </div>
    );
}
