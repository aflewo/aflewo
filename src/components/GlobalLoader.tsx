"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import loadingData from "@/../context/lottie/Loading.json";

interface LottieLoaderProps {
    /** Text shown below the animation */
    label?: string;
    /** Full-screen overlay when true, inline block when false */
    fullScreen?: boolean;
    /** Width of the Lottie player (px) */
    size?: number;
}

/**
 * GlobalLoader — unified Lottie-powered loading component used across
 * the entire AFLEWO site. Replace any existing spinner/placeholder with this.
 */
export default function GlobalLoader({ label, fullScreen = true, size = 180 }: LottieLoaderProps) {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center gap-4">
                <div style={{ width: size, height: size }}>
                    <Lottie
                        animationData={loadingData}
                        loop={true}
                        autoplay={true}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
                {label && (
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                        {label}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div style={{ width: size, height: size }}>
                <Lottie
                    animationData={loadingData}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            {label && (
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                    {label}
                </p>
            )}
        </div>
    );
}
