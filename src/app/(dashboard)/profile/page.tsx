"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../AuthContext";
import type { Database } from "@/integrations/supabase/types";
type Audition = Database["public"]["Tables"]["auditions"]["Row"];
type ChapterEvent = Database["public"]["Tables"]["chapter_events"]["Row"];
type Resource = Database["public"]["Tables"]["resources"]["Row"];
type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
import SvgIcon from "@/components/ui/SvgIcon";
import Link from "next/link";

interface DashboardData {
  audition: Audition | null;
  upcomingEvents: ChapterEvent[];
  recentResources: Resource[];
  attendanceRate: number | null;
  chapterName: string | null;
}

const roleLabels: Record<string, { label: string; color: string; dot: string }> = {
  super_admin:   { label: "Super Admin",    color: "text-red-400 bg-red-400/10 border-red-400/20",           dot: "bg-red-400" },
  chapter_admin: { label: "Chapter Admin",  color: "text-orange-400 bg-orange-400/10 border-orange-400/20",  dot: "bg-orange-400" },
  choir_member:  { label: "Choir Member",   color: "text-gold bg-gold/10 border-gold/20",                   dot: "bg-gold" },
  band_member:   { label: "Band Member",    color: "text-blue-400 bg-blue-400/10 border-blue-400/20",        dot: "bg-blue-400" },
  volunteer:     { label: "Volunteer",      color: "text-emerald bg-emerald/10 border-emerald/20",           dot: "bg-emerald-400" },
  applicant:     { label: "Applicant",      color: "text-white/50 bg-white/5 border-white/10",               dot: "bg-white/30" },
};

const auditionStatusMeta: Record<string, { label: string; icon: any; color: string }> = {
  pending:     { label: "Under Review",   icon: "hourglass", color: "text-yellow-400" },
  shortlisted: { label: "Shortlisted",    icon: "star",      color: "text-orange-400" },
  accepted:    { label: "Accepted",       icon: "check_circle", color: "text-emerald" },
  rejected:    { label: "Not Selected",   icon: "close",     color: "text-red-400" },
};

const eventTypeLabel: Record<string, string> = {
  main_event:   "Main Event",
  rehearsal:    "Rehearsal",
  audition:     "Audition",
  prayer_circle:"Prayer Circle",
  outreach:     "Outreach",
  other:        "Other",
};

export default function PortalHomePage() {
  const { profile } = useAuth();
  const [data, setData] = useState<DashboardData>({
    audition: null,
    upcomingEvents: [],
    recentResources: [],
    attendanceRate: null,
    chapterName: null,
  });
  const [loading, setLoading] = useState(true);
  const [launchingSaems, setLaunchingSaems] = useState(false);

  const handleSaemsTunesLaunch = () => {
    setLaunchingSaems(true);
    setTimeout(() => {
      window.open(`https://saemstunes.com/auth-bridge?source=aflewo&role=${profile?.role}`, "_blank", "noopener,noreferrer");
      setLaunchingSaems(false);
    }, 500);
  };

  useEffect(() => {
    if (!profile) return;
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    if (!profile) return;
    setLoading(true);

    try {
      const [auditionRes, eventsRes, resourcesRes, attendanceRes, chapterRes] = await Promise.all([
        // Latest audition
        supabase
          .from("auditions")
          .select("*")
          .eq("user_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single(),

        // Upcoming events for this chapter
        profile.chapter_id
          ? supabase
              .from("chapter_events")
              .select("*")
              .eq("chapter_id", profile.chapter_id)
              .gte("starts_at", new Date().toISOString())
              .order("starts_at", { ascending: true })
              .limit(3)
          : Promise.resolve({ data: [], error: null }),

        // Recent resources (accessible to this role)
        supabase
          .from("resources")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(4),

        // Attendance stats
        profile.chapter_id
          ? supabase
              .from("attendance")
              .select("status")
              .eq("user_id", profile.id)
          : Promise.resolve({ data: [], error: null }),

        // Chapter name
        profile.chapter_id
          ? supabase
              .from("chapters")
              .select("name")
              .eq("id", profile.chapter_id)
              .single()
          : Promise.resolve({ data: null, error: null }),
      ]);

      // Calculate attendance rate
      const attendanceRows = attendanceRes.data || [];
      const present = attendanceRows.filter((a: { status: string }) => a.status === "present").length;
      const rate = attendanceRows.length > 0 ? Math.round((present / attendanceRows.length) * 100) : null;

      setData({
        audition: auditionRes.data || null,
        upcomingEvents: (eventsRes.data || []) as ChapterEvent[],
        recentResources: (resourcesRes.data || []) as Resource[],
        attendanceRate: rate,
        chapterName: (chapterRes.data as { name: string } | null)?.name || null,
      });
    } catch (err) {
      console.error("[portal] Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl">
        <div className="h-40 bg-white/5 rounded-3xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="h-48 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  const roleMeta = roleLabels[profile.role] || roleLabels.applicant;
  const auditionMeta = data.audition ? auditionStatusMeta[data.audition.status] : null;
  const isApplicant = profile.role === "applicant";
  const initials = profile.full_name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-8 max-w-5xl">

      {/* ── Hero Welcome Card ─────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden border border-white/5"
        style={{ background: "linear-gradient(135deg, hsl(20 20% 9% / 0.9) 0%, hsl(20 20% 7% / 0.95) 100%)" }}>
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gold/8 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-8">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/5 border border-gold/20 flex items-center justify-center"
              style={{ boxShadow: "0 0 0 4px hsl(20 20% 9%), 0 0 30px -8px hsla(42,92%,56%,0.3)" }}>
              <span className="text-gold font-black text-2xl tracking-tight select-none">{initials}</span>
            </div>
            {/* Online dot */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-background" />
          </div>

          {/* Greeting */}
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${roleMeta.color}`}>
                {roleMeta.label}
              </span>
              {data.chapterName && (
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 text-white/40">
                  {data.chapterName}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black tracking-tighter">
              Welcome back, <span className="text-gold">{profile.full_name.split(" ")[0]}</span>
            </h1>
            <p className="text-white/40 text-sm">
              {profile.chapter_id ? `${data.chapterName || "Your chapter"} dashboard is ready.` : "Complete your profile to join a chapter."}
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/profile/schedule"
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 transition-all"
              title="Schedule"
            >
              <SvgIcon name="calendar" size={18} />
            </Link>
            <Link
              href="/profile/resources"
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 transition-all"
              title="Resources"
            >
              <SvgIcon name="music" size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Applicant CTA ──────────────────────────────────────── */}
      {isApplicant && (
        <div className="glass-card-elevated rounded-2xl p-6 border-gold/20 bg-gold/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black tracking-tighter">Complete Your Audition</h3>
              <p className="text-white/50 text-sm mt-1">
                Submit your audio sample to get reviewed by your chapter coordinator.
              </p>
            </div>
            <Link
              href="/profile/auditions"
              className="shrink-0 px-6 py-3 bg-gold text-brown rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}

      {/* ── Stats Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Audition */}
        <div className="glass-card rounded-2xl p-5 space-y-3 col-span-2 lg:col-span-1 relative overflow-hidden group hover:border-gold/20 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black relative z-10">Audition</p>
          {auditionMeta ? (
            <div className={`flex items-center gap-2 relative z-10 ${auditionMeta.color}`}>
              <SvgIcon name={auditionMeta.icon} size={20} />
              <span className="font-black text-sm">{auditionMeta.label}</span>
            </div>
          ) : (
            <p className="text-white/30 text-sm font-bold relative z-10">Not submitted</p>
          )}
        </div>

        {/* Attendance */}
        <div className="glass-card rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-gold/20 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black relative z-10">Attendance</p>
          <p className="text-3xl font-black text-gold relative z-10">
            {data.attendanceRate !== null ? `${data.attendanceRate}%` : "—"}
          </p>
          {data.attendanceRate !== null && (
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative z-10">
              <div
                className="h-full bg-gold rounded-full transition-all duration-1000"
                style={{ width: `${data.attendanceRate}%` }}
              />
            </div>
          )}
        </div>

        {/* Resources */}
        <div className="glass-card rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-gold/20 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black relative z-10">Resources</p>
          <p className="text-3xl font-black relative z-10">{data.recentResources.length}</p>
        </div>

        {/* Upcoming events */}
        <div className="glass-card rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-gold/20 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black relative z-10">Upcoming</p>
          <p className="text-3xl font-black relative z-10">{data.upcomingEvents.length}</p>
        </div>
      </div>

      {/* ── Upcoming Events ───────────────────────────────────── */}
      {data.upcomingEvents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tighter">Upcoming Events</h2>
            <Link href="/profile/schedule" className="text-gold text-xs font-black hover:brightness-125 flex items-center gap-1">
              View All <SvgIcon name="arrow_forward" size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {data.upcomingEvents.map((event) => {
              const eventDate = new Date(event.starts_at!);
              const day = eventDate.toLocaleDateString("en-KE", { day: "2-digit" });
              const month = eventDate.toLocaleDateString("en-KE", { month: "short" }).toUpperCase();
              return (
                <div key={event.id} className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-gold/10 transition-colors group">
                  {/* Date block */}
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex flex-col items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors">
                    <span className="text-gold text-xs font-black leading-none">{day}</span>
                    <span className="text-gold/60 text-[8px] font-black uppercase tracking-wider leading-none mt-0.5">{month}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black truncate">{event.title}</p>
                    <p className="text-xs text-white/40 mt-0.5 truncate">
                      {eventDate.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                      {" · "}{event.location || "TBA"}
                    </p>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gold/50 shrink-0 px-2 py-1 rounded-lg bg-gold/5">
                    {eventTypeLabel[event.event_type] || event.event_type.replace("_", " ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Recent Resources ──────────────────────────────────── */}
      {data.recentResources.length > 0 && !isApplicant && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tighter">Recent Resources</h2>
            <Link href="/profile/resources" className="text-gold text-xs font-black hover:brightness-125 flex items-center gap-1">
              View All <SvgIcon name="arrow_forward" size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.recentResources.map((resource) => {
              const isAudio = resource.resource_type.includes("audio");
              const isPdf = resource.resource_type.includes("pdf");
              const isVideo = resource.resource_type.includes("video");
              const icon = isAudio ? "music" : isVideo ? "video" : isPdf ? "docs" : "docs";
              return (
                <a
                  key={resource.id}
                  href={resource.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-xl p-4 flex items-center gap-3 hover:border-gold/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                    <SvgIcon name={icon as any} size={18} className="text-gold/60 group-hover:text-gold transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black truncate">{resource.title}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">
                      {resource.resource_type.replace(/_/g, " ")}
                    </p>
                  </div>
                  <SvgIcon name="download" size={16} className="text-white/20 group-hover:text-gold/60 transition-colors shrink-0" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Saem's Tunes Cross-sell ───────────────────────────── */}
      {!isApplicant && (
        <div className="rounded-2xl relative overflow-hidden border border-gold/15"
          style={{ background: "linear-gradient(135deg, hsl(38 88% 42% / 0.12) 0%, hsl(20 30% 18% / 0.8) 100%)" }}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 blur-[80px] pointer-events-none" />
          <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="space-y-2">
              <span className="text-[9px] font-black tracking-widest text-gold/80 uppercase bg-gold/10 px-2.5 py-1 rounded-full border border-gold/20">
                Partner Platform
              </span>
              <h3 className="text-lg font-black tracking-tighter mt-2">Sharpen Your Worship Skills</h3>
              <p className="text-white/40 text-sm max-w-md">
                Access specialized masterclasses and music education modules tailored for worship teams, curated by Saem&apos;s Tunes.
              </p>
            </div>
            <button
              onClick={handleSaemsTunesLaunch}
              disabled={launchingSaems}
              className="shrink-0 px-6 py-3 bg-gold text-brown rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {launchingSaems ? <SvgIcon name="loader" size={16} className="animate-spin" /> : null}
              {launchingSaems ? "Connecting..." : "Explore Modules"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
