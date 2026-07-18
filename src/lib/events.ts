"use client";

export interface AFLEWOEvent {
    id: string;
    title: string;
    date: string;
    start: string;
    end: string;
    time: string;
    type: string;
    chapter: string;
    location: string;
    description?: string;
    isLive?: boolean;
    url?: string;
}

export const events: AFLEWOEvent[] = [
    {
        id: "1",
        title: "Eldoret Auditions",
        date: "Feb 15, 2026",
        start: "20260215T090000",
        end: "20260215T170000",
        time: "09:00 AM",
        type: "Audition",
        chapter: "Eldoret",
        location: "Eldoret Regional Hub",
        description: "Auditions for Choir, Band, Media, Ushering, Security, and Dancing categories."
    },
    {
        id: "2",
        title: "Nakuru Rehearsals",
        date: "Mar 02, 2026",
        start: "20260302T170000",
        end: "20260302T200000",
        time: "05:00 PM",
        type: "Rehearsal",
        chapter: "Nakuru",
        location: "Deliverance Church, Nakuru",
        description: "2026 season rehearsals for registered choir members."
    },
    {
        id: "3",
        title: "Mombasa Prayer Circle",
        date: "Every Night",
        start: "20260123T210000",
        end: "20260123T220000",
        time: "09:00 PM",
        type: "Zoom",
        chapter: "Mombasa",
        location: "Zoom Virtual Altar",
        description: "Nightly prayer circle gathering via Zoom.",
        isLive: true,
        url: "https://zoom.us/j/aflewo"
    },
    {
        id: "4",
        title: "Nairobi Pre-Launch",
        date: "Apr 10, 2026",
        start: "20260410T180000",
        end: "20260410T220000",
        time: "06:00 PM",
        type: "Event",
        chapter: "Nairobi",
        location: "Winners' Chapel International",
        description: "Pre-launch event for the 2026 main gathering.",
        isLive: true,
        url: "https://youtube.com/aflewo"
    },
    {
        id: "5",
        title: "Tanzania Worship Night",
        date: "Mar 21, 2026",
        start: "20260321T190000",
        end: "20260321T230000",
        time: "07:00 PM",
        type: "Event",
        chapter: "Tanzania",
        location: "CCC Upanga Church, Dar es Salaam",
        description: "An evening of worship and praise."
    },
    {
        id: "6",
        title: "Rwanda Commemoration",
        date: "Apr 07, 2026",
        start: "20260407T100000",
        end: "20260407T160000",
        time: "10:00 AM",
        type: "Event",
        chapter: "Rwanda",
        location: "Christian Life Assembly, Kigali",
        description: "Annual commemoration service for healing and reconciliation."
    },
    {
        id: "7",
        title: "Nyeri Regional Gathering",
        date: "May 15, 2026",
        start: "20260515T140000",
        end: "20260515T200000",
        time: "02:00 PM",
        type: "Event",
        chapter: "Nyeri",
        location: "PCEA Nyamachaki",
        description: "Mt. Kenya regional worship gathering."
    },
    {
        id: "112",
        title: "Main Nairobi Event",
        date: "Oct 03, 2026",
        start: "20261003T180000",
        end: "20261004T060000",
        time: "06:00 PM",
        type: "Main Event",
        chapter: "Nairobi",
        location: "Winners' Chapel International",
        description: "The flagship all-night worship experience."
    },
    {
        id: "eldoret-live-2026",
        title: "LIVE NOW — Eldoret Worship Night",
        date: "Jul 17, 2026",
        start: "20260717T190000",
        end: "20260718T020000",
        time: "07:00 PM",
        type: "Live Stream",
        chapter: "Eldoret",
        location: "AFLEWO Eldoret Chapter",
        description: "AFLEWO Eldoret is live right now! Watch on YouTube or Facebook.",
        isLive: true,
        url: "https://www.youtube.com/live/fhpaPFr_OvQ?si=etOx1Ea0YAECAQ1l"
    }
];

export const promos = [
    { id: "p1", title: "Join the AFLEWO Movement", url: "/join", isExternal: false },
    { id: "p2", title: "Explore our Worship Archive", url: "/media", isExternal: false },
    { id: "p3", title: "Support AFLEWO Missions", url: "/donate", isExternal: false },
];

export function parseEventDate(dateStr: string): Date | null {
    if (dateStr === "Every Night") return null;
    const parts = dateStr.replace(",", "").split(" ");
    const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(parts[0]);
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    if (monthIndex === -1 || isNaN(day) || isNaN(year)) return null;
    return new Date(year, monthIndex, day);
}

export function getLiveEvents() {
    return events.filter(e => e.isLive).reverse();
}

export function getIslandDisplayItems() {
    const live = getLiveEvents();
    if (live.length > 0) return live.map(l => ({
        id: l.id,
        title: l.title,
        url: l.url || "/events",
        isExternal: l.url?.startsWith("http"),
        isLive: true
    }));
    return promos.map(p => ({
        id: p.id,
        title: p.title,
        url: p.url,
        isExternal: p.isExternal,
        isLive: false
    }));
}
