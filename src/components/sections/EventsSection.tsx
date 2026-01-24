"use client";

import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

const events = [
    {
        id: 1,
        title: "AFLEWO Nairobi 2026",
        date: "August 28, 2026",
        venue: "Kasarani Stadium",
        impact: "50,000+ Attendees",
        category: "Main Event",
        image: "/api/placeholder/800/600",
    },
    {
        id: 2,
        title: "Worship Residency",
        date: "Monthly",
        venue: "AFLEWO Hub",
        impact: "Creative Lab",
        category: "Workshop",
        image: "/api/placeholder/800/600",
    },
    {
        id: 3,
        title: "Chapter Launch",
        date: "Sept 12, 2026",
        venue: "Mombasa",
        impact: "Regional Unity",
        category: "Outreach",
        image: "/api/placeholder/800/600",
    }
];

export default function EventsSection() {
    return (
        <section className="py-24 px-6 bg-brown" id="events">
            <div className="max-w-6xl mx-auto">
                <div className="mb-20">
                    <h2 className="text-5xl md:text-7xl font-black text-gold uppercase tracking-tighter mb-4">Upcoming Gatherings</h2>
                    <p className="text-gold/60 text-lg max-w-2xl">One Africa, one voice. Join us at the physical venues and experience the collective ignite.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event.id} className="group glass-card border-none bg-background/40 hover:bg-background/60 transition-all cursor-pointer overflow-hidden flex flex-col">
                            {/* Event Image Placeholder with Overlay */}
                            <div className="aspect-[4/3] bg-brown/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gold/10 group-hover:bg-transparent transition-all" />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-gold text-brown font-black text-xs uppercase rounded-full">{event.category}</span>
                                </div>
                            </div>

                            {/* Event Content */}
                            <div className="p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-6 group-hover:text-gold transition-colors">{event.title}</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Calendar size={18} className="text-gold" />
                                            <span className="text-sm font-medium">{event.date}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <MapPin size={18} className="text-gold" />
                                            <span className="text-sm font-medium">{event.venue}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Users size={18} className="text-gold" />
                                            <span className="text-sm font-medium">{event.impact}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="mt-8 flex items-center gap-2 font-black text-gold uppercase tracking-wider text-sm group/btn">
                                    Reserve My Space <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
