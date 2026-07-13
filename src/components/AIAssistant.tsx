"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import SvgIcon from "@/components/ui/SvgIcon";
import fireMicData from "@/../context/lottie/Fire Mic Animation - LIstening_AI.json";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
    id: string;
    role: "user" | "assistant";
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
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

// ─── Close icon SVG ───────────────────────────────────────────────────────────
function CloseIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
}

// ─── Mic icon SVG ─────────────────────────────────────────────────────────────
function MicIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="2" width="6" height="12" rx="3" stroke={active ? "hsl(42 92% 56%)" : "currentColor"} strokeWidth="2"/>
            <path d="M5 10C5 14.4183 8.13401 18 12 18C15.866 18 19 14.4183 19 10" stroke={active ? "hsl(42 92% 56%)" : "currentColor"} strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 18V22M9 22H15" stroke={active ? "hsl(42 92% 56%)" : "currentColor"} strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
}

// ─── Chat bubble ─────────────────────────────────────────────────────────────
function ChatBubble({ msg }: { msg: Message }) {
    const isUser = msg.role === "user";
    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
        >
            <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isUser
                        ? "bg-gold/90 text-brown font-semibold rounded-br-sm"
                        : "bg-white/8 text-white/90 border border-white/10 rounded-bl-sm"
                }`}
                style={{ backdropFilter: isUser ? undefined : "blur(8px)" }}
            >
                {msg.content}
            </div>
        </motion.div>
    );
}

// ─── Main AI Assistant Component ──────────────────────────────────────────────
export default function AIAssistant() {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Habari! I'm here to help you explore AFLEWO — our events, chapters, how to join, or anything else. What can I do for you?",
            timestamp: new Date(),
        },
    ]);
    const [hasVoiceSupport, setHasVoiceSupport] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState("");

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

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isThinking]);

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
                setTimeout(() => executeAction(data.action), 800);
            }
        } catch {
            const errMsg: Message = {
                id: `e-${Date.now()}`,
                role: "assistant",
                content: "Something went wrong — please try again.",
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
                        className="fixed bottom-8 right-8 z-[150] w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] cursor-pointer overflow-hidden border border-white/10"
                        style={{ background: "hsl(20 14% 8%)" }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                    >
                        {/* Standard background to match navigation perfectly (no green artifacts) */}
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[24px] backdrop-saturate-[180%] rounded-full z-0 pointer-events-none" />
                        {/* Icon: MicIcon by default, Fire Mic Lottie ONLY when actively listening */}
                        <div className="relative z-10 w-8 h-8 flex items-center justify-center">
                            {isListening ? (
                                <Lottie
                                    lottieRef={lottieRef}
                                    animationData={fireMicData}
                                    loop={true}
                                    autoplay={true}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            ) : (
                                <SvgIcon name="search-square" size={26} className="text-white" />
                            )}
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
                                {/* Fire Mic lottie in header — shows when listening */}
                                {/* Panel header avatar: MicIcon by default, Fire Mic Lottie ONLY when listening */}
                                <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center">
                                    {isListening ? (
                                        <Lottie
                                            animationData={fireMicData}
                                            loop={true}
                                            autoplay={true}
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                            <SvgIcon name="search-square" size={20} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-white font-black text-sm tracking-tight">AFLEWO Connect</p>
                                    <p className="text-white/40 text-[10px] font-medium tracking-wider uppercase">
                                        {isListening ? "Listening..." : isThinking ? "Thinking..." : "Ask me anything"}
                                    </p>
                                </div>
                            </div>
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

                        {/* ── Messages Area ── */}
                        <div
                            className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar"
                            style={{ minHeight: 0 }}
                        >
                            {messages.map(msg => (
                                <ChatBubble key={msg.id} msg={msg} />
                            ))}

                            {/* Listening indicator */}
                            <AnimatePresence>
                                {isListening && voiceTranscript && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex justify-end mb-3"
                                    >
                                        <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-sm text-sm bg-gold/30 text-white/70 italic border border-gold/20">
                                            {voiceTranscript}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Thinking indicator */}
                            <AnimatePresence>
                                {isThinking && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex justify-start mb-3"
                                    >
                                        <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/8 border border-white/10 flex items-center gap-1.5">
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
                                    <button
                                        onClick={isListening ? stopListening : startListening}
                                        disabled={isThinking}
                                        aria-label={isListening ? "Stop listening" : "Start voice input"}
                                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                                            isListening
                                                ? "bg-gold/20 text-gold border border-gold/40 animate-pulse"
                                                : "bg-white/8 text-white/50 border border-white/10 hover:text-white hover:bg-white/15"
                                        }`}
                                    >
                                        <MicIcon active={isListening} />
                                    </button>
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
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
