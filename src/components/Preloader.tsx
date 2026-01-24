"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import Image from "next/image";

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    life: number;
}

function ParticleCanvas({ isActive }: { isActive: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>();

    const createParticle = useCallback((): Particle => {
        return {
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5 - 0.3,
            opacity: Math.random() * 0.5 + 0.2,
            life: Math.random() * 100 + 50
        };
    }, []);

    useEffect(() => {
        if (!isActive) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < 50; i++) {
            particlesRef.current.push(createParticle());
        }

        const animate = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((particle, index) => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.life -= 1;

                if (particle.life <= 0 || particle.y < -10 || particle.x < -10 || particle.x > canvas.width + 10) {
                    particlesRef.current[index] = createParticle();
                    particlesRef.current[index].y = canvas.height + 10;
                    return;
                }

                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 2
                );
                gradient.addColorStop(0, `hsla(45, 100%, 50%, ${particle.opacity})`);
                gradient.addColorStop(1, `hsla(45, 100%, 50%, 0)`);

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            particlesRef.current = [];
        };
    }, [isActive, createParticle]);

    if (!isActive) return null;

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ opacity: 0.6 }}
        />
    );
}

function TypewriterText({ text, delay = 0, speed = 50 }: { text: string; delay?: number; speed?: number }) {
    const [displayText, setDisplayText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex <= text.length) {
                    setDisplayText(text.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    setIsComplete(true);
                    clearInterval(interval);
                }
            }, speed);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, delay, speed]);

    return (
        <span className="relative">
            {displayText}
            {!isComplete && (
                <span className="animate-pulse ml-0.5 inline-block w-[2px] h-[1em] bg-gold align-middle" />
            )}
        </span>
    );
}

function SVGPathAnimation({ isActive }: { isActive: boolean }) {
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (!isActive || !pathRef.current) return;

        const path = pathRef.current;
        const length = path.getTotalLength();

        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 1
        });

        gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.inOut",
            delay: 0.5
        });
    }, [isActive]);

    return (
        <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 0 20px hsla(45, 100%, 50%, 0.3))" }}
        >
            <path
                ref={pathRef}
                d="M100,20 L120,80 L180,100 L120,120 L100,180 L80,120 L20,100 L80,80 Z"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0"
            />
            <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(45, 100%, 50%)" />
                    <stop offset="100%" stopColor="hsl(45, 100%, 70%)" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const loaderRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [showParticles, setShowParticles] = useState(true);
    const [currentPhrase, setCurrentPhrase] = useState(0);

    const phrases = [
        "Uniting",
        "Worshipping",
        "Leading",
        "Rising"
    ];

    useEffect(() => {
        const phraseInterval = setInterval(() => {
            setCurrentPhrase(prev => (prev + 1) % phrases.length);
        }, 800);

        return () => clearInterval(phraseInterval);
    }, [phrases.length]);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(glowRef.current,
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
        );

        tl.fromTo(logoRef.current,
            { scale: 0.6, opacity: 0, rotateY: -30 },
            { scale: 1, opacity: 1, rotateY: 0, duration: 1.5, ease: "expo.out" },
            "-=1"
        );

        tl.fromTo(textRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
            "-=0.8"
        );

        gsap.to(glowRef.current, {
            scale: 1.1,
            opacity: 0.8,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        const progressObj = { value: 0 };
        gsap.to(progressObj, {
            value: 100,
            duration: 3,
            ease: "power1.inOut",
            onUpdate: () => setProgress(Math.round(progressObj.value)),
            onComplete: () => {
                setShowParticles(false);

                const exitTl = gsap.timeline({
                    onComplete
                });

                exitTl.to(logoRef.current, {
                    scale: 1.2,
                    opacity: 0,
                    filter: "blur(30px)",
                    duration: 0.8,
                    ease: "power2.in"
                });

                exitTl.to(textRef.current, {
                    y: -30,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.in"
                }, "-=0.6");

                exitTl.to(loaderRef.current, {
                    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                    duration: 1,
                    ease: "expo.inOut"
                }, "-=0.3");
            }
        });

        return () => {
            tl.kill();
        };
    }, [onComplete]);

    return (
        <div
            ref={loaderRef}
            className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center overflow-hidden"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
        >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%">
                    <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
            </div>

            <ParticleCanvas isActive={showParticles} />

            <div
                ref={glowRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gold/10 blur-[120px] rounded-full"
            />

            <div ref={logoRef} className="relative w-32 h-32 md:w-48 md:h-48 mb-12" style={{ perspective: "1000px" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <SVGPathAnimation isActive={true} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src="/brand/AFLEWO LOGO 1-Photoroom.png"
                        alt="AFLEWO Logo"
                        width={120}
                        height={120}
                        className="object-contain md:w-[160px] md:h-[160px]"
                        priority
                    />
                </div>
            </div>

            <div ref={textRef} className="space-y-6 text-center relative z-10">
                <div className="flex items-center justify-center gap-4 text-gold font-black uppercase tracking-[0.5em] text-[10px] md:text-xs min-h-[24px]">
                    <span className="opacity-50">•</span>
                    <span className="min-w-[100px]">
                        <TypewriterText
                            text={phrases[currentPhrase]}
                            speed={80}
                            key={currentPhrase}
                        />
                    </span>
                    <span className="opacity-50">•</span>
                </div>

                <div className="relative w-48 md:w-64 h-[2px] bg-white/10 mx-auto overflow-hidden rounded-full">
                    <div
                        ref={progressBarRef}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold via-gold to-amber-300 rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    />
                    <div
                        className="absolute inset-y-0 left-0 bg-gold blur-sm rounded-full"
                        style={{ width: `${progress}%`, opacity: 0.5 }}
                    />
                </div>

                <div className="space-y-2">
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                        {progress}%
                    </div>
                    <div className="text-[10px] font-medium text-white/20 uppercase tracking-widest">
                        Loading AFLEWO
                    </div>
                </div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center space-y-4">
                <div className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
                    Africa Let's Worship
                </div>
                <div className="text-[8px] font-medium text-white/10 uppercase tracking-widest">
                    Since 2004
                </div>
            </div>

            <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-gold/5 to-transparent opacity-50 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-emerald/5 to-transparent opacity-50 blur-3xl" />
        </div>
    );
}
