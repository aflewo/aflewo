"use client";

import Footer from "@/components/Footer";
import SvgIcon from "@/components/ui/SvgIcon";
import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <main className="bg-background min-h-screen">
            <section className="pt-40 pb-24 px-6">
                <div className="max-container max-w-3xl space-y-12">
                    <div className="space-y-4">
                        <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">Legal</span>
                        <h1 className="text-6xl font-black tracking-tighter leading-tight">
                            PRIVACY <span className="text-gold">POLICY</span>
                        </h1>
                        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Last Updated: June 2025</p>
                    </div>

                    <div className="space-y-10 text-white/70 font-medium leading-relaxed text-base">
                        <div className="glass-card p-8 rounded-2xl space-y-4 border-gold/10">
                            <h2 className="text-xl font-black text-white flex items-center gap-3"><SvgIcon name="info" size={20} className="text-gold" /> Overview</h2>
                            <p>
                                Africa Let&apos;s Worship (AFLEWO) is a worship and prayer movement operating across East Africa since 2004.
                                This Privacy Policy describes how we collect, use, and protect information submitted through our website at aflewo.vercel.app
                                and any related platforms operated by AFLEWO chapters.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-white">1. Information We Collect</h2>
                            <p>We collect information you voluntarily provide through our forms, including:</p>
                            <ul className="space-y-2 pl-4">
                                {[
                                    "Name and contact details (email, phone number) submitted via volunteer, alumni, or story submission forms",
                                    "Chapter affiliation and years of participation",
                                    "Payment reference data in connection with M-Pesa transactions to Paybill 819867",
                                    "Story and testimony content submitted for publication",
                                    "Email addresses submitted to our newsletter or stay-connected form",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <SvgIcon name="check_circle" size={16} className="text-gold mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-white">2. How We Use Your Information</h2>
                            <p>Information collected is used exclusively for:</p>
                            <ul className="space-y-2 pl-4">
                                {[
                                    "Processing volunteer and alumni registration applications",
                                    "Communicating event updates, chapter news, and movement announcements",
                                    "Publishing submitted stories and testimonies (with consent)",
                                    "Acknowledging and processing financial partnership contributions",
                                    "Improving our digital platforms and user experience",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <SvgIcon name="check_circle" size={16} className="text-gold mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p>We do not sell, rent, or share your personal information with third parties for commercial purposes.</p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-white">3. M-Pesa and Financial Data</h2>
                            <p>
                                AFLEWO accepts contributions via M-Pesa Paybill <strong className="text-gold">819867</strong> (Account: Your Name).
                                Financial transaction records are maintained by Safaricom and are subject to Safaricom&apos;s privacy terms.
                                AFLEWO does not store card numbers or M-Pesa PINs. We receive only transaction confirmation references.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-white">4. Data Retention</h2>
                            <p>
                                We retain personal data for as long as necessary to fulfil the purposes described above, or as required by applicable law.
                                Alumni and volunteer records are retained for a minimum of 7 years to maintain movement history.
                                You may request deletion of your data at any time by contacting us.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-white">5. Cookies and Analytics</h2>
                            <p>
                                This website may use minimal session cookies required for navigation. We may use anonymised analytics
                                (such as Vercel Analytics) to understand page traffic. No personally identifiable information is stored
                                in analytics tools.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-white">6. Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul className="space-y-2 pl-4">
                                {[
                                    "Request access to personal data we hold about you",
                                    "Request correction of inaccurate or incomplete data",
                                    "Request deletion of your personal data",
                                    "Withdraw consent for newsletter communications at any time",
                                    "Lodge a complaint with the Kenya Office of the Data Protection Commissioner",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <SvgIcon name="check_circle" size={16} className="text-gold mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-white">7. Contact</h2>
                            <p>For any data protection enquiries, contact us at:</p>
                            <div className="glass-card p-6 rounded-xl space-y-3 border-gold/10">
                                <p className="flex items-center gap-3"><SvgIcon name="mail" size={16} className="text-gold" /> <a href="mailto:nairobi@aflewo.org" className="text-gold hover:underline">nairobi@aflewo.org</a></p>
                                <p className="flex items-center gap-3"><SvgIcon name="location" size={16} className="text-gold" /> AFLEWO National Office, Nairobi, Kenya</p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                            <Link href="/" className="press-scale inline-flex items-center gap-2 px-8 py-4 glass-card rounded-lg font-black text-[10px] uppercase tracking-widest hover:text-gold transition-all">
                                <SvgIcon name="arrow_back" size={14} /> Back to Home
                            </Link>
                            <Link href="/join" className="press-scale inline-flex items-center gap-2 px-8 py-4 bg-gold text-brown rounded-lg font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
                                <SvgIcon name="group_add" size={14} /> Join the Movement
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
