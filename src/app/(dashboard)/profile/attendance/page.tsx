"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../../AuthContext";
import type { Attendance, ChapterEvent } from "@/integrations/supabase/types";
import SvgIcon from "@/components/ui/SvgIcon";

type AttendanceWithEvent = Attendance & {
  chapter_events: Pick<ChapterEvent, "title" | "starts_at" | "event_type">;
};

const statusDisplay: Record<Attendance["status"], { label: string; icon: string; color: string }> = {
  present: { label: "Present",   icon: "check_circle", color: "text-emerald" },
  absent:  { label: "Absent",    icon: "cancel",       color: "text-red-400" },
  excused: { label: "Excused",   icon: "info",         color: "text-blue-400" },
  late:    { label: "Late",      icon: "schedule",     color: "text-yellow-400" },
};

export default function PortalAttendancePage() {
  const { profile } = useAuth();
  const [records, setRecords] = useState<AttendanceWithEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) loadAttendance();
  }, [profile]);

  const loadAttendance = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from("attendance")
      .select(`
        *,
        chapter_events:event_id ( title, starts_at, event_type )
      `)
      .eq("user_id", profile.id)
      .order("marked_at", { ascending: false })
      .limit(50);
    setRecords((data || []) as AttendanceWithEvent[]);
    setLoading(false);
  };

  // Stats
  const total = records.length;
  const present = records.filter(r => r.status === "present").length;
  const absent = records.filter(r => r.status === "absent").length;
  const excused = records.filter(r => r.status === "excused").length;
  const rate = total > 0 ? Math.round((present / total) * 100) : null;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black tracking-tighter">My <span className="text-gold">Attendance</span></h1>
        <p className="text-white/40 text-sm mt-1">Your rehearsal and event attendance history.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-gold">{rate !== null ? `${rate}%` : "—"}</p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-1">Rate</p>
        </div>
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-emerald">{present}</p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-1">Present</p>
        </div>
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-red-400">{absent}</p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-1">Absent</p>
        </div>
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-blue-400">{excused}</p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-1">Excused</p>
        </div>
      </div>

      {/* Attendance progress bar */}
      {rate !== null && (
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-white/30 uppercase tracking-widest font-black">
            <span>Attendance Rate</span>
            <span>{rate}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                rate >= 80 ? "bg-emerald" : rate >= 60 ? "bg-yellow-400" : "bg-red-400"
              }`}
              style={{ width: `${rate}%` }}
            />
          </div>
          {rate < 80 && (
            <p className="text-xs text-yellow-400/60">
              {rate < 60
                ? "⚠ Your attendance needs improvement. Please speak with your coordinator."
                : "Keep going! 80% is the target for main event participation."}
            </p>
          )}
        </div>
      )}

      {/* Records */}
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl" />)}
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-24 space-y-4 glass-card rounded-3xl border-white/5">
          <SvgIcon name="calendar" size={48} className="text-white/10 mx-auto" />
          <h2 className="text-xl font-black">No Attendance Records yet.</h2>
          <p className="text-white/20 text-sm">Records appear here once your coordinator logs rehearsal attendance.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.map((record) => {
            const meta = statusDisplay[record.status];
            const event = record.chapter_events;
            return (
              <div key={record.id} className="glass-card rounded-xl px-5 py-4 flex items-center gap-4">
                <SvgIcon name={meta.icon as any} size={20} className={`${meta.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm truncate">{event?.title || "Event"}</p>
                  <p className="text-xs text-white/30">
                    {event?.starts_at
                      ? new Date(event.starts_at).toLocaleDateString("en-KE", {
                          weekday: "short", day: "numeric", month: "short", year: "numeric"
                        })
                      : "—"}
                    {event?.event_type && ` · ${event.event_type.replace("_", " ")}`}
                  </p>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest shrink-0 ${meta.color}`}>
                  {meta.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
