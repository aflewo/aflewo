
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
    /** Decimal coordinates for the embedded map */
    lat?: number;
    lng?: number;
    /** Short venue name shown in the expanded card header */
    venueName?: string;
    /** Human-readable start time shown in the card */
    startTime?: string;
    /** Visibility scoping for role-based access */
    visibility?: "public" | "member";
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
        description: "Auditions for Choir, Band, Media, Ushering, Security, and Dancing categories.",
        venueName: "Eldoret Regional Hub",
        startTime: "Feb 15 · 09:00 AM",
        lat: 0.5143,
        lng: 35.2698,
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
        description: "2026 season rehearsals for registered choir members.",
        venueName: "Deliverance Church, Nakuru",
        startTime: "Mar 02 · 05:00 PM",
        lat: -0.3031,
        lng: 36.0800,
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
        url: "https://zoom.us/j/aflewo",
        venueName: "Zoom Virtual Altar",
        startTime: "Nightly · 09:00 PM",
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
        url: "https://youtube.com/aflewo",
        venueName: "Winners' Chapel International",
        startTime: "Apr 10 · 06:00 PM",
        lat: -1.2679,
        lng: 36.8025,
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
        description: "An evening of worship and praise.",
        venueName: "CCC Upanga Church",
        startTime: "Mar 21 · 07:00 PM",
        lat: -6.8161,
        lng: 39.2803,
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
        description: "Annual commemoration service for healing and reconciliation.",
        venueName: "Christian Life Assembly",
        startTime: "Apr 07 · 10:00 AM",
        lat: -1.9441,
        lng: 30.0619,
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
        description: "Mt. Kenya regional worship gathering.",
        venueName: "PCEA Nyamachaki",
        startTime: "May 15 · 02:00 PM",
        lat: -0.4167,
        lng: 36.9500,
    },
    {
        id: "112",
        title: "Main Nairobi Event",
        date: "Oct 02, 2026",
        start: "20261002T180000",
        end: "20261003T060000",
        time: "06:00 PM",
        type: "Main Event",
        chapter: "Nairobi",
        location: "Winners' Chapel International",
        description: "The flagship all-night worship experience drawing over 15,000+ attendees.",
        venueName: "Winners' Chapel International",
        startTime: "Oct 02 · 06:00 PM",
        lat: -1.2679,
        lng: 36.8025,
    },
    {
        id: "8",
        title: "Meru Regional Event",
        date: "Jun 12, 2026",
        start: "20260612T140000",
        end: "20260612T200000",
        time: "02:00 PM",
        type: "Event",
        chapter: "Meru",
        location: "Gikumene High School",
        description: "Mt. Kenya East regional worship gathering.",
        venueName: "Gikumene High School",
        startTime: "Jun 12 · 02:00 PM",
        lat: 0.0464,
        lng: 37.6559,
    },
    {
        id: "eldoret-live-2026",
        title: "LIVE NOW - Eldoret Worship Night",
        date: "Jul 17, 2026",
        start: "20260717T190000",
        end: "20260718T020000",
        time: "07:00 PM",
        type: "Live Stream",
        chapter: "Eldoret",
        location: "AFLEWO Eldoret Chapter",
        description: "AFLEWO Eldoret is live right now! Watch on YouTube or Facebook.",
        isLive: true,
        url: "https://www.youtube.com/live/fhpaPFr_OvQ?si=etOx1Ea0YAECAQ1l",
        venueName: "AFLEWO Eldoret Chapter",
        startTime: "Jul 17 · 07:00 PM",
        lat: 0.5143,
        lng: 35.2698,
    },
    // --- NAIROBI 2026 PRACTICE SCHEDULE & INTERNAL EVENTS ---
    {
        id: "nbi-mission-1", title: "Mission", date: "Mar 22, 2026", start: "20260322T100000", end: "20260322T140000",
        time: "10:00 AM", type: "Mission", chapter: "Nairobi", location: "LMC Karen", venueName: "LMC Karen",
        startTime: "Mar 22 · 10:00 AM", visibility: "member"
    },
    {
        id: "nbi-aud-1", title: "Auditions (Day 1)", date: "Apr 12, 2026", start: "20260412T140000", end: "20260412T180000",
        time: "02:00 PM", type: "Audition", chapter: "Nairobi", location: "CITAM Valley Rd", venueName: "CITAM Valley Rd",
        startTime: "Apr 12 · 02:00 PM", visibility: "public"
    },
    {
        id: "nbi-aud-2", title: "Auditions (Day 2)", date: "Apr 19, 2026", start: "20260419T140000", end: "20260419T180000",
        time: "02:00 PM", type: "Audition", chapter: "Nairobi", location: "CITAM Valley Rd", venueName: "CITAM Valley Rd",
        startTime: "Apr 19 · 02:00 PM", visibility: "public"
    },
    {
        id: "nbi-orient", title: "Orientation & Small Groups", date: "May 03, 2026", start: "20260503T140000", end: "20260503T170000",
        time: "02:00 PM", type: "Meeting", chapter: "Nairobi", location: "Nairobi Baptist Church", venueName: "Nairobi Baptist Church",
        startTime: "May 03 · 02:00 PM", visibility: "member"
    },
    {
        id: "nbi-comm-1", title: "First Commissioning", date: "May 10, 2026", start: "20260510T140000", end: "20260510T170000",
        time: "02:00 PM", type: "Commissioning", chapter: "Nairobi", location: "CITAM Valley Rd", venueName: "CITAM Valley Rd",
        startTime: "May 10 · 02:00 PM", visibility: "member"
    },
    {
        id: "nbi-sgl-train", title: "Small Group Leaders Training", date: "May 16, 2026", start: "20260516T090000", end: "20260516T130000",
        time: "09:00 AM", type: "Training", chapter: "Nairobi", location: "TBD", venueName: "TBD",
        startTime: "May 16 · 09:00 AM", visibility: "member"
    },
    {
        id: "nbi-prac-1", title: "1st Practice", date: "May 24, 2026", start: "20260524T140000", end: "20260524T180000",
        time: "02:00 PM", type: "Rehearsal", chapter: "Nairobi", location: "Nairobi Baptist Church", venueName: "Nairobi Baptist Church",
        startTime: "May 24 · 02:00 PM", visibility: "member"
    },
    {
        id: "nbi-mission-2", title: "Mission (Hallel Worship)", date: "May 27, 2026", start: "20260527T180000", end: "20260527T210000",
        time: "06:00 PM", type: "Mission", chapter: "Nairobi", location: "Bride of Christ Chamber", venueName: "Bride of Christ Chamber",
        startTime: "May 27 · 06:00 PM", visibility: "member"
    },
    {
        id: "nbi-prac-2", title: "2nd Practice", date: "Jun 07, 2026", start: "20260607T140000", end: "20260607T180000",
        time: "02:00 PM", type: "Rehearsal", chapter: "Nairobi", location: "Nairobi Baptist Church", venueName: "Nairobi Baptist Church",
        startTime: "Jun 07 · 02:00 PM", visibility: "member"
    },
    {
        id: "nbi-mission-3", title: "Mission", date: "Jun 21, 2026", start: "20260621T100000", end: "20260621T130000",
        time: "10:00 AM", type: "Mission", chapter: "Nairobi", location: "LMC Karen", venueName: "LMC Karen",
        startTime: "Jun 21 · 10:00 AM", visibility: "member"
    },
    {
        id: "nbi-prac-3", title: "3rd Practice", date: "Jun 21, 2026", start: "20260621T140000", end: "20260621T180000",
        time: "02:00 PM", type: "Rehearsal", chapter: "Nairobi", location: "Nairobi Baptist Church", venueName: "Nairobi Baptist Church",
        startTime: "Jun 21 · 02:00 PM", visibility: "member"
    },
    {
        id: "nbi-prac-4", title: "4th Practice", date: "Jul 05, 2026", start: "20260705T140000", end: "20260705T180000",
        time: "02:00 PM", type: "Rehearsal", chapter: "Nairobi", location: "Nairobi Baptist Church", venueName: "Nairobi Baptist Church",
        startTime: "Jul 05 · 02:00 PM", visibility: "member"
    },
    {
        id: "nbi-prac-5", title: "5th Practice", date: "Jul 19, 2026", start: "20260719T140000", end: "20260719T180000",
        time: "02:00 PM", type: "Rehearsal", chapter: "Nairobi", location: "CITAM Valley Rd", venueName: "CITAM Valley Rd",
        startTime: "Jul 19 · 02:00 PM", visibility: "member"
    },
    {
        id: "nbi-bgv", title: "BGV Auditions", date: "Aug 01, 2026", start: "20260801T090000", end: "20260801T150000",
        time: "09:00 AM", type: "Audition", chapter: "Nairobi", location: "CITAM Valley Rd", venueName: "CITAM Valley Rd",
        startTime: "Aug 01 · 09:00 AM", visibility: "member"
    },
    {
        id: "nbi-alumni", title: "Alumni Connect", date: "Aug 07, 2026", start: "20260807T180000", end: "20260808T180000",
        time: "06:00 PM", type: "Event", chapter: "Nairobi", location: "TBD", venueName: "TBD",
        startTime: "Aug 07–08", visibility: "public"
    },
    {
        id: "nbi-prac-6", title: "6th Practice", date: "Aug 09, 2026", start: "20260809T140000", end: "20260809T180000",
        time: "02:00 PM", type: "Rehearsal", chapter: "Nairobi", location: "Nairobi Baptist Church", venueName: "Nairobi Baptist Church",
        startTime: "Aug 09 · 02:00 PM", visibility: "member"
    },
    {
        id: "nbi-prac-7", title: "7th Practice", date: "Aug 23, 2026", start: "20260823T140000", end: "20260823T180000",
        time: "02:00 PM", type: "Rehearsal", chapter: "Nairobi", location: "Nairobi Baptist Church", venueName: "Nairobi Baptist Church",
        startTime: "Aug 23 · 02:00 PM", visibility: "member"
    },
    {
        id: "nbi-funday", title: "Fun Day", date: "Aug 29, 2026", start: "20260829T090000", end: "20260829T160000",
        time: "09:00 AM", type: "Event", chapter: "Nairobi", location: "TBD", venueName: "TBD",
        startTime: "Aug 29 · 09:00 AM", visibility: "member"
    },
    {
        id: "nbi-prac-8", title: "8th Practice", date: "Sep 06, 2026", start: "20260906T140000", end: "20260906T180000",
        time: "02:00 PM", type: "Rehearsal", chapter: "Nairobi", location: "Nairobi Baptist Church", venueName: "Nairobi Baptist Church",
        startTime: "Sep 06 · 02:00 PM", visibility: "member"
    },
    {
        id: "nbi-prac-9", title: "9th Practice", date: "Sep 13, 2026", start: "20260913T140000", end: "20260913T180000",
        time: "02:00 PM", type: "Rehearsal", chapter: "Nairobi", location: "Nairobi Baptist Church", venueName: "Nairobi Baptist Church",
        startTime: "Sep 13 · 02:00 PM", visibility: "member"
    },
    {
        id: "nbi-mission-4", title: "Mission", date: "Sep 20, 2026", start: "20260920T100000", end: "20260920T140000",
        time: "10:00 AM", type: "Mission", chapter: "Nairobi", location: "LMC Karen", venueName: "LMC Karen",
        startTime: "Sep 20 · 10:00 AM", visibility: "member"
    },
    {
        id: "nbi-dress", title: "Dress Rehearsal", date: "Sep 25, 2026", start: "20260925T180000", end: "20260925T210000",
        time: "06:00 PM", type: "Rehearsal", chapter: "Nairobi", location: "TBD", venueName: "TBD",
        startTime: "Sep 25 · 06:00 PM", visibility: "member"
    },
    {
        id: "nbi-comm-2", title: "Commissioning", date: "Sep 27, 2026", start: "20260927T140000", end: "20260927T170000",
        time: "02:00 PM", type: "Commissioning", chapter: "Nairobi", location: "Nairobi Baptist Church", venueName: "Nairobi Baptist Church",
        startTime: "Sep 27 · 02:00 PM", visibility: "member"
    },
    {
        id: "nbi-setdown", title: "Set down", date: "Oct 18, 2026", start: "20261018T140000", end: "20261018T170000",
        time: "02:00 PM", type: "Meeting", chapter: "Nairobi", location: "CITAM Valley Rd", venueName: "CITAM Valley Rd",
        startTime: "Oct 18 · 02:00 PM", visibility: "member"
    },
    {
        id: "nbi-mission-5", title: "Mission", date: "Nov 29, 2026", start: "20261129T100000", end: "20261129T140000",
        time: "10:00 AM", type: "Mission", chapter: "Nairobi", location: "LMC Karen", venueName: "LMC Karen",
        startTime: "Nov 29 · 10:00 AM", visibility: "member"
    },
    // Undated missions mapping to TBD
    {
        id: "nbi-mission-tbd-1", title: "Mission", date: "TBD", start: "", end: "", time: "TBD", type: "Mission", chapter: "Nairobi", location: "TBD", venueName: "TBD", startTime: "TBD", visibility: "member"
    },
    {
        id: "nbi-mission-tbd-2", title: "Mission", date: "TBD", start: "", end: "", time: "TBD", type: "Mission", chapter: "Nairobi", location: "TBD", venueName: "TBD", startTime: "TBD", visibility: "member"
    },
    {
        id: "nbi-mission-tbd-3", title: "Mission", date: "TBD", start: "", end: "", time: "TBD", type: "Mission", chapter: "Nairobi", location: "TBD", venueName: "TBD", startTime: "TBD", visibility: "member"
    }
];

export const promos = [
    { id: "p1", title: "Join the AFLEWO Movement", url: "/join", isExternal: false },
    { id: "p2", title: "Explore our Worship Archive", url: "/media", isExternal: false },
    { id: "p3", title: "Support AFLEWO Missions", url: "/donate", isExternal: false },
];

export function parseEventDate(dateStr: string): Date | null {
    if (dateStr === "Every Night" || dateStr === "TBD") return null;
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
    const source = live.length > 0 ? live : events.filter(e =>
        parseEventDate(e.date) !== null &&
        parseEventDate(e.date)! >= new Date()
    ).slice(0, 3);

    const list = source.length > 0 ? source : (events.slice(-3));

    return list.map(l => ({
        id: l.id,
        title: l.title,
        url: l.url || "/join",
        isExternal: !!(l.url?.startsWith("http")),
        isLive: !!l.isLive,
        description: l.description,
        venueName: l.venueName,
        startTime: l.startTime,
        lat: l.lat,
        lng: l.lng,
    }));
}
