"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import SvgIcon from "@/components/ui/SvgIcon";
import fireMicData from "@/../context/lottie/Fire Mic Animation - LIstening_AI.json";
import { useAuth } from "@/app/(dashboard)/AuthContext";

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

// ─── Web Speech API declarations ──────────────────────────────────────────────
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
            <path d="M16.1391 2.95907L7.10914 5.95907C1.03914 7.98907 1.03914 11.2991 7.10914 13.3191L9.78914 14.2091L10.6791 16.8891C12.6991 22.9591 16.0191 22.9591 18.0391 16.8891L21.0491 7.86907C22.3891 3.81907 20.1891 1.60907 16.1391 2.95907ZM16.4591 8.33907L12.6591 12.1591C12.5091 12.3091 12.3191 12.3791 12.1291 12.3791C11.9391 12.3791 11.7491 12.3091 11.5991 12.1591C11.3091 11.8691 11.3091 11.3891 11.5991 11.0991L15.3991 7.27907C15.6891 6.98907 16.1691 6.98907 16.4591 7.27907C16.7491 7.56907 16.7491 8.04907 16.4591 8.33907Z" fill="currentColor"/>
        </svg>
    );
}

// ─── Close icon SVG ───────────────────────────────────────────────────────────
function CloseIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// ─── Mic icon SVG ─────────────────────────────────────────────────────────────
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
    "testimonies page": "/testimonies",
    "join page": "/join",
    "stories page": "/stories",
    "alumni page": "/alumni",
    "chapters page": "/chapters",
    "sign in page": "/auth",
    "profile page": "/profile",
    "home page": "/"
};
const fuzzyRegex = new RegExp(`\\b(${Object.keys(PAGE_DICTIONARY).join("|")})\\b`, "gi");

function applyFuzzyLinks(text: string, baseIndex: number) {
    const parts = text.split(fuzzyRegex);
    return parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        const url = PAGE_DICTIONARY[lowerPart];
        if (url) {
             return (
                 <Link
                     key={`fuzzy-${baseIndex}-${i}`}
                     href={url}
                     className="text-gold underline hover:text-gold/80 font-medium transition-all"
                 >
                     {part}
                 </Link>
             );
        }
        return part;
    });
}

function parseMessageContent(content: string, profile: any) {
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
            parts.push(...applyFuzzyLinks(textBefore, matchCount++));
        }

        const linkText = match[1];
        const linkUrl = match[2];
        parts.push(
            <a
                key={match.index}
                href={linkUrl}
                target={linkUrl.startsWith("http") ? "_blank" : undefined}
                rel={linkUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-gold underline hover:text-gold/80 font-medium transition-all"
            >
                {linkText}
            </a>
        );

        lastIndex = regex.lastIndex;
    }

    const textAfter = replacedText.substring(lastIndex);
    if (textAfter) {
        parts.push(...applyFuzzyLinks(textAfter, matchCount++));
    }

    return parts.length > 0 ? parts : applyFuzzyLinks(replacedText, matchCount);
}

// ─── Chat bubble ─────────────────────────────────────────────────────────────
function ChatBubble({ msg }: { msg: Message }) {
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
                {parseMessageContent(msg.content, profile)}
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

// ─── Main AI Assistant Component ──────────────────────────────────────────────
export default function AIAssistant() {
    const router = useRouter();
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
    const [hasVoiceSupport, setHasVoiceSupport] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState("");
    const [isNavigating, setIsNavigating] = useState<{ type: string; target: string } | null>(null);
    const [activeSystemMessage, setActiveSystemMessage] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    // Check for voice support
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            setHasVoiceSupport(!!SR);
            synthRef.current = window.speechSynthesis || null;
        }
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

    // ─── Navigation action executor ─────────────────────────────────────────
    const executeAction = useCallback((action: NavigationAction) => {
        if (action.type === "navigate_to") {
            router.push(action.target);
        } else if (action.type === "scroll_to") {
            const el = document.getElementById(action.target);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                // Fallback: if section not found on current page, navigate home and scroll
                router.push(`/#${action.target}`);
            }
        }
    }, [router]);

    // ─── Text-to-speech ──────────────────────────────────────────────────────
    const speak = useCallback((text: string) => {
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

    // ─── Send message to backend ─────────────────────────────────────────────
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
                body: JSON.stringify({ messages: history }),
            });

            const data = await res.json();

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

    // ─── Voice recognition ───────────────────────────────────────────────────
    const startListening = useCallback(() => {
        if (!hasVoiceSupport || isListening) return;

        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SR();
        recognition.lang = "en-KE";
        recognition.continuous = true;
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

            if (event.results[event.results.length - 1].isFinal) {
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

    // ─── Input key handler ───────────────────────────────────────────────────
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputText);
        }
    };

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <>
            {/* ── Floating Trigger Button ── */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        key="fab"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        onClick={() => setIsOpen(true)}
                        aria-label="Open assistant"
                        className="fixed bottom-8 right-8 z-[150] w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(212,175,55,0.15)] border border-white/10 hover:border-gold/40 cursor-pointer overflow-hidden transition-all duration-300 group"
                        style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)"
                        }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                    >
                        {/* Premium Glossy Inset Ring */}
                        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/20 to-transparent z-10 pointer-events-none" />

                        {/* Hover Ping Glow */}
                        <div className="absolute inset-0 rounded-full bg-gold transition-all duration-1000 ease-out opacity-0 group-hover:opacity-20 group-hover:animate-ping z-0 pointer-events-none" />

                        {/* Centered Icon */}
                        <div className="relative z-20 flex items-center justify-center">
                            <SvgIcon name="search-square" size={26} className="text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ── Chat Panel ── */}
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
                        {/* ── Panel Header ── */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                {/* Panel header avatar */}
                                <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                        <SvgIcon name="search-square" size={20} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white font-black text-sm tracking-tight">AFLEWO Connect</p>
                                    <p className="text-white/40 text-[10px] font-medium tracking-wider uppercase">
                                        {isListening ? "Listening..." : isThinking ? "Thinking..." : "Ask me anything"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={handleNewChat}
                                    className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                    title="New Chat"
                                    aria-label="New Chat"
                                >
                                    <SvgIcon name="edit_note" size={18} />
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
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>

                        {/* ── Messages Area ── */}
                        <div
                            className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar flex flex-col gap-2.5"
                            style={{ minHeight: 0 }}
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
                                        <ChatBubble msg={msg} />

                                        {/* Contextual suggestions under the last assistant message */}
                                        {isLast && isAssistant && !isThinking && !isListening && (
                                            <div className="flex flex-col gap-2">
                                                <DynamicSuggestions
                                                    suggestions={getContextualSuggestions(msg.content)}
                                                    onSelect={(prompt) => sendMessage(prompt)}
                                                />

                                                {/* Tiny guest sign-in encouragement badge */}
                                                {!profile && messages.length === 1 && (
                                                    <div className="text-center mt-1">
                                                        <Link
                                                            href="/auth"
                                                            className="inline-block px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] text-white/40 tracking-tight transition-all duration-300 ease-in-out hover:bg-[hsl(var(--primary))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] hover:font-semibold"
                                                        >
                                                            Sign in to save your chat history
                                                        </Link>
                                                    </div>
                                                )}
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

                        {/* ── Input Area ── */}
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

                        {/* ── Transition Overlay ── */}
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

// ─── Suggestions Configuration ──────────────────────────────────────────────
function getContextualSuggestions(text: string) {
    const lower = text.toLowerCase();
    if (lower.includes("join") || lower.includes("choir") || lower.includes("audition") || lower.includes("register")) {
        return [
            { id: "join_choir", label: "Join Choir", prompt: "How do I register to join the AFLEWO choir?", icon: "church" },
            { id: "requirements", label: "Auditions", prompt: "What are the audition requirements?", icon: "favorite" },
            { id: "serve_teams", label: "Other Teams", prompt: "How do I join the ushering, security, or media teams?", icon: "person_add" }
        ];
    }
    if (lower.includes("event") || lower.includes("date") || lower.includes("calendar") || lower.includes("worship night")) {
        return [
            { id: "calendar_2026", label: "2026 Schedule", prompt: "What events are planned for AFLEWO 2026?", icon: "calendar" },
            { id: "nairobi_launch", label: "Pre-Launch", prompt: "Tell me about the Nairobi Pre-Launch event", icon: "calendar" },
            { id: "main_event", label: "Main Event", prompt: "When is the main AFLEWO Nairobi event?", icon: "calendar" }
        ];
    }
    if (lower.includes("chapter") || lower.includes("nairobi") || lower.includes("mombasa") || lower.includes("eldoret") || lower.includes("nakuru")) {
        return [
            { id: "chapters_list", label: "All Chapters", prompt: "Show me all active AFLEWO chapters", icon: "location" },
            { id: "nairobi_chapter", label: "Nairobi Chapter", prompt: "Where is the Nairobi chapter based?", icon: "church" },
            { id: "mombasa_chapter", label: "Mombasa Chapter", prompt: "Tell me about the Mombasa chapter", icon: "location" }
        ];
    }
    // Default general suggestions
    return [
        { id: "join", label: "Join Choir", prompt: "How do I register to join the AFLEWO choir?", icon: "church" },
        { id: "events", label: "Events", prompt: "What events are planned for AFLEWO 2026?", icon: "calendar" },
        { id: "chapters", label: "Chapters", prompt: "Show me active AFLEWO chapters", icon: "location" },
        { id: "media", label: "Archive", prompt: "Where can I watch past worship videos?", icon: "music" }
    ];
}
