"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../../AuthContext";
import type { Resource, ResourceType } from "@/integrations/supabase/types";
import SvgIcon from "@/components/ui/SvgIcon";

const resourceTypes: { value: ResourceType; label: string }[] = [
  { value: "lyrics_pdf",          label: "Lyrics PDF" },
  { value: "chord_chart_pdf",     label: "Chord Chart PDF" },
  { value: "vocal_stem_audio",    label: "Vocal Stem (Audio)" },
  { value: "backing_track_audio", label: "Backing Track (Audio)" },
  { value: "rehearsal_video",     label: "Rehearsal Video" },
  { value: "announcement",        label: "Announcement" },
  { value: "other",               label: "Other" },
];

const allowedRoles = [
  { value: "applicant",    label: "All members (incl. Applicants)" },
  { value: "choir_member", label: "Choir & Band Members only" },
  { value: "chapter_admin",label: "Admins only" },
];

async function uploadResourceDirectToR2(file: File): Promise<{ url: string; bytes: number; mimeType: string }> {
  const sigRes = await fetch("/api/r2-upload-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, contentType: file.type }),
  });
  if (!sigRes.ok) throw new Error("Could not get R2 upload credentials");
  const { uploadUrl, finalUrl } = await sigRes.json();

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!uploadRes.ok) throw new Error("R2 direct upload failed");

  return { url: finalUrl, bytes: file.size, mimeType: file.type };
}

async function uploadMediaViaPipeline(file: File, onStatus: (status: string) => void): Promise<{ url: string; publicId: string; bytes: number; mimeType: string }> {
  onStatus("Processing at Cloudinary Edge...");
  
  const uploadPreset = file.type.startsWith('image/') ? 'ml_image' : 'ml_default';
  
  const sigRes = await fetch("/api/upload-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "aflewo_resources", uploadPreset }),
  });
  if (!sigRes.ok) throw new Error("Could not get Cloudinary credentials");
  const { signature, timestamp, cloudName, apiKey, folder, uploadPreset: signedPreset } = await sigRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", apiKey);
  formData.append("folder", folder);
  if (signedPreset) formData.append("upload_preset", signedPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Cloudinary upload failed");
  const data = await res.json();

  onStatus("Mirroring optimized file to R2 Vault...");
  const mirrorRes = await fetch("/api/mirror-to-r2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cloudinaryUrl: data.secure_url,
      cloudinaryPublicId: data.public_id,
      resourceType: data.resource_type,
      fileName: file.name,
      contentType: file.type
    }),
  });
  if (!mirrorRes.ok) throw new Error("Failed to mirror to R2 Vault");
  const mirrorData = await mirrorRes.json();

  return {
    url: mirrorData.r2Url,
    publicId: data.public_id,
    bytes: data.bytes,
    mimeType: data.format ? `${data.resource_type}/${data.format}` : file.type,
  };
}

export default function AdminResourcesPage() {
  const { profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    resourceType: "lyrics_pdf" as ResourceType,
    allowedRole: "choir_member",
    songTitle: "",
    file: null as File | null,
  });

  const isAdmin = profile && ["chapter_admin", "super_admin"].includes(profile.role);

  useEffect(() => {
    if (profile && isAdmin) loadResources();
  }, [profile]);

  const loadResources = async () => {
    const { data } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    setResources((data || []) as Resource[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file || !form.title || !profile) return;
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      let uploaded;
      if (form.file.type.includes('pdf') || form.file.type.includes('zip') || form.file.type.includes('text')) {
        setUploadStatus("Uploading directly to R2 Vault...");
        const res = await uploadResourceDirectToR2(form.file);
        uploaded = { ...res, publicId: "r2_direct" };
      } else {
        uploaded = await uploadMediaViaPipeline(form.file, setUploadStatus);
      }

      setUploadStatus("Saving to database...");
      const { error: insertError } = await supabase.from("resources").insert({
        title: form.title,
        description: form.description || null,
        resource_type: form.resourceType,
        file_url: uploaded.url,
        file_public_id: uploaded.publicId,
        file_size_bytes: uploaded.bytes,
        mime_type: uploaded.mimeType,
        allowed_role: form.allowedRole as Resource["allowed_role"],
        chapter_id: form.allowedRole === "applicant" ? null : (profile.chapter_id || null),
        song_title: form.songTitle || null,
        uploaded_by: profile.id,
        is_active: true,
      });

      if (insertError) throw insertError;

      setSuccess(`"${form.title}" uploaded successfully.`);
      setForm({
        title: "",
        description: "",
        resourceType: "lyrics_pdf",
        allowedRole: "choir_member",
        songTitle: "",
        file: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadResources();
    } catch (err) {
      console.error("[admin/resources] Upload error:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadStatus(null);
    }
  };

  const toggleActive = async (resource: Resource) => {
    await supabase
      .from("resources")
      .update({ is_active: !resource.is_active })
      .eq("id", resource.id);
    setResources(prev =>
      prev.map(r => r.id === resource.id ? { ...r, is_active: !r.is_active } : r)
    );
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-24">
        <SvgIcon name="block" size={48} className="text-white/10 mx-auto" />
        <p className="text-white/30 font-bold mt-4">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black tracking-tighter">Upload <span className="text-gold">Resources</span></h1>
        <p className="text-white/40 text-sm mt-1">Add lyrics, chord charts, audio stems, and rehearsal materials for your team.</p>
      </div>

      {/* Upload Form */}
      <div className="glass-card-elevated rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-black tracking-tighter">New Resource</h2>

        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald/10 border border-emerald/20 text-emerald text-sm font-bold">
            <SvgIcon name="check_circle" size={18} /> {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
            <SvgIcon name="error_circle" size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gold">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none focus:border-gold/50 transition-colors"
                placeholder="e.g. Soprano Part — Amazing Grace"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gold">Song Title (optional)</label>
              <input
                value={form.songTitle}
                onChange={(e) => setForm(p => ({ ...p, songTitle: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none focus:border-gold/50 transition-colors"
                placeholder="e.g. Amazing Grace"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gold">Resource Type *</label>
              <select
                value={form.resourceType}
                onChange={(e) => setForm(p => ({ ...p, resourceType: e.target.value as ResourceType }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white outline-none focus:border-gold/50 transition-colors appearance-none"
              >
                {resourceTypes.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gold">Access Level *</label>
              <select
                value={form.allowedRole}
                onChange={(e) => setForm(p => ({ ...p, allowedRole: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white outline-none focus:border-gold/50 transition-colors appearance-none"
              >
                {allowedRoles.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Description (optional)</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none focus:border-gold/50 transition-colors resize-none"
              placeholder="Brief description of this file..."
            />
          </div>

          {/* File picker */}
          <div
            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-gold/30 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {form.file ? (
              <div className="flex items-center justify-center gap-3 text-gold">
                <SvgIcon name="upload" size={24} />
                <div className="text-left">
                  <p className="text-sm font-bold">{form.file.name}</p>
                  <p className="text-xs text-white/30">{(form.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <SvgIcon name="upload_cloud" size={32} className="text-white/20 mx-auto" />
                <p className="text-white/40 text-sm">Click to select a file</p>
                <p className="text-white/20 text-xs">PDF, MP3, M4A, WAV, MP4 supported</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.mp3,.m4a,.wav,.aac,.mp4,.mov"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setForm(p => ({ ...p, file: f }));
              }}
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !form.file || !form.title}
            className="w-full py-4 bg-gold text-brown rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {uploading ? (
              <><SvgIcon name="loader" size={18} className="animate-spin" /> {uploadStatus || "Uploading..."}</>
            ) : (
              <><SvgIcon name="upload" size={18} /> Upload Resource</>
            )}
          </button>
        </form>
      </div>

      {/* Existing resources */}
      <div className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-white/40">
          Uploaded Resources ({resources.length})
        </h2>
        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl" />)}
          </div>
        ) : resources.length === 0 ? (
          <p className="text-white/20 text-sm text-center py-12">No resources uploaded yet.</p>
        ) : (
          <div className="space-y-2">
            {resources.map((resource) => (
              <div key={resource.id} className={`glass-card rounded-xl px-4 py-3 flex items-center gap-4 ${!resource.is_active ? "opacity-40" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-black truncate">{resource.title}</p>
                    <span className="text-[9px] text-white/30 uppercase tracking-widest">{resource.resource_type.replace(/_/g, " ")}</span>
                  </div>
                  {resource.song_title && (
                    <p className="text-xs text-white/30 mt-0.5">{resource.song_title}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-gold transition-colors" title="Open file">
                    <SvgIcon name="external" size={16} />
                  </a>
                  <button
                    onClick={() => toggleActive(resource)}
                    className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all ${
                      resource.is_active
                        ? "text-emerald border-emerald/30 hover:bg-emerald/10"
                        : "text-white/30 border-white/10 hover:bg-white/5"
                    }`}
                  >
                    {resource.is_active ? "Active" : "Hidden"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
