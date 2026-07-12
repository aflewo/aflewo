"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../../AuthContext";
import type { Audition, AuditionCategory } from "@/integrations/supabase/types";
import SvgIcon from "@/components/ui/SvgIcon";

// ─── Category display metadata ─────────────────────────────────
const categoryMeta: Record<AuditionCategory, { label: string; section: string; icon: string }> = {
  choir_soprano:          { label: "Soprano",          section: "🎤 Choir",      icon: "voice_selection" },
  choir_alto:             { label: "Alto",              section: "🎤 Choir",      icon: "voice_selection" },
  choir_tenor:            { label: "Tenor",             section: "🎤 Choir",      icon: "voice_selection" },
  choir_bass:             { label: "Bass",              section: "🎤 Choir",      icon: "voice_selection" },
  band_keys:              { label: "Keys / Piano",      section: "🎸 Band",       icon: "piano" },
  band_guitar:            { label: "Guitar",            section: "🎸 Band",       icon: "queue_music" },
  band_drums:             { label: "Drums",             section: "🎸 Band",       icon: "queue_music" },
  band_bass:              { label: "Bass Guitar",       section: "🎸 Band",       icon: "queue_music" },
  band_strings:           { label: "Strings",           section: "🎸 Band",       icon: "queue_music" },
  band_wind:              { label: "Wind Instruments",  section: "🎸 Band",       icon: "queue_music" },
  production_camera:      { label: "Camera",            section: "🎬 Production", icon: "videocam" },
  production_sound:       { label: "Sound Engineer",    section: "🎬 Production", icon: "tune" },
  production_livestream:  { label: "Livestream Desk",   section: "🎬 Production", icon: "live_tv" },
  volunteer_ushering:     { label: "Ushering",          section: "🤝 Volunteer",  icon: "hail" },
  volunteer_security:     { label: "Security",          section: "🤝 Volunteer",  icon: "security" },
  volunteer_hospitality:  { label: "Hospitality",       section: "🤝 Volunteer",  icon: "favorite" },
  dance:                  { label: "Dance",             section: "💃 Dance",      icon: "self_improvement" },
};

const statusMeta = {
  pending:     { label: "Under Review",  color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  shortlisted: { label: "Shortlisted",   color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  accepted:    { label: "Accepted!",     color: "text-emerald bg-emerald/10 border-emerald/20" },
  rejected:    { label: "Not Selected",  color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

// ─── Cloudinary direct upload ─────────────────────────────────
async function uploadAudioToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
  // 1. Get signed credentials from our server
  const sigRes = await fetch("/api/upload-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "aflewo_auditions" }),
  });
  if (!sigRes.ok) throw new Error("Failed to get upload credentials");
  const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json();

  // 2. Upload DIRECTLY from browser to Cloudinary (bypasses server)
  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", apiKey);
  formData.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData }
  );
  if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
  const result = await uploadRes.json();

  return { url: result.secure_url, publicId: result.public_id };
}

// ─── Main Component ────────────────────────────────────────────
export default function AuditionsPage() {
  const { profile } = useAuth();
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<{
    category: AuditionCategory | "";
    notes: string;
    audioFile: File | null;
  }>({
    category: "",
    notes: "",
    audioFile: null,
  });

  useEffect(() => {
    if (profile) loadAuditions();
  }, [profile]);

  const loadAuditions = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from("auditions")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });
    setAuditions((data || []) as Audition[]);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation before any network request
    const allowedTypes = ["audio/mpeg", "audio/mp4", "audio/wav", "audio/m4a", "audio/aac", "audio/ogg"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload an audio file (MP3, M4A, WAV, AAC).");
      return;
    }
    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      setError("File too large. Maximum size is 20MB.");
      return;
    }
    setError(null);
    setForm(prev => ({ ...prev, audioFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !form.category) return;
    if (!profile.chapter_id) {
      setError("You need to be assigned to a chapter first. Contact your coordinator.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let audioUrl: string | null = null;
      let audioPublicId: string | null = null;

      // Upload audio if provided
      if (form.audioFile) {
        setUploadProgress("Uploading audio sample...");
        const uploaded = await uploadAudioToCloudinary(form.audioFile);
        audioUrl = uploaded.url;
        audioPublicId = uploaded.publicId;
        setUploadProgress("Saving your application...");
      }

      const { error: insertError } = await supabase
        .from("auditions")
        .insert({
          user_id: profile.id,
          chapter_id: profile.chapter_id,
          category: form.category,
          notes: form.notes || null,
          audio_url: audioUrl,
          audio_public_id: audioPublicId,
          status: "pending",
        });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("You have already submitted an audition for this role. Contact your coordinator to update it.");
        } else {
          throw insertError;
        }
        return;
      }

      setSuccess("Audition submitted successfully! Your coordinator will be in touch.");
      setForm({ category: "", notes: "", audioFile: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadAuditions();

    } catch (err) {
      console.error("[auditions] Submit error:", err);
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  // Group categories by section
  const grouped = Object.entries(categoryMeta).reduce<Record<string, Array<{ value: AuditionCategory; meta: typeof categoryMeta[AuditionCategory] }>>>(
    (acc, [value, meta]) => {
      if (!acc[meta.section]) acc[meta.section] = [];
      acc[meta.section].push({ value: value as AuditionCategory, meta });
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black tracking-tighter">My <span className="text-gold">Audition</span></h1>
        <p className="text-white/40 text-sm mt-1">Submit your audio sample and track your application status.</p>
      </div>

      {/* Existing auditions */}
      {!loading && auditions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-black uppercase tracking-widest text-white/40">Your Submissions</h2>
          {auditions.map((audition) => {
            const cat = categoryMeta[audition.category];
            const status = statusMeta[audition.status];
            return (
              <div key={audition.id} className="glass-card-elevated rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-sm">{cat.label}</p>
                    <span className="text-[9px] text-white/30 uppercase tracking-widest">{cat.section}</span>
                  </div>
                  {audition.notes && (
                    <p className="text-white/40 text-xs mt-1 line-clamp-1">{audition.notes}</p>
                  )}
                  {audition.admin_notes && (
                    <p className="text-gold/60 text-xs mt-1 italic">"{audition.admin_notes}"</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {audition.audio_url && (
                    <a
                      href={audition.audio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/30 hover:text-gold transition-colors"
                      title="Play sample"
                    >
                      <SvgIcon name="play_circle" size={20} />
                    </a>
                  )}
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission form */}
      <div className="glass-card-elevated rounded-2xl p-6 md:p-8 border-white/5 space-y-6">
        <div>
          <h2 className="text-xl font-black tracking-tighter">Submit New Audition</h2>
          <p className="text-white/40 text-sm mt-1">Upload a 30–60 second audio sample of your best performance.</p>
        </div>

        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald/10 border border-emerald/20 text-emerald text-sm font-bold">
            <SvgIcon name="check_circle" size={20} />
            {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
            <SvgIcon name="error_circle" size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gold">
              Role / Category *
            </label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as AuditionCategory }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors appearance-none"
            >
              <option value="">Select your role...</option>
              {Object.entries(grouped).map(([section, items]) => (
                <optgroup key={section} label={section}>
                  {items.map(({ value, meta }) => (
                    <option key={value} value={value}>{meta.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Audio upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gold">
              Audio Sample (MP3, M4A, WAV — max 20MB)
            </label>
            <div
              className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-gold/30 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {form.audioFile ? (
                <div className="flex items-center justify-center gap-3 text-gold">
                  <SvgIcon name="music" size={24} />
                  <span className="text-sm font-bold">{form.audioFile.name}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <SvgIcon name="cloud_upload" size={32} className="text-white/20 mx-auto" />
                  <p className="text-white/40 text-sm">Click to upload your audio sample</p>
                  <p className="text-white/20 text-xs">Or record a WhatsApp voice note and save as MP3</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Brief Introduction</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm font-medium text-white outline-none focus:border-gold/50 transition-colors resize-none"
              placeholder="Tell the coordinators about your musical background and experience..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !form.category}
            className="w-full py-4 bg-gold text-brown rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-glow disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <SvgIcon name="loader" size={20} className="animate-spin" />
                {uploadProgress || "Submitting..."}
              </>
            ) : (
              <>
                <SvgIcon name="send" size={20} />
                Submit Audition
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
