"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../../AuthContext";
import type { Profile, UserRole } from "@/integrations/supabase/types";
import SvgIcon from "@/components/ui/SvgIcon";

const roleColors: Record<UserRole, string> = {
  super_admin:   "text-red-400 bg-red-400/10 border-red-400/20",
  chapter_admin: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  choir_member:  "text-gold bg-gold/10 border-gold/20",
  band_member:   "text-blue-400 bg-blue-400/10 border-blue-400/20",
  volunteer:     "text-emerald bg-emerald/10 border-emerald/20",
  applicant:     "text-white/40 bg-white/5 border-white/10",
};

const promotableRoles: UserRole[] = ["choir_member", "band_member", "volunteer", "chapter_admin", "applicant"];

export default function AdminMembersPage() {
  const { profile } = useAuth();
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const isAdmin = profile && ["chapter_admin", "super_admin"].includes(profile.role);

  useEffect(() => {
    if (profile && isAdmin) loadMembers();
  }, [profile, filterRole]);

  const loadMembers = async () => {
    if (!profile) return;
    setLoading(true);

    let query = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    // Chapter admins only see their chapter
    if (profile.role === "chapter_admin" && profile.chapter_id) {
      query = query.eq("chapter_id", profile.chapter_id);
    }

    if (filterRole !== "all") {
      query = query.eq("role", filterRole);
    }

    const { data } = await query;
    setMembers((data || []) as Profile[]);
    setLoading(false);
  };

  const updateRole = async (memberId: string, newRole: UserRole) => {
    // Prevent self-demotion
    if (memberId === profile?.id) return;
    setUpdating(memberId);
    await supabase.from("profiles").update({ role: newRole }).eq("id", memberId);
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    setUpdating(null);
  };

  const filtered = members.filter((m) => {
    if (!search) return true;
    return (
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.phone_number || "").includes(search)
    );
  });

  if (!isAdmin) {
    return (
      <div className="text-center py-24">
        <SvgIcon name="block" size={48} className="text-white/10 mx-auto" />
        <p className="text-white/30 font-bold mt-4">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Members <span className="text-gold">Directory</span></h1>
          <p className="text-white/40 text-sm mt-1">{filtered.length} profile{filtered.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SvgIcon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:border-gold/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "applicant", "choir_member", "band_member", "volunteer", "chapter_admin"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filterRole === role ? "bg-gold text-brown" : "bg-white/5 text-white/40 hover:text-white"
              }`}
            >
              {role === "all" ? "All" : role.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <SvgIcon name="people" size={48} className="text-white/10 mx-auto" />
          <p className="text-white/30 font-bold">No members match your search.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((member) => (
            <div key={member.id} className="glass-card rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                {member.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-gold text-xs font-black">{member.full_name.charAt(0).toUpperCase()}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-black text-sm truncate">{member.full_name}</p>
                  {member.id === profile?.id && (
                    <span className="text-[9px] text-white/20 uppercase tracking-widest">(you)</span>
                  )}
                </div>
                <p className="text-xs text-white/30 truncate">{member.email}</p>
                {member.phone_number && (
                  <p className="text-xs text-white/20">{member.phone_number}</p>
                )}
              </div>

              {/* Role badge + selector */}
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${roleColors[member.role]}`}>
                  {member.role.replace("_", " ")}
                </span>

                {/* Role change — only for others, only if current user outranks */}
                {member.id !== profile?.id && profile?.role === "super_admin" && (
                  <select
                    value={member.role}
                    disabled={!!updating}
                    onChange={(e) => updateRole(member.id, e.target.value as UserRole)}
                    className="bg-white/5 border border-white/10 rounded-lg py-1.5 px-2 text-[10px] text-white outline-none focus:border-gold/40 transition-colors appearance-none"
                  >
                    {promotableRoles.map(r => (
                      <option key={r} value={r}>{r.replace("_", " ")}</option>
                    ))}
                  </select>
                )}
                {updating === member.id && (
                  <SvgIcon name="loader" size={16} className="text-gold animate-spin" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
