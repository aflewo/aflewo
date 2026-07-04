"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../../AuthContext";
import type { ChapterEvent } from "@/integrations/supabase/types";
import AppIcon from "@/components/ui/AppIcon";

const eventTypeColors: Record<string, string> = {
  main_event:    "text-gold bg-gold/10 border-gold/20",
  rehearsal:     "text-blue-400 bg-blue-400/10 border-blue-400/20",
  audition:      "text-orange-400 bg-orange-400/10 border-orange-400/20",
  prayer_circle: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  outreach:      "text-emerald bg-emerald/10 border-emerald/20",
  other:         "text-white/40 bg-white/5 border-white/10",
};

export default function PortalSchedulePage() {
  const { profile } = useAuth();
  const [events, setEvents] = useState<ChapterEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) loadEvents();
  }, [profile]);

  const loadEvents = async () => {
    if (!profile?.chapter_id) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("chapter_events")
      .select("*")
      .eq("chapter_id", profile.chapter_id)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(20);

    setEvents((data || []) as ChapterEvent[]);
    setLoading(false);
  };

  // Group events by month
  const grouped = events.reduce<Record<string, ChapterEvent[]>>((acc, event) => {
    const month = new Date(event.starts_at).toLocaleDateString("en-KE", { month: "long", year: "numeric" });
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {});

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black tracking-tighter">Chapter <span className="text-gold">Schedule</span></h1>
        <p className="text-white/40 text-sm mt-1">Upcoming rehearsals, auditions, and events for your chapter.</p>
      </div>

      {!profile?.chapter_id && (
        <div className="text-center py-16 space-y-3">
          <AppIcon name="location_off" size={48} className="text-white/10 mx-auto" />
          <p className="text-white/30 font-bold">You are not assigned to a chapter yet.</p>
          <p className="text-white/20 text-sm">Contact your coordinator to be added to a chapter.</p>
        </div>
      )}

      {profile?.chapter_id && loading && (
        <div className="animate-pulse space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl" />)}
        </div>
      )}

      {profile?.chapter_id && !loading && Object.keys(grouped).length === 0 && (
        <div className="text-center py-16 space-y-3">
          <AppIcon name="event_busy" size={48} className="text-white/10 mx-auto" />
          <p className="text-white/30 font-bold">No upcoming events scheduled.</p>
          <p className="text-white/20 text-sm">Your coordinator will add events here. Check back soon.</p>
        </div>
      )}

      {Object.entries(grouped).map(([month, monthEvents]) => (
        <div key={month} className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-white/30 flex items-center gap-3">
            <span className="flex-1 h-px bg-white/5" />
            {month}
            <span className="flex-1 h-px bg-white/5" />
          </h2>
          {monthEvents.map((event) => {
            const colorClass = eventTypeColors[event.event_type] || eventTypeColors.other;
            const start = new Date(event.starts_at);
            const end = event.ends_at ? new Date(event.ends_at) : null;

            return (
              <div key={event.id} className="glass-card-elevated rounded-2xl p-5 flex gap-5">
                {/* Date block */}
                <div className="w-14 shrink-0 text-center">
                  <p className="text-2xl font-black text-gold leading-none">{start.getDate()}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                    {start.toLocaleDateString("en-KE", { weekday: "short" })}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-px bg-white/10 shrink-0" />

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3 className="font-black text-base leading-tight">{event.title}</h3>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0 ${colorClass}`}>
                      {event.event_type.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5 text-white/40 text-xs">
                      <AppIcon name="schedule" size={12} />
                      {start.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                      {end && ` – ${end.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}`}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1.5 text-white/40 text-xs">
                        <AppIcon name="location_on" size={12} />
                        {event.location}
                      </div>
                    )}
                    {event.is_virtual && event.virtual_link && (
                      <a
                        href={event.virtual_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-blue-400 text-xs hover:text-blue-300 transition-colors"
                      >
                        <AppIcon name="video_call" size={12} />
                        Join Online
                      </a>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-white/30 text-xs leading-relaxed">{event.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
