"use client";

import Link from "next/link";
import Image from "next/image";
import SvgIcon from "@/components/ui/SvgIcon";
import { useState } from "react";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState("");
    const [subState, setSubState] = useState<"idle" | "sending" | "done">("idle");

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setSubState("sending");
        await new Promise((r) => setTimeout(r, 1000));
        const subject = encodeURIComponent("AFLEWO Newsletter Signup");
        const body = encodeURIComponent(`Please subscribe me to AFLEWO updates.\nEmail: ${email}`);
        window.location.href = `mailto:nairobi@aflewo.org?subject=${subject}&body=${body}`;
        setSubState("done");
    };

    return (
        <footer className="bg-brown pt-24 pb-12 px-6 border-t border-gold/10">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
                    {/* Logo & Vision */}
                    <div className="md:col-span-12 lg:col-span-5 space-y-8">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="relative w-16 h-16 group-hover:rotate-6 transition-transform duration-500">
                                <Image
                                    src="/brand/AFLEWO LOGO 1-Photoroom.png"
                                    alt="AFLEWO"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-black text-3xl tracking-tighter text-white">AFRICA LET&apos;S WORSHIP</span>
                        </Link>
                        <p className="text-white/40 text-lg font-medium leading-relaxed italic max-w-md">
                            Igniting and uniting Africa through worship. One God, one people, one Africa.
                            The sound of heaven echoing from the heart of the continent since 2004.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://aflewo.org" target="_blank" rel="noopener noreferrer" aria-label="AFLEWO Website"
                                className="p-3 glass-card rounded-ios text-gold hover:bg-gold hover:text-brown transition-all">
                                <SvgIcon name="globe" size={20} className="text-gold" />
                            </a>
                            <a href="https://chat.whatsapp.com/AflewoNairobi" target="_blank" rel="noopener noreferrer" aria-label="AFLEWO WhatsApp"
                                className="p-3 glass-card rounded-ios text-gold hover:bg-gold hover:text-brown transition-all">
                                <SvgIcon name="whatsapp" size={20} className="text-gold" />
                            </a>
                            <a href="https://youtube.com/@aflewo" target="_blank" rel="noopener noreferrer" aria-label="AFLEWO YouTube"
                                className="p-3 glass-card rounded-ios text-gold hover:bg-gold hover:text-brown transition-all">
                                <SvgIcon name="youtube" size={20} className="text-gold" />
                            </a>
                            <a href="mailto:nairobi@aflewo.org" aria-label="Email AFLEWO"
                                className="p-3 glass-card rounded-ios text-gold hover:bg-gold hover:text-brown transition-all">
                                <SvgIcon name="mail" size={20} className="text-gold" />
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:col-span-12 lg:col-span-7">
                        {/* Quick Links */}
                        <div className="space-y-6">
                            <h4 className="font-black text-gold uppercase tracking-widest text-xs">Explore</h4>
                            <ul className="space-y-4 text-white/50 font-black text-[10px] uppercase tracking-widest">
                                <li><Link href="/about" className="hover:text-gold transition-all">Our Story</Link></li>
                                <li><Link href="/about#timeline" className="hover:text-gold transition-all">Timeline</Link></li>
                                <li><Link href="/media" className="hover:text-gold transition-all">Media</Link></li>
                                <li><Link href="/stories" className="hover:text-gold transition-all">Stories</Link></li>
                                <li><Link href="/join" className="hover:text-gold transition-all">Join Us</Link></li>
                                <li><Link href="/alumni" className="hover:text-gold transition-all">Alumni</Link></li>
                            </ul>
                        </div>

                        {/* Chapters */}
                        <div className="space-y-6">
                            <h4 className="font-black text-gold uppercase tracking-widest text-xs">Chapters</h4>
                            <ul className="space-y-4 text-white/50 font-black text-[10px] uppercase tracking-widest">
                                <li><Link href="/chapters/nairobi" className="hover:text-gold transition-all">Nairobi</Link></li>
                                <li><Link href="/chapters/mombasa" className="hover:text-gold transition-all">Mombasa</Link></li>
                                <li><Link href="/chapters/kampala" className="hover:text-gold transition-all">Kampala</Link></li>
                                <li><Link href="/chapters/rwanda" className="hover:text-gold transition-all">Kigali</Link></li>
                                <li><Link href="/chapters/tanzania" className="hover:text-gold transition-all">Tanzania</Link></li>
                                <li><Link href="/chapters/nakuru" className="hover:text-gold transition-all">Nakuru</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="space-y-6 md:col-span-1 min-w-[200px]">
                            <h4 className="font-black text-gold uppercase tracking-widest text-xs">Stay Connected</h4>
                            <div className="space-y-4">
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-relaxed">
                                    Join 15K+ worshippers in the movement.
                                </p>
                                    {subState === "done" ? (
                                    <div className="flex items-center gap-2 text-gold text-[10px] font-black uppercase tracking-widest">
                                        <SvgIcon name="check" size={16} className="text-gold" /> Subscribed!
                                    </div>
                                    ) : (
                                        <form onSubmit={handleSubscribe} className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="email@africa.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-6 pr-12 text-xs font-medium text-white appearance-none outline-none focus:ring-1 focus:ring-gold"
                                        />
                                        <button
                                            type="submit"
                                            disabled={subState === "sending"}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gold text-brown rounded-full hover:scale-110 transition-transform flex items-center justify-center disabled:opacity-50"
                                        >
                                            {subState === "sending"
                                                ? <SvgIcon name="spin" size={16} className="animate-spin" />
                                                : <SvgIcon name="arrow_forward" size={16} />
                                            }
                                        </button>
                                    </form>
                                    )}
                                <div className="space-y-2 pt-2">
                                    <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">M-Pesa Support</p>
                                    <p className="text-white/50 text-[10px] font-black">Paybill: <span className="text-gold">819867</span></p>
                                    <p className="text-white/30 text-[9px]">Account: Your Name</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                    <div>© {currentYear} Africa Let's Worship</div>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
                        <a href="tel:*456*819867#" className="hover:text-gold transition-colors">M-Pesa: *456*819867#</a>
                        <Link href="/join" className="hover:text-gold transition-colors">Partner With Us</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
