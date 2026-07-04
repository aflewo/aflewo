"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../../AuthContext";
import type { Resource, ResourceType } from "@/integrations/supabase/types";
import AppIcon from "@/components/ui/AppIcon";
import Link from "next/link";

const resourceTypeMeta: Record<ResourceType, { label: string; icon: string; color: string }> = {
  lyrics_pdf:          { label: "Lyrics PDF",       icon: "picture_as_pdf",  color: "text-red-400" },
  chord_chart_pdf:     { label: "Chord Chart",      icon: "piano",           color: "text-orange-400" },
  vocal_stem_audio:    { label: "Vocal Stem",       icon: "record_voice_over", color: "text-gold" },
  backing_track_audio: { label: "Backing Track",    icon: "queue_music",     color: "text-blue-400" },
  rehearsal_video:     { label: "Rehearsal Video",  icon: "video_library",   color: "text-purple-400" },
  announcement:        { label: "Announcement",     icon: "campaign",        color: "text-emerald" },
  other:               { label: "Other",            icon: "folder",          color: "text-white/40" },
};

const sectionOrder: ResourceType[] = [
  "announcement",
  "lyrics_pdf",
  "chord_chart_pdf",
  "vocal_stem_audio",
  "backing_track_audio",
  "rehearsal_video",
  "other",
];

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function ResourceVaultPage() {
  const { profile } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<ResourceType | "all">("all");

  useEffect(() => {
    if (profile) loadResources();
  }, [profile]);

  const loadResources = async () => {
    const { data } = await supabase
      .from("resources")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    setResources((data || []) as Resource[]);
    setLoading(false);
  };

  const filtered = resources.filter((r) => {
    const matchType = activeType === "all" || r.resource_type === activeType;
    const matchSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.song_title?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchType && matchSearch;
  });

  // Group by type for display
  const grouped = sectionOrder.reduce<Record<string, Resource[]>>((acc, type) => {
    const items = filtered.filter((r) => r.resource_type === type);
    if (items.length > 0) acc[type] = items;
    return acc;
  }, {});

  const isApplicant = profile?.role === "applicant";

  if (isApplicant) {
    return (
      <div className="max-w-lg mx-auto text-center py-24 space-y-6">
        <AppIcon name="lock" size={48} className="text-white/20 mx-auto" />
        <h2 className="text-2xl font-black tracking-tighter">Resource Vault Locked</h2>
        <p className="text-white/40 text-sm leading-relaxed">
          The Resource Vault is available once your audition has been reviewed and you are accepted as a choir or band member.
        </p>
        <Link href="/profile/auditions" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-brown rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all">
          <AppIcon name="mic" size={16} />
          Submit Your Audition
        </Link>
        {/* Saem's Tunes upsell for applicants */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#A67C00]/20 to-[#4a3400]/20 border border-gold/20">
          <p className="text-white/60 text-sm">While you wait, prepare your skills on</p>
          <a
            href="https://saemstunes.com/auth-bridge?source=aflewo_vault_locked"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-gold font-black hover:text-gold/80 transition-colors"
          >
            Saem&apos;s Tunes →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Resource <span className="text-gold">Vault</span></h1>
          <p className="text-white/40 text-sm mt-1">
            {resources.length} file{resources.length !== 1 ? "s" : ""} available to your team
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <AppIcon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search files, songs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:border-gold/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", ...sectionOrder] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeType === type
                  ? "bg-gold text-brown"
                  : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
              }`}
            >
              {type === "all" ? "All" : resourceTypeMeta[type].label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <AppIcon name="library_music" size={48} className="text-white/10 mx-auto" />
          <p className="text-white/30 font-bold">
            {search ? "No resources match your search." : "No resources uploaded yet. Check back soon."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([type, items]) => {
            const meta = resourceTypeMeta[type as ResourceType];
            return (
              <div key={type} className="space-y-3">
                <div className="flex items-center gap-3">
                  <AppIcon name={meta.icon} size={16} className={meta.color} />
                  <h2 className="text-sm font-black uppercase tracking-widest text-white/40">{meta.label}</h2>
                  <span className="text-[10px] text-white/20 font-bold">{items.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card rounded-xl p-4 flex items-start gap-3 hover:border-gold/20 transition-all group cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors`}>
                        <AppIcon name={meta.icon} size={16} className={meta.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black truncate group-hover:text-gold transition-colors">{resource.title}</p>
                        {resource.song_title && (
                          <p className="text-[10px] text-white/30 truncate">{resource.song_title}</p>
                        )}
                        {resource.file_size_bytes && (
                          <p className="text-[10px] text-white/20">{formatBytes(resource.file_size_bytes)}</p>
                        )}
                      </div>
                      <AppIcon name="download" size={14} className="text-white/20 group-hover:text-gold transition-colors shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Saem's Tunes contextual module */}
          <div className="rounded-2xl bg-gradient-to-br from-[#A67C00]/20 to-[#4a3400]/20 border border-gold/20 p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <p className="text-[9px] text-gold/80 uppercase tracking-widest font-black">Partner Platform</p>
              <p className="text-white font-black mt-1">Want deeper training on these songs?</p>
              <p className="text-white/40 text-xs mt-1">Get vocal coaching, theory breakdowns and instrument-specific tutorials on Saem&apos;s Tunes.</p>
            </div>
            <a
              href={`https://saemstunes.com/auth-bridge?source=aflewo_vault&role=${profile?.role}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-5 py-2.5 bg-gold text-brown rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-colors whitespace-nowrap"
            >
              Explore →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
