"use client";

import AppIcon from "@/components/ui/AppIcon";

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
        <section className="py-24 px-6 bg-brown" id="events-legacy">
            <div className="max-w-6xl mx-auto">
                <div className="mb-20">
                    <h2 className="text-5xl md:text-7xl font-black text-gold uppercase tracking-tighter mb-4">Upcoming Gatherings</h2>
                    <p className="text-gold/60 text-lg max-w-2xl font-medium">One Africa, one voice. Join us at the physical venues and experience the collective ignite.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event.id} className="group glass-card border-none bg-background/40 hover:bg-background/60 transition-all cursor-pointer overflow-hidden flex flex-col rounded-2xl">
                            {/* Event Image Placeholder with Overlay */}
                            <div className="aspect-[4/3] bg-brown/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gold/10 group-hover:bg-transparent transition-all" />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-gold text-brown font-black text-xs uppercase rounded-full">{event.category}</span>
                                </div>
                            </div>

                            {/* Event Content */}
                            <div className="p-8 flex-1 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black text-foreground group-hover:text-gold transition-colors">{event.title}</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-white/40">
                                            <AppIcon name="calendar_month" size={18} className="text-gold" />
                                            <span className="text-sm font-bold uppercase tracking-widest">{event.date}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/40">
                                            <AppIcon name="location_on" size={18} className="text-gold" />
                                            <span className="text-sm font-bold uppercase tracking-widest">{event.venue}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/40">
                                            <AppIcon name="groups" size={18} className="text-gold" />
                                            <span className="text-sm font-bold uppercase tracking-widest">{event.impact}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="mt-8 flex items-center gap-4 font-black text-gold uppercase tracking-widest text-xs group/btn">
                                    Reserve My Space <AppIcon name="arrow_forward" size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

