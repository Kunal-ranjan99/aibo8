"use client";

import { useState } from "react";
import { Image as ImageIcon, Loader2, Upload, Video } from "lucide-react";

interface Props {
  thumbnail: string;
  onThumbnailChange: (url: string) => void;
  introVideoUrl: string;
  onIntroVideoChange: (url: string) => void;
}

export function MediaUploadFields({
  thumbnail,
  onThumbnailChange,
  introVideoUrl,
  onIntroVideoChange,
}: Props) {
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingVid, setUploadingVid] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function uploadFile(file: File, kind: "image" | "video") {
    setUploadError("");
    if (kind === "image") setUploadingImg(true);
    else setUploadingVid(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Upload failed.");
        return;
      }
      if (kind === "image") onThumbnailChange(data.url);
      else onIntroVideoChange(data.url);
    } catch {
      setUploadError("Network error while uploading file.");
    } finally {
      if (kind === "image") setUploadingImg(false);
      else setUploadingVid(false);
    }
  }

  return (
    <div className="md:col-span-2 rounded-2xl border border-cyan-400/20 bg-white/[0.02] p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          Course Media — Intro Image &amp; Promo Video
        </span>
        {uploadError && <span className="text-xs font-semibold text-rose-400">{uploadError}</span>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Course Intro / Thumbnail Image */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <ImageIcon className="h-3.5 w-3.5 text-cyan-400" /> Course Intro / Thumbnail Image
          </label>
          <div className="flex gap-2">
            <input
              value={thumbnail}
              onChange={(e) => onThumbnailChange(e.target.value)}
              placeholder="Paste image URL or upload file..."
              className="flex-1 min-w-0 rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
            />
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/25 shrink-0">
              {uploadingImg ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              <span>{uploadingImg ? "Uploading..." : "Upload"}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f, "image");
                }}
              />
            </label>
          </div>
          {thumbnail && (
            <img
              src={thumbnail}
              alt="Course thumbnail preview"
              className="h-28 w-full rounded-xl border border-white/10 object-cover"
            />
          )}
        </div>

        {/* Course Intro / Preview Video */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Video className="h-3.5 w-3.5 text-indigo-400" /> Course Intro / Preview Video
          </label>
          <div className="flex gap-2">
            <input
              value={introVideoUrl}
              onChange={(e) => onIntroVideoChange(e.target.value)}
              placeholder="YouTube embed URL or upload MP4..."
              className="flex-1 min-w-0 rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
            />
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-indigo-400/40 bg-indigo-500/15 px-3 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25 shrink-0">
              {uploadingVid ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              <span>{uploadingVid ? "Uploading..." : "Upload MP4"}</span>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f, "video");
                }}
              />
            </label>
          </div>
          {introVideoUrl ? (
            introVideoUrl.endsWith(".mp4") || introVideoUrl.endsWith(".webm") ? (
              <video
                src={introVideoUrl}
                controls
                className="h-28 w-full rounded-xl border border-white/10 bg-black object-cover"
              />
            ) : (
              <div className="flex h-28 items-center justify-center rounded-xl border border-indigo-400/30 bg-[#050814] px-3 text-center text-xs text-indigo-300">
                Intro video linked: <span className="ml-1 truncate font-mono-code">{introVideoUrl}</span>
              </div>
            )
          ) : (
            <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-white/15 text-xs text-slate-500">
              Optional: Upload an MP4 or paste a YouTube/Vimeo preview URL
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
