"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../../AuthContext";
import type { Registration } from "@/integrations/supabase/types";
import SvgIcon from "@/components/ui/SvgIcon";

interface CheckInResult {
  success?: boolean;
  error?: string;
  name?: string;
  ticket_ref?: string;
  checked_in_at?: string;
}

// Offline queue — stores pending check-ins when network is unavailable
interface OfflineCheckIn {
  query: string;
  eventId: string;
  timestamp: string;
  synced: boolean;
}

const OFFLINE_KEY = "aflewo_offline_checkins";

function loadOfflineQueue(): OfflineCheckIn[] {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveOfflineQueue(queue: OfflineCheckIn[]) {
  localStorage.setItem(OFFLINE_KEY, JSON.stringify(queue));
}

export default function AdminAttendancePage() {
  const { profile } = useAuth();
  const [query, setQuery] = useState("");
  const [eventId, setEventId] = useState("");
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState<OfflineCheckIn[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [events, setEvents] = useState<Array<{ id: string; title: string; starts_at: string }>>([]);
  const [recentCheckIns, setRecentCheckIns] = useState<Registration[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Monitor online status for offline-first check-in
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);
    setOfflineQueue(loadOfflineQueue());

    if (profile) loadEvents();
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [profile]);

  const loadEvents = async () => {
    if (!profile?.chapter_id) return;
    const { data } = await supabase
      .from("chapter_events")
      .select("id, title, starts_at")
      .eq("chapter_id", profile.chapter_id)
      .order("starts_at", { ascending: false })
      .limit(10);
    const evts = (data || []) as Array<{ id: string; title: string; starts_at: string }>;
    setEvents(evts);
    if (evts.length > 0 && !eventId) setEventId(evts[0].id);
  };

  const loadRecentCheckIns = async () => {
    if (!eventId) return;
    const { data } = await supabase
      .from("registrations")
      .select("*")
      .eq("event_id", eventId)
      .eq("checked_in", true)
      .order("checked_in_at", { ascending: false })
      .limit(20);
    setRecentCheckIns((data || []) as Registration[]);
  };

  useEffect(() => {
    if (eventId) loadRecentCheckIns();
  }, [eventId]);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !eventId) return;
    setLoading(true);
    setResult(null);

    if (!isOnline) {
      // Queue offline
      const pending: OfflineCheckIn = {
        query: query.trim(),
        eventId,
        timestamp: new Date().toISOString(),
        synced: false,
      };
      const queue = [...loadOfflineQueue(), pending];
      saveOfflineQueue(queue);
      setOfflineQueue(queue);
      setResult({ success: true, name: `${query} (queued offline)` });
      setQuery("");
      inputRef.current?.focus();
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ query: query.trim(), eventId }),
      });
      const data: CheckInResult = await res.json();
      setResult(data);

      if (data.success) {
        setQuery("");
        inputRef.current?.focus();
        loadRecentCheckIns();
      }
    } catch {
      setResult({ error: "Network error. Check your connection." });
    } finally {
      setLoading(false);
    }
  };

  const syncOfflineQueue = async () => {
    const queue = loadOfflineQueue().filter((q) => !q.synced);
    if (queue.length === 0) return;
    setSyncing(true);

    const { data: { session } } = await supabase.auth.getSession();
    const updated = [...loadOfflineQueue()];

    for (const item of queue) {
      try {
        const res = await fetch("/api/checkin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ query: item.query, eventId: item.eventId }),
        });
        if (res.ok) {
          const idx = updated.findIndex(u => u.timestamp === item.timestamp);
          if (idx > -1) updated[idx].synced = true;
        }
      } catch {
        // Leave unsynced for next attempt
      }
    }

    saveOfflineQueue(updated);
    setOfflineQueue(updated);
    setSyncing(false);
    loadRecentCheckIns();
  };

  const isAdmin = profile && ["chapter_admin", "super_admin", "volunteer"].includes(profile.role);
  if (!isAdmin) {
    return (
      <div className="text-center py-24 space-y-3">
        <SvgIcon name="block" size={48} className="text-white/10 mx-auto" />
        <p className="text-white/30 font-bold">Admin access required.</p>
      </div>
    );
  }

  const pendingOffline = offlineQueue.filter(q => !q.synced).length;

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Attendance <span className="text-gold">Check-In</span></h1>
          <p className="text-white/40 text-sm mt-1">Type ticket ref or phone number to check in attendees.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald" : "bg-yellow-400"}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? "text-emerald" : "text-yellow-400"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Offline queue warning */}
      {pendingOffline > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
          <div className="flex items-center gap-3 text-yellow-400">
            <SvgIcon name="warning" size={20} />
            <span className="text-sm font-bold">{pendingOffline} check-in{pendingOffline > 1 ? "s" : ""} pending sync</span>
          </div>
          <button
            onClick={syncOfflineQueue}
            disabled={!isOnline || syncing}
            className="px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-lg text-yellow-400 text-xs font-black uppercase tracking-widest hover:bg-yellow-400/30 transition-colors disabled:opacity-50"
          >
            {syncing ? "Syncing..." : "Sync Now"}
          </button>
        </div>
      )}

      {/* Event selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gold">Event</label>
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors appearance-none"
        >
          <option value="">Select event...</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title} — {new Date(ev.starts_at).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}
            </option>
          ))}
        </select>
      </div>

      {/* Check-in form */}
      <form onSubmit={handleCheckIn} className="glass-card-elevated rounded-2xl p-6 space-y-4">
        <p className="text-sm font-black uppercase tracking-widest text-white/40">Scan / Enter</p>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ticket ref (e.g. A1B2C3D4) or +254 phone..."
            autoFocus
            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-sm font-medium text-white placeholder-white/20 outline-none focus:border-gold/50 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !query.trim() || !eventId}
            className="px-6 bg-gold text-brown rounded-xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <SvgIcon name="loader" size={18} className="animate-spin" /> : <SvgIcon name="check_circle" size={18} />}
            {loading ? "" : "Check In"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-bold ${
            result.success
              ? "bg-emerald/10 border-emerald/20 text-emerald"
              : result.error?.includes("Already")
              ? "bg-yellow-400/10 border-yellow-400/20 text-yellow-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            <SvgIcon
              name={result.success ? "check_circle" : result.error?.includes("Already") ? "info" : "error_circle"}
              size={20}
            />
            <span>{result.success ? `✓ ${result.name} checked in!` : result.error}</span>
          </div>
        )}
      </form>

      {/* Recent check-ins */}
      {recentCheckIns.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-black uppercase tracking-widest text-white/40">
            Recently Checked In ({recentCheckIns.length})
          </h2>
          <div className="space-y-2">
            {recentCheckIns.map((reg) => (
              <div key={reg.id} className="glass-card rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black">{reg.full_name}</p>
                  <p className="text-[10px] text-white/30">{reg.phone_number || reg.email || "—"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gold font-black">{reg.ticket_ref}</p>
                  <p className="text-[10px] text-white/20">
                    {reg.checked_in_at
                      ? new Date(reg.checked_in_at).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
