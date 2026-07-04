"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../AuthContext";
import type { Audition, ChapterEvent, Resource, Attendance } from "@/integrations/supabase/types";
import AppIcon from "@/components/ui/AppIcon";
import Link from "next/link";

interface DashboardData {
  audition: Audition | null;
  upcomingEvents: ChapterEvent[];
  recentResources: Resource[];
  attendanceRate: number | null;
}

const roleLabels: Record<string, { label: string; color: string }> = {
  super_admin:   { label: "Super Admin",    color: "text-red-400 bg-red-400/10 border-red-400/20" },
  chapter_admin: { label: "Chapter Admin",  color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  choir_member:  { label: "Choir Member",   color: "text-gold bg-gold/10 border-gold/20" },
  band_member:   { label: "Band Member",    color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  volunteer:     { label: "Volunteer",      color: "text-emerald bg-emerald/10 border-emerald/20" },
  applicant:     { label: "Applicant",      color: "text-white/50 bg-white/5 border-white/10" },
};

const auditionStatusMeta: Record<string, { label: string; icon: string; color: string }> = {
  pending:     { label: "Under Review",   icon: "hourglass_empty", color: "text-yellow-400" },
  shortlisted: { label: "Shortlisted!",   icon: "star",            color: "text-orange-400" },
  accepted:    { label: "Accepted ✓",     icon: "check_circle",    color: "text-emerald" },
  rejected:    { label: "Not Selected",   icon: "cancel",          color: "text-red-400" },
};

export default function PortalHomePage() {
  const { profile } = useAuth();
  const [data, setData] = useState<DashboardData>({
    audition: null,
    upcomingEvents: [],
    recentResources: [],
    attendanceRate: null,
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
      // Load in parallel
      const [auditionRes, eventsRes, resourcesRes, attendanceRes] = await Promise.all([
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
      });
    } catch (err) {
      console.error("[portal] Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl" />
        ))}
      </div>
    );
  }

  const roleMeta = roleLabels[profile.role] || roleLabels.applicant;
  const auditionMeta = data.audition ? auditionStatusMeta[data.audition.status] : null;
  const isApplicant = profile.role === "applicant";

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${roleMeta.color}`}>
            {roleMeta.label}
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter">
          Welcome back, <span className="text-gold">{profile.full_name.split(" ")[0]}</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">
          {profile.chapter_id ? "Your chapter dashboard is ready." : "Complete your profile to join a chapter."}
        </p>
      </div>

      {/* Applicant CTA — nudge to complete audition */}
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
              Apply Now →
            </Link>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Audition status */}
        <div className="glass-card rounded-2xl p-5 space-y-2 col-span-2 lg:col-span-1">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Audition</p>
          {auditionMeta ? (
            <div className={`flex items-center gap-2 ${auditionMeta.color}`}>
              <AppIcon name={auditionMeta.icon} size={20} />
              <span className="font-black text-sm">{auditionMeta.label}</span>
            </div>
          ) : (
            <p className="text-white/30 text-sm font-bold">Not submitted</p>
          )}
        </div>

        {/* Attendance rate */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Attendance</p>
          <p className="text-2xl font-black text-gold">
            {data.attendanceRate !== null ? `${data.attendanceRate}%` : "—"}
          </p>
        </div>

        {/* Resources available */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Resources</p>
          <p className="text-2xl font-black">{data.recentResources.length}</p>
        </div>

        {/* Upcoming events */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Upcoming</p>
          <p className="text-2xl font-black">{data.upcomingEvents.length}</p>
        </div>
      </div>

      {/* Upcoming events */}
      {data.upcomingEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-black tracking-tighter">Upcoming Events</h2>
          <div className="space-y-3">
            {data.upcomingEvents.map((event) => (
              <div key={event.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <AppIcon name="event" size={20} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate">{event.title}</p>
                  <p className="text-xs text-white/40">
                    {new Date(event.starts_at).toLocaleDateString("en-KE", {
                      weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                    {" · "}{event.location || "TBA"}
                  </p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gold/60 shrink-0">
                  {event.event_type.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Resources */}
      {data.recentResources.length > 0 && !isApplicant && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tighter">Recent Resources</h2>
            <Link href="/profile/resources" className="text-gold text-xs font-black hover:brightness-125">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.recentResources.map((resource) => (
              <a
                key={resource.id}
                href={resource.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-xl p-4 flex items-center gap-3 hover:border-gold/20 transition-all group"
              >
                <AppIcon
                  name={resource.resource_type.includes("audio") ? "headphones" : "picture_as_pdf"}
                  size={20}
                  className="text-gold/60 group-hover:text-gold transition-colors shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate">{resource.title}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">
                    {resource.resource_type.replace(/_/g, " ")}
                  </p>
                </div>
                <AppIcon name="download" size={16} className="text-white/20 group-hover:text-gold/60 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Saem's Tunes module */}
      {!isApplicant && (
        <div className="rounded-2xl bg-gradient-to-br from-[#A67C00]/20 to-[#4a3400]/20 border border-gold/20 p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div>
            <span className="text-[9px] font-black tracking-widest text-gold/80 uppercase bg-gold/10 px-2 py-0.5 rounded-full">Partner Platform</span>
            <h3 className="text-lg font-black tracking-tighter mt-2">Sharpen Your Worship Skills</h3>
            <p className="text-white/40 text-sm mt-1 max-w-md">
              Access specialized masterclasses and music education modules tailored for worship teams, curated by Saem&apos;s Tunes.
            </p>
          </div>
          <button
            onClick={handleSaemsTunesLaunch}
            disabled={launchingSaems}
            className="shrink-0 px-6 py-3 bg-gold text-brown rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {launchingSaems ? <AppIcon name="autorenew" size={16} className="animate-spin" /> : null}
            {launchingSaems ? "Connecting..." : "Explore Modules →"}
          </button>
        </div>
      )}
    </div>
  );
}
