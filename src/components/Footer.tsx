"use client";

import Link from "next/link";
import Image from "next/image";
import AppIcon from "@/components/ui/AppIcon";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brown pt-32 pb-12 px-6 border-t border-gold/10">
            <div className="max-container">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-24">
                    {/* Logo & Vision */}
                    <div className="md:col-span-12 lg:col-span-5 space-y-10 text-center lg:text-left">
                        <Link href="/" className="flex items-center justify-center lg:justify-start gap-4 group">
                            <div className="relative w-16 h-16 group-hover:rotate-6 transition-transform duration-500">
                                <Image
                                    src="/brand/AFLEWO LOGO 1-Photoroom.png"
                                    alt="AFLEWO"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-black text-3xl md:text-4xl tracking-tighter text-white">AFRICA LET{"'"}S WORSHIP</span>
                        </Link>
                        <div className="space-y-6">
                            <p className="text-white/40 text-xl font-medium leading-relaxed italic max-w-md mx-auto lg:mx-0">
                                "Uniting the Continent through the Altar of Worship. One God, one people, one Africa."
                            </p>
                            <div className="flex justify-center lg:justify-start gap-3">
                                <Link href="https://instagram.com/aflewoke" target="_blank" className="p-4 glass-card rounded-lg text-gold hover:bg-gold hover:text-brown transition-all"><AppIcon name="public" size={20} /></Link>
                                <Link href="https://facebook.com/aflewoke" target="_blank" className="p-4 glass-card rounded-lg text-gold hover:bg-gold hover:text-brown transition-all"><AppIcon name="groups" size={20} /></Link>
                                <Link href="https://youtube.com/@aflewo" target="_blank" className="p-4 glass-card rounded-lg text-gold hover:bg-gold hover:text-brown transition-all"><AppIcon name="play_circle" size={20} /></Link>
                                <Link href="#" className="p-4 glass-card rounded-lg text-gold hover:bg-gold hover:text-brown transition-all"><AppIcon name="alternate_email" size={20} /></Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:col-span-12 lg:col-span-7">
                        {/* Quick Links */}
                        <div className="space-y-8">
                            <h4 className="font-black text-gold uppercase tracking-[0.3em] text-[11px]">The House</h4>
                            <ul className="space-y-5 text-white/50 font-black text-[10px] uppercase tracking-widest">
                                <li><Link href="/about" className="hover:text-gold transition-all">Our Story</Link></li>
                                <li><Link href="/media" className="hover:text-gold transition-all">Legacy Media</Link></li>
                                <li><Link href="/stories" className="hover:text-gold transition-all">Transformation</Link></li>
                                <li><Link href="/alumni" className="hover:text-gold transition-all">Alumni Society</Link></li>
                                <li><Link href="/join" className="hover:text-gold transition-all">Volunteer</Link></li>
                            </ul>
                        </div>

                        {/* Chapters */}
                        <div className="space-y-8">
                            <h4 className="font-black text-gold uppercase tracking-[0.3em] text-[11px]">Chapters</h4>
                            <ul className="space-y-5 text-white/50 font-black text-[10px] uppercase tracking-widest">
                                <li><Link href="/chapters/nairobi" className="hover:text-gold transition-all">Nairobi</Link></li>
                                <li><Link href="/chapters/mombasa" className="hover:text-gold transition-all">Mombasa</Link></li>
                                <li><Link href="/chapters/nakuru" className="hover:text-gold transition-all">Nakuru</Link></li>
                                <li><Link href="/chapters/tanzania" className="hover:text-gold transition-all">Tanzania</Link></li>
                                <li><Link href="/chapters/rwanda" className="hover:text-gold transition-all">Rwanda</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="space-y-8 md:col-span-1 min-w-[240px]">
                            <h4 className="font-black text-gold uppercase tracking-[0.3em] text-[11px]">Stay in Spirit</h4>
                            <div className="space-y-6">
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] leading-loose">
                                    Join over 20,000 worshippers receiving prophetic updates and resources.
                                </p>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-5 pl-8 pr-12 text-xs font-bold text-white outline-none focus:border-gold transition-all"
                                        />
                                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gold text-brown rounded hover:scale-110 transition-transform">
                                            <AppIcon name="north_east" size={18} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 p-4 glass-card rounded-lg border-gold/20">
                                        <AppIcon name="public" size={14} className="text-gold" />
                                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Global Altar 2026</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <span>© {currentYear} AFLEWO Movement</span>
                        <span className="hidden md:block opacity-20">•</span>
                        <span>Prophetic Stewardship</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-10">
                        <Link href="#" className="hover:text-gold flex items-center gap-2 transition-colors">
                            <AppIcon name="favorite" size={12} className="text-gold/40" /> M-Pesa Paybill: 819867
                        </Link>
                        <Link href="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
                        <Link href="/contact" className="hover:text-gold transition-colors">Contact HQ</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
