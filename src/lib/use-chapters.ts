"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { chapters, type Chapter } from "./chapters";

export type { Chapter };

/**
 * useChaptersWithLiveData
 *
 * Client-side hook — fetches live chapter overrides from Supabase and merges
 * them onto the static chapter config. Falls back to static data gracefully
 * if the DB is unreachable (before migration, or network failure).
 *
 * Usage (inside any "use client" component):
 *   const chapters = useChaptersWithLiveData();
 */
export function useChaptersWithLiveData(): Chapter[] {
    const [merged, setMerged] = useState<Chapter[]>(chapters);

    useEffect(() => {
        supabase
            .from("chapters")
            .select("slug, status, contact_email, contact_phone, whatsapp_link, is_active, highlight, color, upcoming_event, event_date, registration_open, venue_image, has_prayer_circle, has_qr, size, link")
            .then(({ data, error }) => {
                if (error || !data) return;
                setMerged(
                    chapters.map((c) => {
                        const live = data.find((d: any) => d.slug === c.slug);
                        if (!live) return c;
                        return {
                            ...c,
                            // Override with live DB values if they exist
                            status: live.status || c.status,
                            contactEmail: live.contact_email || c.contactEmail,
                            contactPhone: live.contact_phone || c.contactPhone,
                            whatsappLink: live.whatsapp_link || c.whatsappLink,
                            highlight: live.highlight || c.highlight,
                            color: live.color || c.color,
                            upcomingEvent: live.upcoming_event || c.upcomingEvent,
                            eventDate: live.event_date || c.eventDate,
                            registrationOpen: live.registration_open !== null ? live.registration_open : c.registrationOpen,
                            venueImage: live.venue_image || c.venueImage,
                            hasPrayerCircle: live.has_prayer_circle !== null ? live.has_prayer_circle : c.hasPrayerCircle,
                            hasQr: live.has_qr !== null ? live.has_qr : c.hasQr,
                            size: (live.size as "hero" | "featured" | "standard" | undefined) || c.size,
                            link: live.link || c.link,
                        };
                    })
                );
            });
    }, []);

    return merged;
}
