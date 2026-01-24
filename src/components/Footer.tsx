"use client";

import Link from "next/link";
import Image from "next/image";
import AppIcon from "@/components/ui/AppIcon";

export default function Footer() {
    const currentYear = new Date().getFullYear();

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
                            <span className="font-black text-3xl tracking-tighter text-white">AFRICA LET{"'"}S WORSHIP</span>
                        </Link>
                        <p className="text-white/40 text-lg font-medium leading-relaxed font-serif-spiritual italic max-w-md">
                            Igniting and uniting Africa through worship. One God, one people, one Africa.
                            The sound of heaven echoing from the heart of the continent.
                        </p>
                        <div className="flex gap-4">
                            <button className="p-3 glass-card rounded-ios text-gold hover:bg-gold hover:text-brown transition-all"><AppIcon name="language" size={20} /></button>
                            <button className="p-3 glass-card rounded-ios text-gold hover:bg-gold hover:text-brown transition-all"><AppIcon name="group" size={20} /></button>
                            <button className="p-3 glass-card rounded-ios text-gold hover:bg-gold hover:text-brown transition-all"><AppIcon name="play_arrow" size={20} /></button>
                            <button className="p-3 glass-card rounded-ios text-gold hover:bg-gold hover:text-brown transition-all"><AppIcon name="mail" size={20} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:col-span-12 lg:col-span-7">
                        {/* Quick Links */}
                        <div className="space-y-6">
                            <h4 className="font-black text-gold uppercase tracking-widest text-xs">Explore</h4>
                            <ul className="space-y-4 text-white/50 font-black text-[10px] uppercase tracking-widest">
                                <li><Link href="/about" className="hover:text-gold transition-all">Timeline</Link></li>
                                <li><Link href="/media" className="hover:text-gold transition-all">Media</Link></li>
                                <li><Link href="/stories" className="hover:text-gold transition-all">Stories</Link></li>
                                <li><Link href="/join" className="hover:text-gold transition-all">Join Us</Link></li>
                            </ul>
                        </div>

                        {/* Chapters */}
                        <div className="space-y-6">
                            <h4 className="font-black text-gold uppercase tracking-widest text-xs">Chapters</h4>
                            <ul className="space-y-4 text-white/50 font-black text-[10px] uppercase tracking-widest">
                                <li><Link href="#" className="hover:text-gold transition-all">Nairobi</Link></li>
                                <li><Link href="#" className="hover:text-gold transition-all">Mombasa</Link></li>
                                <li><Link href="#" className="hover:text-gold transition-all">Kampala</Link></li>
                                <li><Link href="#" className="hover:text-gold transition-all">Kigali</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="space-y-6 md:col-span-1 min-w-[200px]">
                            <h4 className="font-black text-gold uppercase tracking-widest text-xs">Stay Connected</h4>
                            <div className="space-y-4">
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-relaxed">Join 15K+ worshippers in the movement.</p>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="email@africa.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-6 pr-12 text-xs font-medium text-white appearance-none outline-none focus:ring-1 focus:ring-gold"
                                    />
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gold text-brown rounded-full hover:scale-110 transition-transform flex items-center justify-center">
                                        <AppIcon name="arrow_outward" size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                    <div>© {currentYear} AFLEWO Digital • Prophetic House</div>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-gold">Privacy Policy</Link>
                        <Link href="#" className="hover:text-gold">M-Pesa Paybill: 819867</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
