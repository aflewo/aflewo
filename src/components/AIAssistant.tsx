"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import SvgIcon from "@/components/ui/SvgIcon";
import fireMicData from "@/../context/lottie/Fire Mic Animation - LIstening_AI.json";
import aiChatData from "@/../context/inspo/AI Chat.json";
import { useAuth } from "@/app/(dashboard)/AuthContext";
import { useBandwidth, useOfflineManifest } from "@/hooks/useNetworkStatus";

// ─── Wallpaper Presets ────────────────────────────────────────────────────────
const WALLPAPER_PRESETS = [
    { id: "default", label: "Default", value: null, preview: "hsl(20 14% 5%)" },
    { id: "cosmos", label: "Cosmos", value: "linear-gradient(160deg,#0f0c29,#302b63,#24243e)", preview: "#302b63" },
    { id: "gold", label: "Gold Dust", value: "linear-gradient(160deg,#1a0e00,#3d2500,#1a0e00)", preview: "#3d2500" },
    { id: "forest", label: "Forest", value: "linear-gradient(160deg,#0a1a0f,#0d2f18,#071208)", preview: "#0d2f18" },
    { id: "nebula", label: "Nebula", value: "linear-gradient(160deg,#1a0020,#2d0035,#0d0015)", preview: "#2d0035" },
    { id: "ocean", label: "Ocean", value: "linear-gradient(160deg,#000d1a,#00243d,#000d1a)", preview: "#00243d" },
];
const WP_STORAGE_KEY = "aflewo_chat_wallpaper";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
}

interface NavigationAction {
    type: "navigate_to" | "scroll_to";
    target: string;
}

// --- Island State Machine Types ---
// Valid states: IDLE | CHAT_ACTIVE | MAP_VIEW | OFFLINE_TICKET | LIVE_WAVEFORM
// Only one state active at a time. Transitions are atomic.
type IslandMode = "IDLE" | "CHAT_ACTIVE" | "MAP_VIEW" | "OFFLINE_TICKET" | "LIVE_WAVEFORM";

interface IslandPayload {
    lat?: number;
    lng?: number;
    label?: string;
    items?: string[];
}

interface IslandState {
    mode: IslandMode;
    payload: IslandPayload | null;
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Web Speech API declarations Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

// ─── Send icon SVG ────────────────────────────────────────────────────────────
function SendIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.1391 2.95907L7.10914 5.95907C1.03914 7.98907 1.03914 11.2991 7.10914 13.3191L9.78914 14.2091L10.6791 16.8891C12.6991 22.9591 16.0191 22.9591 18.0391 16.8891L21.0491 7.86907C22.3891 3.81907 20.1891 1.60907 16.1391 2.95907ZM16.4591 8.33907L12.6591 12.1591C12.5091 12.3091 12.3191 12.3791 12.1291 12.3791C11.9391 12.3791 11.7491 12.3091 11.5991 12.1591C11.3091 11.8691 11.3091 11.3891 11.5991 11.0991L15.3991 7.27907C15.6891 6.98907 16.1691 6.98907 16.4591 7.27907C16.7491 7.56907 16.7491 8.04907 16.4591 8.33907Z" fill="currentColor" />
        </svg>
    );
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Close icon SVG Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function CloseIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Mic icon SVG Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function MicIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12,20a9,9,0,0,1-7-3.37,1,1,0,0,1,1.56-1.26,7,7,0,0,0,10.92,0A1,1,0,0,1,19,16.63,9,9,0,0,1,12,20Z" fill={active ? "hsl(42 92% 56%)" : "currentColor"} />
            <path d="M12,2A5,5,0,0,0,7,7v4a5,5,0,0,0,10,0V7A5,5,0,0,0,12,2Z" fill={active ? "hsl(42 92% 56%)" : "currentColor"} />
            <path d="M12,22a1,1,0,0,1-1-1V19a1,1,0,0,1,2,0v2A1,1,0,0,1,12,22Z" fill={active ? "hsl(42 92% 56%)" : "currentColor"} />
        </svg>
    );
}

// ─── Hyperlink & Context Parser ──────────────────────────────────────────────
const PAGE_DICTIONARY: Record<string, string> = {
    "media page": "/media",
    "about page": "/about",
    "testimonies page": "/testify",
    "testify page": "/testify",
    "join page": "/join",
    "stories page": "/stories",
    "alumni page": "/alumni",
    "chapters page": "/chapters",
    "sign in page": "/auth",
    "profile page": "/profile",
    "home page": "/"
};
const fuzzyRegex = new RegExp(`\\b(${Object.keys(PAGE_DICTIONARY).join("|")})\\b`, "gi");

function applyFuzzyLinks(text: string, baseIndex: number, onNavigate?: (url?: string) => void) {
    const parts = text.split(fuzzyRegex);
    return parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        const url = PAGE_DICTIONARY[lowerPart];
        if (url) {
            return (
                <Link
                    key={`fuzzy-${baseIndex}-${i}`}
                    href={url}
                    onClick={() => {
                        if (onNavigate) onNavigate(url);
                    }}
                    className="text-gold underline hover:text-gold/80 font-medium transition-all"
                >
                    {part}
                </Link>
            );
        }
        return part;
    });
}

function parseMessageContent(content: string, profile: any, onNavigate?: (url?: string) => void) {
    let replacedText = content;
    if (profile) {
        replacedText = replacedText
            .replace(/\[USER_ID\]/g, profile.id || "")
            .replace(/\[USER_UUID\]/g, profile.id || "")
            .replace(/\[USER_NAME\]/g, profile.full_name || "")
            .replace(/\[USER_EMAIL\]/g, profile.email || "")
            .replace(/\[USER_ROLE\]/g, profile.role || "");
    } else {
        replacedText = replacedText
            .replace(/\[USER_ID\]/g, "")
            .replace(/\[USER_UUID\]/g, "")
            .replace(/\[USER_NAME\]/g, "Guest")
            .replace(/\[USER_EMAIL\]/g, "")
            .replace(/\[USER_ROLE\]/g, "");
    }

    const parts: any[] = [];
    let lastIndex = 0;
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let matchCount = 0;

    while ((match = regex.exec(replacedText)) !== null) {
        const textBefore = replacedText.substring(lastIndex, match.index);
        if (textBefore) {
            parts.push(...applyFuzzyLinks(textBefore, matchCount++, onNavigate));
        }

        const linkText = match[1];
        const linkUrl = match[2];
        const isInternal = !linkUrl.startsWith("http") && !linkUrl.startsWith("//");

        if (isInternal) {
            parts.push(
                <Link
                    key={match.index}
                    href={linkUrl}
                    onClick={() => {
                        if (onNavigate) onNavigate(linkUrl);
                    }}
                    className="text-gold underline hover:text-gold/80 font-medium transition-all"
                >
                    {linkText}
                </Link>
            );
        } else {
            parts.push(
                <a
                    key={match.index}
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold underline hover:text-gold/80 font-medium transition-all"
                >
                    {linkText}
                </a>
            );
        }

        lastIndex = regex.lastIndex;
    }

    const textAfter = replacedText.substring(lastIndex);
    if (textAfter) {
        parts.push(...applyFuzzyLinks(textAfter, matchCount++, onNavigate));
    }

    return parts.length > 0 ? parts : applyFuzzyLinks(replacedText, matchCount, onNavigate);
}

// ─── Chat bubble ─────────────────────────────────────────────────────────────
function ChatBubble({ msg, onNavigate }: { msg: Message; onNavigate?: (url?: string) => void }) {
    const { profile } = useAuth();
    const isUser = msg.role === "user";
    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
        >
            <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isUser
                    ? "bg-gold/90 text-brown font-semibold rounded-br-sm"
                    : "bg-white/8 text-white/90 border border-white/10 rounded-bl-sm"
                    }`}
                style={{ backdropFilter: isUser ? undefined : "blur(8px)" }}
            >
                {parseMessageContent(msg.content, profile, onNavigate)}
            </div>
        </motion.div>
    );
}

// ─── Dynamic Suggestions Carousel ─────────────────────────────────────────────
function DynamicSuggestions({ suggestions, onSelect }: { suggestions: any[], onSelect: (prompt: string) => void }) {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (suggestions.length <= 3 || isHovered) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                let next = prev + 1;
                if (next >= suggestions.length) next = 1;
                return next;
            });
        }, 8000); // Rotate every 8 seconds

        return () => clearInterval(timer);
    }, [suggestions.length, isHovered]);

    if (!suggestions || suggestions.length === 0) return null;

    // Slot 1: Pinned priority item
    const pinned = suggestions[0];

    // Slots 2 and 3: Rotated items
    let visibleRotation = [];
    if (suggestions.length <= 3) {
        visibleRotation = suggestions.slice(1);
    } else {
        visibleRotation = [
            suggestions[currentIndex],
            suggestions[currentIndex + 1 >= suggestions.length ? 1 : currentIndex + 1]
        ];
    }

    const renderButton = (item: any) => (
        <motion.button
            key={item.id}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={() => onSelect(item.prompt)}
            className="bg-white/5 hover:bg-white/10 active:scale-95 border border-white/8 rounded-full px-2.5 py-1 text-[11px] text-white/80 transition-all flex items-center gap-1.5 cursor-pointer font-medium whitespace-nowrap"
        >
            <SvgIcon name={item.icon} size={11} className="text-gold flex-shrink-0" />
            <span>{item.label}</span>
        </motion.button>
    );

    return (
        <div
            className="flex flex-wrap gap-1.5 mt-1 px-1 justify-start"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {renderButton(pinned)}
            <AnimatePresence mode="popLayout">
                {visibleRotation.map(renderButton)}
            </AnimatePresence>
        </div>
    );
}

// --- Liquid Glass Island Sub-Component ---
// Renders as a flex-shrink-0 sub-header slot BELOW the panel header.
// This ensures voice controls are NEVER obstructed.
function LiquidGlassIsland({
    island,
    onDismiss,
    isFullscreen,
    onToggleFullscreen,
}: {
    island: IslandState;
    onDismiss: () => void;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
}) {
    if (island.mode === "IDLE" || island.mode === "CHAT_ACTIVE") return null;
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={island.mode}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 36 }}
                className="overflow-hidden flex-shrink-0 border-b border-white/8"
                style={{
                    background: "rgba(10, 8, 6, 0.6)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                }}
            >
                {/* Control row: label + expand + dismiss */}
                <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
                    <p className="text-[8px] font-black uppercase tracking-[0.28em] text-gold/60">
                        {island.mode === "MAP_VIEW" ? (island.payload?.label || "Venue Location") :
                         island.mode === "LIVE_WAVEFORM" ? "Live Audio" : "Saved Offline"}
                    </p>
                    <div className="flex items-center gap-1.5">
                        {island.mode === "MAP_VIEW" && (
                            <button
                                onClick={onToggleFullscreen}
                                className="text-white/30 hover:text-gold transition-colors"
                                aria-label={isFullscreen ? "Collapse map" : "Expand map fullscreen"}
                                title={isFullscreen ? "Collapse" : "Expand"}
                            >
                                {isFullscreen ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 14H10M10 14V20M10 14L3 21M20 10H14M14 10V4M14 10L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                ) : (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M14 10L21 3M21 3H15M21 3V9M10 14L3 21M3 21H9M3 21V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                )}
                            </button>
                        )}
                        <button onClick={onDismiss} className="text-white/25 hover:text-white/60 transition-colors" aria-label="Dismiss">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
                        </button>
                    </div>
                </div>

                {/* MAP VIEW */}
                {island.mode === "MAP_VIEW" && island.payload?.lat != null && island.payload?.lng != null && (
                    <motion.div key="map-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} className="px-3 pb-3">
                        <div
                            className="w-full rounded-xl overflow-hidden transition-all duration-500 relative"
                            style={{ height: isFullscreen ? "55vh" : 148, background: "rgba(0,0,0,0.3)" }}
                        >
                            <iframe
                                title={island.payload.label || "Venue map"}
                                src={`https://maps.google.com/maps?q=${island.payload.lat},${island.payload.lng}&z=15&output=embed`}
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: 12, opacity: 0.93 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                            
                            {/* Start Navigation Overlay Button */}
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center z-20 pointer-events-none">
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${island.payload.lat},${island.payload.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pointer-events-auto shadow-[0_4px_16px_rgba(212,175,55,0.25)] border border-gold/30 hover:border-gold hover:scale-105 active:scale-95 transition-all bg-black/60 backdrop-blur-md text-gold px-4 py-2 rounded-full font-black uppercase text-[10px] tracking-wider flex items-center gap-1.5"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" /></svg>
                                    Start Navigation
                                </a>
                            </div>
                        </div>
                        <p className="text-[8px] text-white/25 text-center mt-1 font-medium tracking-wide">
                            {island.payload.lat.toFixed(4)}, {island.payload.lng.toFixed(4)}
                        </p>
                    </motion.div>
                )}

                {/* LIVE WAVEFORM */}
                {island.mode === "LIVE_WAVEFORM" && (
                    <motion.div key="waveform-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} className="px-4 pb-4">
                        <div className="flex items-center gap-[3px] h-8">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <motion.div key={i} className="flex-1 rounded-full bg-gold/70" animate={{ scaleY: [0.2, 1, 0.3, 0.8, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }} style={{ originY: "center", height: "100%" }} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* OFFLINE TICKET */}
                {island.mode === "OFFLINE_TICKET" && island.payload?.items && (
                    <motion.div key="ticket-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} className="px-4 pb-4">
                        <div className="space-y-1.5">
                            {island.payload.items.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-gold/60 mt-1.5 flex-shrink-0" /><p className="text-[11px] text-white/80 leading-snug">{item}</p></div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

// --- AI Action Chips --- deep-link chips from suggestedActions payload
function ActionChips({
    actions,
    onAction,
}: {
    actions: { label: string; icon: string; action: { type: string; target: string } }[];
    onAction: (action: { type: string; target: string }) => void;
}) {
    if (!actions || actions.length === 0) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28 }}
            className="flex flex-wrap gap-1.5 px-1 mt-1"
        >
            {actions.map((item) => (
                <button
                    key={item.label}
                    onClick={() => onAction(item.action)}
                    className="flex items-center gap-1.5 bg-gold/10 hover:bg-gold/20 active:scale-95 border border-gold/25 rounded-full px-2.5 py-1 text-[11px] text-gold font-bold transition-all whitespace-nowrap"
                >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {item.label}
                </button>
            ))}
        </motion.div>
    );
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Main AI Assistant Component Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export default function AIAssistant({ onNavigate }: { onNavigate?: (url?: string) => void }) {
    const router = useRouter();
    const pathname = usePathname();
    const { profile } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Habari! I'm here to help you explore AFLEWO: our events, chapters, how to join, or anything else. What can I do for you?",
            timestamp: new Date(),
        },
    ]);

    // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Liquid Glass Island state machine Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    // Atomic state: only one mode can be active at a time.
    const [islandState, setIslandState] = useState<IslandState>({ mode: "IDLE", payload: null });
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);
    const [suggestedActions, setSuggestedActions] = useState<{ label: string; icon: string; action: { type: string; target: string } }[]>([]);
    const [hasVoiceSupport, setHasVoiceSupport] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState("");
    const [isNavigating, setIsNavigating] = useState<{ type: string; target: string } | null>(null);
    const [activeSystemMessage, setActiveSystemMessage] = useState<string | null>(null);
    const [showSignInPill, setShowSignInPill] = useState(false);
    const [fabIsIdle, setFabIsIdle] = useState(false);
    // Voice is muted by default Ã¢â‚¬â€ users must opt-in to enable TTS
    const [isMuted, setIsMuted] = useState(true);
    const [isHeroVisible, setIsHeroVisible] = useState(true);
    const [chatWallpaper, setChatWallpaper] = useState<string | null>(null);
    const [showPersonalize, setShowPersonalize] = useState(false);
    const aiChatLottieRef = useRef<LottieRefCurrentProps>(null);

    // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Network awareness Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    const { isLowBandwidth, isOnline } = useBandwidth();
    const { saveManifest } = useOfflineManifest();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const hasSentRef = useRef(false);
    const wpFileInputRef = useRef<HTMLInputElement>(null);

    // Check for voice support
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            setHasVoiceSupport(!!SR);
            synthRef.current = window.speechSynthesis || null;
        }
    }, []);

    // Load persisted wallpaper
    useEffect(() => {
        if (typeof window === "undefined") return;
        const saved = localStorage.getItem(WP_STORAGE_KEY);
        if (saved) setChatWallpaper(saved === "null" ? null : saved);
    }, []);

    // Delay show sign-in pill to draw focus when chat is opened
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen) {
            timer = setTimeout(() => {
                setShowSignInPill(true);
            }, 1000);
        } else {
            setShowSignInPill(false);
        }
        return () => clearTimeout(timer);
    }, [isOpen]);

    // Activity-based FAB opacity fade Ã¢â‚¬â€ mirrors Nav FAB behaviour
    useEffect(() => {
        if (isOpen) {
            setFabIsIdle(false);
            return;
        }
        const idleTimer = setTimeout(() => setFabIsIdle(true), 4000);
        const resetIdle = () => {
            setFabIsIdle(false);
            clearTimeout(idleTimer);
        };
        window.addEventListener("mousemove", resetIdle, { passive: true });
        window.addEventListener("touchstart", resetIdle, { passive: true });
        return () => {
            clearTimeout(idleTimer);
            window.removeEventListener("mousemove", resetIdle);
            window.removeEventListener("touchstart", resetIdle);
        };
    }, [isOpen]);

    // Hide FAB when hero section is visible Ã¢â‚¬â€ mirrors Nav FAB behaviour exactly
    useEffect(() => {
        const heroEl = document.getElementById("hero") || document.querySelector("[data-hero]");
        if (!heroEl) { setIsHeroVisible(false); return; }
        const obs = new IntersectionObserver(
            ([entry]) => setIsHeroVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        obs.observe(heroEl);
        return () => obs.disconnect();
    }, []);

    // Auto-scroll to latest message or when thinking
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isThinking]);

    // Auto-scroll to bottom only when listening STARTS, preventing robotic snap on exit
    useEffect(() => {
        if (isListening) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isListening]);

    // Auto-focus input when panel opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // ------------------------------------ Navigation action executor ---------------------------------------------
    const executeAction = useCallback((action: NavigationAction) => {
        if (action.type === "navigate_to") {
            // BUG FIX: if already on the target page, abort navigation entirely
            // to prevent the isTransitioning overlay from getting permanently stuck.
            if (pathname === action.target) {
                setIsNavigating(null);
                setActiveSystemMessage(null);
                return;
            }
            if (onNavigate) onNavigate();
            router.push(action.target);
        } else if (action.type === "scroll_to") {
            const el = document.getElementById(action.target);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                // Fallback: if section not found on current page, navigate home and scroll
                if (onNavigate) onNavigate();
                router.push(`/#${action.target}`);
            }
        }
    }, [router, onNavigate, pathname]);

    // ------------------------------------ Text-to-speech ---------------------------------------------
    const speak = useCallback((text: string) => {
        if (isMuted) return;
        if (!synthRef.current) return;
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-KE";
        utterance.rate = 0.95;
        utterance.pitch = 1;
        // Prefer a natural voice if available
        const voices = synthRef.current.getVoices();
        const preferred = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("neural"))
            || voices.find(v => v.lang.startsWith("en-KE"))
            || voices.find(v => v.lang.startsWith("en-ZA"))
            || voices.find(v => v.lang.startsWith("en"));
        if (preferred) utterance.voice = preferred;
        synthRef.current.speak(utterance);
    }, []);

    // ------------------------------------ Send message to backend ---------------------------------------------
    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isThinking) return;

        const userMsg: Message = {
            id: `u-${Date.now()}`,
            role: "user",
            content: text.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setVoiceTranscript("");
        setIsThinking(true);

        try {
            const history = [...messages, userMsg].map(m => ({
                role: m.role,
                content: m.content,
            }));

            const res = await fetch("/api/assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: history,
                    currentPath: pathname,
                    lowBandwidth: isLowBandwidth,
                }),
            });

            const data = await res.json();

            // Cache any logistical info offline for use without a connection
            if (data.offlineManifest) {
                saveManifest(data.offlineManifest);
            }

            // Dispatch island state from AI trigger (atomic — one state at a time)
            if (data.islandTrigger) {
                const trigger = data.islandTrigger;
                if (trigger.mode === "map" && trigger.payload) {
                    setIslandState({ mode: "MAP_VIEW", payload: trigger.payload });
                } else if (trigger.mode === "waveform") {
                    setIslandState({ mode: "LIVE_WAVEFORM", payload: null });
                } else if (trigger.mode === "ticket") {
                    // Ticket uses the offline manifest items as payload
                    if (data.offlineManifest?.items) {
                        setIslandState({ mode: "OFFLINE_TICKET", payload: { items: data.offlineManifest.items } });
                    }
                }
            }

            // Parse suggestedActions from AI response — these are deep-link action chips
            if (Array.isArray(data.suggestedActions) && data.suggestedActions.length > 0) {
                setSuggestedActions(data.suggestedActions);
            } else {
                setSuggestedActions([]);
            };

            const assistantMsg: Message = {
                id: `a-${Date.now()}`,
                role: "assistant",
                content: data.message || "I'm here — could you ask that again?",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMsg]);

            // Speak the response
            speak(assistantMsg.content);

            // Execute navigation action if present
            if (data.action) {
                const isScroll = data.action.type === "scroll_to";

                // Show visual overlay indicator
                setIsNavigating({
                    type: data.action.type,
                    target: data.action.target
                });

                // Show dynamic temporary system status
                setActiveSystemMessage(
                    isScroll
                        ? `Scrolling to ${data.action.target}`
                        : `Opening ${data.action.target.replace("/", "") || "home"} page`
                );

                setTimeout(() => {
                    executeAction(data.action);
                    setIsNavigating(null);

                    // Show finished temporary state
                    setActiveSystemMessage(
                        isScroll
                            ? `Arrived at ${data.action.target}`
                            : `Opened ${data.action.target.replace("/", "") || "home"} page`
                    );

                    // Clear the message to trigger ease-out animation
                    setTimeout(() => {
                        setActiveSystemMessage(null);
                    }, 1500);
                }, 1600);
            }
        } catch {
            const errMsg: Message = {
                id: `e-${Date.now()}`,
                role: "assistant",
                content: "Something went wrong, please try again.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setIsThinking(false);
        }
    }, [messages, isThinking, speak, executeAction]);

    // ------------------------------------ Voice recognition ---------------------------------------------
    const startListening = useCallback(() => {
        if (!hasVoiceSupport || isListening) return;

        hasSentRef.current = false;

        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SR();
        recognition.lang = "en-KE";
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
            lottieRef.current?.play();
        };

        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((r: any) => r[0].transcript)
                .join("");
            setVoiceTranscript(transcript);

            if (event.results[event.results.length - 1].isFinal && !hasSentRef.current) {
                hasSentRef.current = true;
                setIsListening(false);
                lottieRef.current?.stop();
                sendMessage(transcript);
            }
        };

        recognition.onerror = () => {
            setIsListening(false);
            lottieRef.current?.stop();
        };

        recognition.onend = () => {
            setIsListening(false);
            lottieRef.current?.stop();
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [hasVoiceSupport, isListening, sendMessage]);

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop();
        setIsListening(false);
        lottieRef.current?.stop();
    }, []);

    const handleNewChat = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.cancel();
        }
        stopListening();
        setMessages([
            {
                id: `welcome-${Date.now()}`,
                role: "assistant",
                content: "Habari! I'm here to help you explore AFLEWO: our events, chapters, how to join, or anything else. What can I do for you?",
                timestamp: new Date(),
            },
        ]);
        setInputText("");
        setVoiceTranscript("");
    }, [stopListening]);

    // ------------------------------------ Input key handler ---------------------------------------------
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputText);
        }
    };

    // ------------------------------------ Render ---------------------------------------------
    return (
        <>
            {/* -------------------- Floating Trigger Button -------------------- */}
            <AnimatePresence>
                {!isOpen && !isHeroVisible && (
                    <motion.button
                        key="fab"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: fabIsIdle ? 0.28 : 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25, opacity: { duration: 1.2, ease: "easeInOut" } }}
                        onClick={() => { setIsOpen(true); setFabIsIdle(false); }}
                        aria-label="Open assistant"
                        className="fixed bottom-8 right-8 z-[150] w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(212,175,55,0.15)] border border-white/10 hover:border-gold/40 cursor-pointer overflow-hidden transition-all duration-300 group"
                        style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)"
                        }}
                        whileHover={{ scale: 1.08, opacity: 1 }}
                        whileTap={{ scale: 0.94 }}
                    >
                        {/* Premium Glossy Inset Ring */}
                        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/20 to-transparent z-10 pointer-events-none" />

                        {/* Hover Ping Glow */}
                        <div className="absolute inset-0 rounded-full bg-gold transition-all duration-1000 ease-out opacity-0 group-hover:opacity-20 group-hover:animate-ping z-0 pointer-events-none" />

                        {/* Centered Icon */}
                        <div className="relative z-20 flex items-center justify-center">
                            <SvgIcon name="search-status-1" size={26} className="text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* -------------------- Chat Panel -------------------- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="fixed bottom-8 right-8 z-[150] w-[360px] max-w-[calc(100vw-2rem)] rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)] border border-white/10"
                        style={{
                            background: "hsl(20 14% 5% / 0.95)",
                            backdropFilter: "blur(32px)",
                            WebkitBackdropFilter: "blur(32px)",
                            maxHeight: "80vh",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Header is always first — island is always BELOW it, never overlapping voice controls */}

                        {/* -------------------- Panel Header -------------------- */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                {/* AI Chat Lottie avatar */}
                                <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center">
                                    <Lottie
                                        lottieRef={aiChatLottieRef}
                                        animationData={aiChatData}
                                        loop={true}
                                        autoplay={true}
                                        style={{ width: 40, height: 40 }}
                                    />
                                </div>
                                <div>
                                    <p className="text-white font-black text-sm tracking-tight">AFLEWO Chatbox</p>
                                    <p className="text-white/40 text-[10px] font-medium tracking-wider uppercase">
                                        {isListening ? "Listening..." : isThinking ? "Thinking..." : "Ask me anything!"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {/* Mute TTS toggle */}
                                <button
                                    onClick={() => {
                                        setIsMuted(m => !m);
                                        if (!isMuted) synthRef.current?.cancel();
                                    }}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isMuted
                                        ? "text-white/25 bg-white/5 hover:bg-white/10"
                                        : "text-white/40 hover:text-white hover:bg-white/10"
                                        }`}
                                    title={isMuted ? "Unmute voice" : "Mute voice"}
                                    aria-label={isMuted ? "Unmute voice" : "Mute voice"}
                                >
                                    {isMuted ? (
                                        <svg width="16" height="16" viewBox="-3.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                <g transform="translate(-156.000000, -309.000000)" fill="currentColor">
                                                    <path d="M169,335 C167.061,335 165.236,334.362 163.716,333.318 L162.31,334.742 C163.944,335.953 165.892,336.765 168,336.955 L168,339 L167,339 C166.448,339 166,339.448 166,340 C166,340.553 166.448,341 167,341 L171,341 C171.552,341 172,340.553 172,340 C172,339.448 171.552,339 171,339 L170,339 L170,336.955 C174.938,336.51 179.117,332.799 180,328 L178,328 C177.089,332.007 173.282,335 169,335 L169,335 Z M176,326 L176,320.739 L164.735,331.515 C165.918,332.432 167.386,333 169,333 C172.866,333 176,329.866 176,326 L176,326 Z M160.047,328.145 L160,328 L158,328 C158.109,328.596 158.271,329.175 158.478,329.733 L160.047,328.145 L160.047,328.145 Z M179.577,312.013 L155.99,334.597 L157.418,336.005 L181.014,313.433 L179.577,312.013 L179.577,312.013 Z M169,309 C165.134,309 162,312.134 162,316 L161.997,326.309 L175.489,313.401 C174.456,310.825 171.946,309 169,309 L169,309 Z"></path>
                                                </g>
                                            </g>
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="-5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                <g transform="translate(-107.000000, -309.000000)" fill="currentColor">
                                                    <path d="M118,333 C121.866,333 125,329.866 125,326 L125,316 C125,312.134 121.866,309 118,309 C114.134,309 111,312.134 111,316 L111,326 C111,329.866 114.134,333 118,333 L118,333 Z M129,328 L127,328 C126.089,332.007 122.282,335 118,335 C113.718,335 109.911,332.007 109,328 L107,328 C107.883,332.799 112.063,336.51 117,336.955 L117,339 L116,339 C115.448,339 115,339.448 116,341 L120,341 C120.552,341 121,340.553 121,340 C121,339.448 120.552,339 120,339 L119,339 L119,336.955 C123.937,336.51 128.117,332.799 129,328 L129,328 Z"></path>
                                                </g>
                                            </g>
                                        </svg>
                                    )}
                                </button>
                                {/* Personalize / Wallpaper */}
                                <button
                                    onClick={() => setShowPersonalize(p => !p)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${showPersonalize ? "text-gold bg-gold/10" : "text-white/40 hover:text-white hover:bg-white/10"
                                        }`}
                                    title="Personalize chat"
                                    aria-label="Personalize chat"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.7209 7.34884C15.7209 8.37634 14.888 9.2093 13.8605 9.2093C12.833 9.2093 12 8.37634 12 7.34884C12 6.32133 12.833 5.48837 13.8605 5.48837C14.888 5.48837 15.7209 6.32133 15.7209 7.34884Z" fill="currentColor"/>
                                        <path d="M22 7.75375C22.0001 7.38007 22.0002 7.11208 21.9628 6.8759C21.8273 6.02056 21.3378 5.28723 20.6478 4.82926C20.5697 4.7774 20.4713 4.84508 20.4838 4.93803V4.93803C20.5838 5.6818 20.6011 6.56503 20.604 7.5288C20.6045 7.60793 20.6046 7.70163 20.6046 7.81395V7.97276V8.14596V15.854C20.6046 15.912 20.6046 15.9697 20.6046 16.0272V16.186C20.6046 16.2985 20.6045 16.3923 20.604 16.4715C20.6011 17.4352 20.5838 18.3183 20.4838 19.062V19.062C20.4713 19.1549 20.5697 19.2226 20.6478 19.1707C21.3378 18.7128 21.8273 17.9794 21.9628 17.1241C22.0002 16.8879 22.0001 16.6199 22 16.2463L22 16.186V7.81395L22 7.75375Z" fill="currentColor"/>
                                        <path d="M3.39537 7.81395C3.39537 7.70183 3.3955 7.60826 3.39595 7.52923C3.39614 7.46877 3.39638 7.40864 3.39669 7.34883C3.40139 6.45503 3.42246 5.63526 3.5162 4.93803V4.93803C3.5287 4.84508 3.43032 4.7774 3.35218 4.82926C2.66215 5.28723 2.17271 6.02056 2.03724 6.8759C1.99984 7.11207 1.99991 7.38007 2.00001 7.75373L2.00002 7.81395V16.186L2.00001 16.2463C1.99991 16.6199 1.99984 16.8879 2.03724 17.1241C2.17271 17.9794 2.66215 18.7128 3.35218 19.1707C3.43032 19.2226 3.5287 19.1549 3.5162 19.062V19.062C3.42246 18.3647 3.40139 17.545 3.39669 16.6512C3.39638 16.5913 3.39614 16.5312 3.39595 16.4708C3.3955 16.3917 3.39537 16.2982 3.39537 16.186V16.0399C3.39535 15.9782 3.39536 15.9162 3.39536 15.854L3.39537 8.22802L3.39536 8.14598C3.39536 8.08375 3.39535 8.02179 3.39537 7.96011V7.81395Z" fill="currentColor"/>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M16.0853 2.10839C15.2789 1.99997 14.2535 1.99998 12.9813 2H11.0187C9.74655 1.99998 8.72114 1.99997 7.91466 2.10839C7.07735 2.22097 6.37235 2.4618 5.81243 3.02172C5.25251 3.58164 5.01168 4.28664 4.89911 5.12395C4.79068 5.93043 4.79069 6.95585 4.79071 8.22802V15.772C4.79069 17.0442 4.79068 18.0696 4.89911 18.876C5.01168 19.7134 5.25251 20.4184 5.81243 20.9783C6.37235 21.5382 7.07735 21.779 7.91466 21.8916C8.72114 22 9.74655 22 11.0187 22H12.9813C14.2534 22 15.2789 22 16.0853 21.8916C16.9226 21.779 17.6276 21.5382 18.1876 20.9783C18.7475 20.4184 18.9883 19.7134 19.1009 18.876C19.2093 18.0696 19.2093 17.0441 19.2093 15.772V8.22803C19.2093 6.95585 19.2093 5.93044 19.1009 5.12395C18.9883 4.28664 18.7475 3.58164 18.1876 3.02172C17.6276 2.4618 16.9226 2.22097 16.0853 2.10839ZM16.8085 16.6302L17.7946 17.6708C17.8134 17.134 17.8139 16.4954 17.8139 15.7209V8.27907C17.8139 6.9438 17.8125 6.01253 17.718 5.30988C17.6262 4.6273 17.4584 4.26584 17.2009 4.00838C16.9435 3.75093 16.582 3.58307 15.8994 3.4913C15.1968 3.39683 14.2655 3.39535 12.9302 3.39535H11.0698C9.7345 3.39535 8.80324 3.39683 8.10059 3.4913C7.41801 3.58307 7.05654 3.75093 6.79909 4.00838C6.54164 4.26584 6.37378 4.6273 6.28201 5.30988C6.18754 6.01253 6.18606 6.9438 6.18606 8.27907V12.904L6.18936 12.9007C7.10618 11.96 8.52458 12.0245 9.37271 13.019L12.313 16.4668C12.5485 16.7429 12.8584 16.7555 13.0961 16.5596L13.3005 16.3912C14.3764 15.5045 15.8517 15.6204 16.8085 16.6302Z" fill="currentColor"/>
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNewChat}
                                    className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                    title="New Chat"
                                    aria-label="New Chat"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        stopListening();
                                        synthRef.current?.cancel();
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                    aria-label="Close"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* -- Map / Island Sub-Header (pinned below controls, expands downward) -- */}
                        <LiquidGlassIsland
                            island={islandState}
                            onDismiss={() => { setIslandState({ mode: "IDLE", payload: null }); setIsMapFullscreen(false); }}
                            isFullscreen={isMapFullscreen}
                            onToggleFullscreen={() => setIsMapFullscreen(f => !f)}
                        />

                        {/* -- Personalize Drawer -- */}
                        <AnimatePresence>
                            {showPersonalize && (
                                <motion.div
                                    key="personalize-drawer"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                                    className="overflow-hidden flex-shrink-0 border-b border-white/8"
                                >
                                    <div className="px-5 py-4 space-y-3">
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">Wallpaper</p>
                                        <div className="flex flex-wrap gap-2">
                                            {WALLPAPER_PRESETS.map(preset => (
                                                <button
                                                    key={preset.id}
                                                    onClick={() => {
                                                        const val = preset.value;
                                                        setChatWallpaper(val);
                                                        localStorage.setItem(WP_STORAGE_KEY, val ?? "null");
                                                    }}
                                                    title={preset.label}
                                                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex-shrink-0 ${chatWallpaper === preset.value
                                                        ? "border-gold scale-110 shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                                                        : "border-white/10 hover:border-white/30"
                                                        }`}
                                                    style={{ background: preset.value ?? preset.preview }}
                                                />
                                            ))}
                                            {/* Custom image upload */}
                                            <button
                                                onClick={() => wpFileInputRef.current?.click()}
                                                title="Custom image"
                                                className="w-8 h-8 rounded-full border-2 border-dashed border-white/20 hover:border-gold/50 transition-all flex items-center justify-center text-white/30 hover:text-gold"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                            </button>
                                        </div>
                                        <input
                                            ref={wpFileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                const reader = new FileReader();
                                                reader.onload = (ev) => {
                                                    const dataUrl = ev.target?.result as string;
                                                    const val = `url(${dataUrl})`;
                                                    setChatWallpaper(val);
                                                    try { localStorage.setItem(WP_STORAGE_KEY, val); } catch { /* quota */ }
                                                };
                                                reader.readAsDataURL(file);
                                            }}
                                        />
                                        {chatWallpaper !== null && (
                                            <button
                                                onClick={() => { setChatWallpaper(null); localStorage.setItem(WP_STORAGE_KEY, "null"); }}
                                                className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors"
                                            >
                                                Reset to default
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Offline / Low-Bandwidth Status Banner Ã¢â€â‚¬Ã¢â€â‚¬ */}
                        <AnimatePresence>
                            {!isOnline && (
                                <motion.div
                                    key="offline-banner"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden flex-shrink-0 bg-red-950/60 border-b border-red-500/20"
                                >
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 text-center py-2">
                                        You are offline. Showing cached info only.
                                    </p>
                                </motion.div>
                            )}
                            {isOnline && isLowBandwidth && (
                                <motion.div
                                    key="lowbw-banner"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden flex-shrink-0 bg-amber-950/50 border-b border-amber-500/20"
                                >
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400/80 text-center py-2">
                                        Slow connection - minimal replies active
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Messages Area Ã¢â€â‚¬Ã¢â€â‚¬ */}
                        <div
                            className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar flex flex-col gap-2.5"
                            style={{
                                minHeight: 0,
                                backgroundImage: chatWallpaper?.startsWith("url(") ? chatWallpaper : chatWallpaper ?? undefined,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            {messages.map((msg, index) => {
                                const isLast = index === messages.length - 1;
                                const isAssistant = msg.role === "assistant";
                                const isSystem = msg.role === "system";

                                if (isSystem) {
                                    return (
                                        <div key={msg.id} className="text-center my-1">
                                            <span className="inline-block px-3 py-1 bg-white/5 border border-white/8 rounded-full text-[11px] text-white/50 tracking-tight">
                                                {msg.content}
                                            </span>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={msg.id} className="space-y-2">
                                        <ChatBubble msg={msg} onNavigate={(url) => {
                                            if (url && pathname === url) return;
                                            if (onNavigate) onNavigate(url);
                                        }} />

                                        {/* Contextual suggestions + AI action chips under last assistant message */}
                                        {isLast && isAssistant && !isThinking && !isListening && (
                                            <div className="flex flex-col gap-2">
                                                {/* Deep-link action chips from AI suggestedActions payload */}
                                                <AnimatePresence>
                                                    {suggestedActions.length > 0 && (
                                                        <ActionChips
                                                            actions={suggestedActions}
                                                            onAction={(action) => executeAction(action as { type: "navigate_to" | "scroll_to"; target: string })}
                                                        />
                                                    )}
                                                </AnimatePresence>
                                                <DynamicSuggestions
                                                    suggestions={getContextualSuggestions(msg.content)}
                                                    onSelect={(prompt) => sendMessage(prompt)}
                                                />

                                                {/* Tiny guest sign-in encouragement badge */}
                                                <AnimatePresence>
                                                    {!profile && messages.length === 1 && showSignInPill && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.4, y: 12 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.8, y: 8 }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 420,
                                                                damping: 18,
                                                                mass: 0.6
                                                            }}
                                                            className="text-center mt-1"
                                                        >
                                                            <Link
                                                                href="/auth"
                                                                onClick={() => {
                                                                    if (onNavigate) onNavigate();
                                                                }}
                                                                className="inline-block px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] text-white/40 tracking-tight transition-all duration-300 ease-in-out hover:bg-[hsl(var(--primary))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] hover:font-semibold"
                                                            >
                                                                Sign in to save your chat history
                                                            </Link>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Temporary dynamic system instruction notifications */}
                            <AnimatePresence>
                                {activeSystemMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                                        className="flex justify-center my-2.5 flex-shrink-0"
                                    >
                                        <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/25 rounded-full text-[11px] text-gold font-medium tracking-tight shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                                            {activeSystemMessage}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex flex-col">
                                {/* Listening indicator */}
                                <AnimatePresence>
                                    {isListening && (
                                        <motion.div
                                            key="listening-indicator"
                                            initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, height: "auto", marginTop: 24, marginBottom: 24, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, y: 10, scale: 0.98 }}
                                            transition={{
                                                duration: 0.4, ease: [0.32, 0.72, 0, 1]
                                            }}
                                            className="flex flex-col items-center justify-center overflow-hidden w-full"
                                        >
                                            <div className="flex flex-col items-center justify-center w-full">
                                                <div className="w-24 h-24 sm:w-32 sm:h-32 mb-2">
                                                    <Lottie
                                                        lottieRef={lottieRef}
                                                        animationData={fireMicData}
                                                        loop={true}
                                                        autoplay={true}
                                                        style={{ width: "100%", height: "100%" }}
                                                    />
                                                </div>
                                                {voiceTranscript && (
                                                    <div className="max-w-[85%] px-5 py-3 rounded-2xl text-[15px] bg-gold/15 text-white shadow-[0_4px_24px_rgba(212,175,55,0.15)] border border-gold/30 text-center font-medium mt-2">
                                                        "{voiceTranscript}"
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Thinking indicator */}
                                <AnimatePresence>
                                    {isThinking && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex justify-start mb-3 overflow-hidden"
                                        >
                                            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/8 border border-white/10 flex items-center gap-1.5 mt-2">
                                                {[0, 1, 2].map(i => (
                                                    <motion.span
                                                        key={i}
                                                        className="w-1.5 h-1.5 rounded-full bg-gold/60"
                                                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Input Area Ã¢â€â‚¬Ã¢â€â‚¬ */}
                        <div className="px-4 py-3 border-t border-white/8 flex-shrink-0">
                            <div className="flex items-end gap-2">
                                {/* Text input */}
                                <textarea
                                    ref={inputRef}
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about AFLEWO..."
                                    rows={1}
                                    disabled={isListening || isThinking}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:border-gold/40 transition-colors duration-200 hide-scrollbar"
                                    style={{
                                        minHeight: "42px",
                                        maxHeight: "96px",
                                    }}
                                />

                                {/* Voice button */}
                                {hasVoiceSupport && (
                                    <div className="relative group">
                                        <button
                                            onClick={isListening ? stopListening : startListening}
                                            disabled={isThinking}
                                            aria-label={isListening ? "Stop listening" : "Start voice input"}
                                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isListening
                                                ? "bg-gold/20 text-gold border border-gold/40 animate-pulse"
                                                : "bg-white/8 text-white/50 border border-white/10 hover:text-white hover:bg-white/15"
                                                }`}
                                        >
                                            <MicIcon active={isListening} />
                                        </button>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-black/80 border border-white/10 text-white text-[11px] font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                                            Tap to chat
                                        </div>
                                    </div>
                                )}

                                {/* Send button */}
                                <button
                                    onClick={() => sendMessage(inputText)}
                                    disabled={!inputText.trim() || isThinking || isListening}
                                    aria-label="Send message"
                                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gold text-brown transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold/90 active:scale-95"
                                >
                                    <SendIcon />
                                </button>
                            </div>
                        </div>

                        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Transition Overlay Ã¢â€â‚¬Ã¢â€â‚¬ */}
                        <AnimatePresence>
                            {isNavigating && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center z-50 text-center p-6 space-y-4"
                                >
                                    <div className="w-10 h-10 rounded-full border-t-2 border-gold border-r-2 border-transparent animate-spin" />
                                    <div>
                                        <p className="text-gold font-black uppercase tracking-widest text-[9px]">Transitioning</p>
                                        <p className="text-white text-sm font-medium mt-1">
                                            {isNavigating.type === "navigate_to"
                                                ? `Navigating to ${isNavigating.target.replace("/", "") || "Home"}...`
                                                : `Scrolling down to #${isNavigating.target}...`}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Suggestions Configuration Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
// Priority sorting: live-event items first, then chapter-specific, then general.
function getContextualSuggestions(text: string) {
    const lower = text.toLowerCase();
    const now = new Date();
    const hour = now.getHours();
    const isEvening = hour >= 17 || hour < 4; // 5 PM Ã¢â‚¬â€œ 4 AM = likely event hours

    // Ã¢â€â‚¬Ã¢â€â‚¬ LIVE EVENT: AFLEWO Eldoret is LIVE NOW (pinned highest priority) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    const liveEldoretSuggestions = [
        { id: "live_eldoret", label: "Ã°Å¸â€Â´ Eldoret LIVE", prompt: "AFLEWO Eldoret is live right now! Where can I watch the stream?", icon: "videocam" },
        { id: "live_youtube", label: "Watch on YouTube", prompt: "Open the AFLEWO Eldoret YouTube live stream", icon: "youtube" },
        { id: "live_facebook", label: "Watch on Facebook", prompt: "Open the AFLEWO Eldoret Facebook live stream", icon: "share" },
    ];

    // Ã¢â€â‚¬Ã¢â€â‚¬ JOIN / AUDITIONS Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    if (lower.includes("join") || lower.includes("choir") || lower.includes("audition") || lower.includes("register") || lower.includes("apply")) {
        return [
            { id: "join_choir", label: "Join Choir", prompt: "How do I register to join the AFLEWO choir?", icon: "church" },
            { id: "requirements", label: "Requirements", prompt: "What are the audition requirements for each team?", icon: "favorite" },
            { id: "serve_teams", label: "Other Teams", prompt: "How do I join the ushering, security, or media teams?", icon: "person_add" },
            { id: "partner", label: "Partner", prompt: "How can I financially partner with AFLEWO?", icon: "handshake" },
        ];
    }

    // Ã¢â€â‚¬Ã¢â€â‚¬ EVENTS / DATES Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    if (lower.includes("event") || lower.includes("date") || lower.includes("calendar") || lower.includes("worship night") || lower.includes("schedule")) {
        return [
            { id: "main_event", label: "Oct 2Ã¢â‚¬â€œ4 Nairobi", prompt: "Tell me about the main AFLEWO Night on October 2nd in Nairobi", icon: "calendar" },
            { id: "calendar_2026", label: "Full 2026 Schedule", prompt: "What is the full AFLEWO 2026 event calendar?", icon: "calendar" },
            { id: "nairobi_launch", label: "Pre-Launch", prompt: "Tell me about the Nairobi Pre-Launch event on April 10th", icon: "calendar" },
            ...liveEldoretSuggestions.slice(0, 1),
        ];
    }

    // Ã¢â€â‚¬Ã¢â€â‚¬ ELDORET SPECIFIC Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    if (lower.includes("eldoret")) {
        return [
            ...liveEldoretSuggestions,
            { id: "eldoret_chapter", label: "Eldoret Chapter", prompt: "Tell me about the AFLEWO Eldoret chapter", icon: "location" },
        ];
    }

    // Ã¢â€â‚¬Ã¢â€â‚¬ CHAPTER CONTEXT Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    if (lower.includes("chapter") || lower.includes("nairobi") || lower.includes("mombasa") || lower.includes("nakuru") || lower.includes("rwanda") || lower.includes("tanzania")) {
        return [
            { id: "chapters_list", label: "All Chapters", prompt: "Show me all 7 active AFLEWO chapters", icon: "location" },
            { id: "nairobi_chapter", label: "Nairobi", prompt: "Where is the Nairobi chapter based and when do they rehearse?", icon: "church" },
            { id: "mombasa_chapter", label: "Mombasa", prompt: "Tell me about the Mombasa chapter prayer circle", icon: "location" },
            { id: "rwanda_chapter", label: "Rwanda", prompt: "Tell me about the Rwanda reconciliation chapter", icon: "location" },
        ];
    }

    // Ã¢â€â‚¬Ã¢â€â‚¬ LIVE / STREAM Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    if (lower.includes("live") || lower.includes("stream") || lower.includes("watch")) {
        return liveEldoretSuggestions;
    }

    // Ã¢â€â‚¬Ã¢â€â‚¬ MEDIA / WORSHIP ARCHIVE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    if (lower.includes("media") || lower.includes("video") || lower.includes("worship") || lower.includes("song") || lower.includes("music")) {
        return [
            { id: "media_archive", label: "Worship Archive", prompt: "Where can I watch past AFLEWO worship videos?", icon: "music" },
            { id: "stories", label: "Testify", prompt: "Show me AFLEWO community stories and testimonies", icon: "speech" },
            ...liveEldoretSuggestions.slice(0, 1),
        ];
    }

    // Ã¢â€â‚¬Ã¢â€â‚¬ DONATION / PAYBILL Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    if (lower.includes("donate") || lower.includes("mpesa") || lower.includes("partner") || lower.includes("support") || lower.includes("paybill")) {
        return [
            { id: "donate_mpesa", label: "M-Pesa Paybill", prompt: "What is the AFLEWO M-Pesa paybill number?", icon: "wallet" },
            { id: "partner_tiers", label: "Partner Tiers", prompt: "What are the AFLEWO corporate partnership tiers?", icon: "handshake" },
            { id: "alumni", label: "Alumni Network", prompt: "How do I re-register as an AFLEWO alumni?", icon: "person_add" },
        ];
    }

    // Ã¢â€â‚¬Ã¢â€â‚¬ DEFAULT (evening: surface live event first) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    if (isEvening) {
        return [
            liveEldoretSuggestions[0],
            { id: "join", label: "Join Movement", prompt: "How do I register to join the AFLEWO choir?", icon: "church" },
            { id: "events", label: "Events", prompt: "What events are planned for AFLEWO 2026?", icon: "calendar" },
            { id: "chapters", label: "Chapters", prompt: "Show me all 7 active AFLEWO chapters", icon: "location" },
        ];
    }

    return [
        { id: "join", label: "Join Movement", prompt: "How do I register to join the AFLEWO choir?", icon: "church" },
        { id: "events", label: "2026 Events", prompt: "What events are planned for AFLEWO 2026?", icon: "calendar" },
        { id: "chapters", label: "Chapters", prompt: "Show me all 7 active AFLEWO chapters", icon: "location" },
        { id: "media", label: "Archive", prompt: "Where can I watch past worship videos?", icon: "music" },
    ];
}
