export interface Chapter {
    slug: string;
    name: string;
    status: string;
    established: string;
    venue: string;
    capacity?: string;
    highlight: string;
    color: string;
    country: string;
    description: string;
    upcomingEvent?: string;
    registrationOpen?: boolean;
    venueImage?: string;
    contactPhone?: string;
    contactEmail?: string;
}

export const chapters: Chapter[] = [
    {
        slug: "nairobi",
        name: "Nairobi",
        status: "Mother Chapter",
        established: "2004",
        venue: "Winners' Chapel International, Likoni Road",
        capacity: "15,000+",
        highlight: "Latest: Grace for Wholeness (Oct 2025)",
        color: "from-gold/20 to-gold/5",
        country: "Kenya",
        description: "The inaugural chapter coordinating the movement's prophetic 22nd year. The flagship location where AFLEWO began its journey of continental worship.",
        upcomingEvent: "April 10, 2026 - Pre-Launch",
        venueImage: "/archival-1.jpg",
        registrationOpen: true,
        contactPhone: "+254 700 000 000",
        contactEmail: "nairobi@aflewo.org",
    },
    {
        slug: "mombasa",
        name: "Mombasa",
        status: "Prayer Circle",
        established: "2009",
        venue: "JCC Bamburi Centre",
        highlight: "Nightly Zoom Prayer Circle",
        color: "from-cyan-500/20 to-cyan-500/5",
        country: "Kenya",
        description: "Known for its 'Prayer Circle' that meets nightly via Zoom. A vibrant community of intercessors and worshippers at the Coast.",
        upcomingEvent: "Every Night - Prayer Circle",
        venueImage: "/archival-2.jpg",
    },
    {
        slug: "nakuru",
        name: "Nakuru",
        status: "Registration Open",
        established: "2013",
        venue: "Deliverance Church, Nakuru",
        highlight: "2026 Season Registration Active",
        color: "from-orange-500/20 to-orange-500/5",
        country: "Kenya",
        description: "Birthed during the 1,000-voice national choir event. Nakuru remains a critical hub for Central Rift worship.",
        upcomingEvent: "Mar 02, 2026 - Rehearsals",
        registrationOpen: true,
        venueImage: "/mission-1.jpg",
    },
    {
        slug: "tanzania",
        name: "Tanzania",
        status: "Dar es Salaam",
        established: "2010",
        venue: "CCC Upanga Church",
        highlight: "4,000+ Participants",
        color: "from-emerald/20 to-emerald/5",
        country: "Tanzania",
        description: "The movement's first international chapter, a major hub for AFLEWO's expansion in East Africa.",
        upcomingEvent: "TBA 2026",
        venueImage: "/archival-2.jpg"
    }
    // ... more chapters can be added here
];

export function getChapter(slug: string) {
    return chapters.find(c => c.slug === slug);
}
