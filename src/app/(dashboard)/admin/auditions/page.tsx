"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../../AuthContext";
import type { Audition, AuditionStatus, Profile, Chapter } from "@/integrations/supabase/types";
import SvgIcon from "@/components/ui/SvgIcon";

type AuditionWithProfile = Audition & {
  profiles: Pick<Profile, "full_name" | "email" | "phone_number">;
  chapters: Pick<Chapter, "name">;
};

const statusColors: Record<AuditionStatus, string> = {
  pending:     "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  shortlisted: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  accepted:    "text-emerald bg-emerald/10 border-emerald/20",
  rejected:    "text-red-400 bg-red-400/10 border-red-400/20",
};

const categoryLabel: Record<string, string> = {
  choir_soprano: "Soprano", choir_alto: "Alto", choir_tenor: "Tenor", choir_bass: "Bass",
  band_keys: "Keys", band_guitar: "Guitar", band_drums: "Drums",
  band_bass: "Bass Guitar", band_strings: "Strings", band_wind: "Wind",
  production_camera: "Camera", production_sound: "Sound", production_livestream: "Livestream",
  volunteer_ushering: "Ushering", volunteer_security: "Security", volunteer_hospitality: "Hospitality",
  dance: "Dance",
};

export default function AdminAuditionsPage() {
  const { profile } = useAuth();
  const [auditions, setAuditions] = useState<AuditionWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<AuditionStatus | "all">("pending");
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const isAdmin = profile && ["chapter_admin", "super_admin"].includes(profile.role);

  useEffect(() => {
    if (profile && isAdmin) loadAuditions();
  }, [profile, filterStatus]);

  const loadAuditions = async () => {
    if (!profile) return;
    setLoading(true);

    let query = supabase
      .from("auditions")
      .select(`
        *,
        profiles:user_id ( full_name, email, phone_number ),
        chapters:chapter_id ( name )
      `)
      .order("created_at", { ascending: false });

    // Chapter admins only see their chapter; super admins see all
    if (profile.role === "chapter_admin" && profile.chapter_id) {
      query = query.eq("chapter_id", profile.chapter_id);
    }

    if (filterStatus !== "all") {
      query = query.eq("status", filterStatus);
    }

    const { data, error } = await query;
    if (!error) setAuditions((data || []) as unknown as AuditionWithProfile[]);
    setLoading(false);
  };

  const updateStatus = async (
    auditionId: string,
    newStatus: AuditionStatus,
    note?: string
  ) => {
    setUpdating(auditionId);
    const { error } = await supabase
      .from("auditions")
      .update({
        status: newStatus,
        reviewed_by: profile?.id,
        admin_notes: note || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", auditionId);

    if (!error) {
      setAuditions(prev =>
        prev.map(a =>
          a.id === auditionId
            ? { ...a, status: newStatus, admin_notes: note || a.admin_notes, reviewed_at: new Date().toISOString() }
            : a
        )
      );
      // If accepted, promote user role to choir_member
      if (newStatus === "accepted") {
        const audition = auditions.find(a => a.id === auditionId);
        if (audition) {
          const isBand = audition.category.startsWith("band_");
          await supabase
            .from("profiles")
            .update({ role: isBand ? "band_member" : "choir_member" })
            .eq("id", audition.user_id);
        }
      }
      setExpandedId(null);
      setAdminNote("");
    }
    setUpdating(null);
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-24 space-y-3">
        <SvgIcon name="lock" size={48} className="text-white/10 mx-auto" />
        <p className="text-white/30 font-bold">Admin access required.</p>
      </div>
    );
  }

  const pendingCount = auditions.filter(a => a.status === "pending").length;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Audition <span className="text-gold">Review</span></h1>
          <p className="text-white/40 text-sm mt-1">
            {pendingCount > 0 ? `${pendingCount} application${pendingCount > 1 ? "s" : ""} awaiting review.` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "shortlisted", "accepted", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                filterStatus === s ? "bg-gold text-brown" : "bg-white/5 text-white/40 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl" />)}
        </div>
      ) : auditions.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <SvgIcon name="docs" size={48} className="text-white/10 mx-auto" />
          <p className="text-white/30 font-bold">No {filterStatus === "all" ? "" : filterStatus} auditions found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {auditions.map((audition) => (
            <div key={audition.id} className="glass-card-elevated rounded-xl overflow-hidden">
              <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Applicant info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black">{audition.profiles?.full_name || "Unknown"}</p>
                    <span className="text-[9px] text-white/30 uppercase tracking-widest">
                      {categoryLabel[audition.category] || audition.category}
                    </span>
                    {audition.chapters?.name && (
                      <span className="text-[9px] text-gold/40 uppercase tracking-widest">
                        {audition.chapters.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/30 mt-0.5">{audition.profiles?.email}</p>
                  {audition.notes && (
                    <p className="text-xs text-white/40 mt-1 line-clamp-1 italic">"{audition.notes}"</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  {audition.audio_url && (
                    <a
                      href={audition.audio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-gold hover:border-gold/20 transition-all"
                    >
                      <SvgIcon name="play_circle" size={14} /> Play
                    </a>
                  )}

                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${statusColors[audition.status]}`}>
                    {audition.status}
                  </span>

                  <button
                    onClick={() => setExpandedId(expandedId === audition.id ? null : audition.id)}
                    className="text-white/30 hover:text-gold transition-colors"
                  >
                    <SvgIcon name={expandedId === audition.id ? "expand_less" : "expand_more"} size={20} />
                  </button>
                </div>
              </div>

              {/* Expanded review panel */}
              {expandedId === audition.id && (
                <div className="border-t border-white/5 p-5 space-y-4">
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Add a note for the applicant (optional)..."
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-white/20 outline-none focus:border-gold/40 transition-colors resize-none"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateStatus(audition.id, "shortlisted", adminNote)}
                      disabled={!!updating}
                      className="px-4 py-2 rounded-lg bg-orange-400/20 border border-orange-400/30 text-orange-400 text-xs font-black uppercase tracking-widest hover:bg-orange-400/30 transition-all disabled:opacity-50"
                    >
                      {updating === audition.id ? "..." : "Shortlist"}
                    </button>
                    <button
                      onClick={() => updateStatus(audition.id, "accepted", adminNote)}
                      disabled={!!updating}
                      className="px-4 py-2 rounded-lg bg-emerald/20 border border-emerald/30 text-emerald text-xs font-black uppercase tracking-widest hover:bg-emerald/30 transition-all disabled:opacity-50"
                    >
                      {updating === audition.id ? "..." : "Accept ✓"}
                    </button>
                    <button
                      onClick={() => updateStatus(audition.id, "rejected", adminNote)}
                      disabled={!!updating}
                      className="px-4 py-2 rounded-lg bg-red-400/20 border border-red-400/30 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-400/30 transition-all disabled:opacity-50"
                    >
                      {updating === audition.id ? "..." : "Reject"}
                    </button>
                    <button
                      onClick={() => { setExpandedId(null); setAdminNote(""); }}
                      className="px-4 py-2 rounded-lg bg-white/5 text-white/40 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                  {audition.admin_notes && (
                    <p className="text-xs text-white/30 italic">Previous note: "{audition.admin_notes}"</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
