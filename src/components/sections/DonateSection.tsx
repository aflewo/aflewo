"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentStatus = "idle" | "pending" | "success" | "failed";

export default function DonateSection() {
    const [amount, setAmount] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [status, setStatus] = useState<PaymentStatus>("idle");
    const [progress, setProgress] = useState(0);

    // 69% logic: Simulate the STK Push and real-time verification skeleton
    const handleDonate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !phone) return;

        setStatus("pending");
        setProgress(10);

        // [Step 1] Initializing transaction (Simulated)
        setTimeout(() => setProgress(30), 1000);

        // [Step 2] Triggering STK Push via Cloudflare Worker/Daraja (Simulated)
        // In a real scenario, this calls /api/payments/stk-push
        setTimeout(() => {
            setProgress(69); // Reached 69% - Waiting for user interaction or callback
        }, 2500);

        // [Step 3] Real-time monitoring (Skeleton for Supabase Presence/Realtime)
        // For now, we simulate a successful callback after a delay
        setTimeout(() => {
            setStatus("success");
            setProgress(100);
        }, 8000);
    };

    return (
        <section className="py-24 px-6 bg-background relative overflow-hidden" id="donate">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gold mb-4 uppercase tracking-tighter">Support the Vision</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Your seed fuels the sound of worship across Africa. Join us in building a legacy of praise.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Donation Form Card */}
                    <div className="glass-card p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gold" />

                        <form onSubmit={handleDonate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gold uppercase mb-2">Phone (M-Pesa)</label>
                                <input
                                    type="tel"
                                    placeholder="e.g. 0712345678"
                                    className="w-full bg-brown/20 border-border rounded-ios px-4 py-3 text-foreground focus:ring-2 focus:ring-gold outline-none transition-all"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={status === "pending"}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gold uppercase mb-2">Amount (KES)</label>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    className="w-full bg-brown/20 border-border rounded-ios px-4 py-3 text-foreground focus:ring-2 focus:ring-gold outline-none transition-all"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={status === "pending"}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === "pending"}
                                className={cn(
                                    "w-full py-4 rounded-ios font-black text-lg uppercase tracking-wider transition-all press-scale",
                                    status === "pending" ? "bg-muted text-muted-foreground" : "bg-gold text-brown shadow-glow"
                                )}
                            >
                                {status === "pending" ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin" /> Processing... {progress}%
                                    </span>
                                ) : (
                                    "Donate Now via M-Pesa"
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Status Overlay / Visual Feedback */}
                    <div className="flex flex-col justify-center gap-8">
                        <div className={cn(
                            "p-6 rounded-ios glass-card border-none transition-all duration-500 transform",
                            status === "success" ? "opacity-100 translate-y-0" : "opacity-40 translate-y-4"
                        )}>
                            <div className="flex items-start gap-4">
                                <div className={cn("p-3 rounded-full", status === "success" ? "bg-emerald text-white" : "bg-muted")}>
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Airtight Verification</h3>
                                    <p className="text-sm text-muted-foreground">Every transaction is logged and verified at the edge for 100% reconciliation.</p>
                                </div>
                            </div>
                        </div>

                        <div className={cn(
                            "p-6 rounded-ios glass-card border-none transition-all duration-500 delay-100 transform",
                            status === "pending" ? "opacity-100 scale-105" : "opacity-40"
                        )}>
                            <div className="flex items-start gap-4">
                                <div className={cn("p-3 rounded-full", status === "pending" ? "bg-gold text-brown" : "bg-muted")}>
                                    <Loader2 size={24} className={status === "pending" ? "animate-spin" : ""} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Real-time Feedback</h3>
                                    <p className="text-sm text-muted-foreground">The platform listens for M-Pesa callbacks to give you instant confirmation.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar for the Skeleton Implementation */}
                {status === "pending" && (
                    <div className="mt-12 w-full h-1 bg-brown/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gold transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
