"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Mail, Megaphone, Plus, School, Video } from "lucide-react";
import { CourseData } from "@/lib/types";
import {
  AnnouncementItem,
  InstitutionBatchItem,
  LiveClassItem,
  SmtpSettings,
} from "@/lib/v3-features";

export function LiveAndAnnouncementsAdmin({
  courses,
  liveClasses,
  announcements,
}: {
  courses: CourseData[];
  liveClasses: LiveClassItem[];
  announcements: AnnouncementItem[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [platform, setPlatform] = useState<"Zoom" | "Google Meet" | "Jitsi">("Zoom");
  const [meetingUrl, setMeetingUrl] = useState("https://meet.google.com/new");
  const [scheduledAt, setScheduledAt] = useState("2026-12-05T11:00");

  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");

  async function createLive(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/v3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_live_class",
        title,
        courseId,
        platform,
        meetingUrl,
        scheduledAt: new Date(scheduledAt).toISOString(),
      }),
    });
    setTitle("");
    router.refresh();
  }

  async function postAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/v3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_announcement", title: annTitle, body: annBody }),
    });
    setAnnTitle("");
    setAnnBody("");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={createLive} className="glass-card rounded-2xl p-6 space-y-3">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
          <Video className="h-4 w-4 text-cyan-400" /> Schedule Live Workshop / Class
        </h3>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Workshop Title (e.g. Weekend Arduino Car Build)"
          className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
        />
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as "Zoom" | "Google Meet" | "Jitsi")}
            className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
          >
            <option value="Zoom">Zoom</option>
            <option value="Google Meet">Google Meet</option>
            <option value="Jitsi">Jitsi Meet</option>
          </select>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
          />
        </div>
        <input
          required
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
          placeholder="Meeting Join URL"
          className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
        />
        <button type="submit" className="btn-cyber inline-flex items-center gap-1 rounded-xl px-5 py-2 text-xs font-semibold text-white">
          <Plus className="h-3.5 w-3.5" /> Schedule Live Class
        </button>

        <div className="pt-3 border-t border-white/10 space-y-2">
          {liveClasses.map((lc) => (
            <div key={lc.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs">
              <div className="font-bold text-white">{lc.title}</div>
              <div className="text-cyan-300">{lc.platform} • {lc.courseTitle}</div>
            </div>
          ))}
        </div>
      </form>

      <form onSubmit={postAnnouncement} className="glass-card rounded-2xl p-6 space-y-3">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
          <Megaphone className="h-4 w-4 text-amber-400" /> Broadcast Announcement
        </h3>
        <input
          required
          value={annTitle}
          onChange={(e) => setAnnTitle(e.target.value)}
          placeholder="Announcement Headline"
          className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
        />
        <textarea
          required
          rows={3}
          value={annBody}
          onChange={(e) => setAnnBody(e.target.value)}
          placeholder="Message for students & parents..."
          className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
        />
        <button type="submit" className="btn-cyber inline-flex items-center gap-1 rounded-xl px-5 py-2 text-xs font-semibold text-white">
          <Plus className="h-3.5 w-3.5" /> Post Notice
        </button>

        <div className="pt-3 border-t border-white/10 space-y-2">
          {announcements.map((a) => (
            <div key={a.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs">
              <div className="font-bold text-white">{a.title}</div>
              <div className="text-slate-400 line-clamp-2">{a.body}</div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

export function InstitutionalBatchesAdmin({
  courses,
  batches,
}: {
  courses: CourseData[];
  batches: InstitutionBatchItem[];
}) {
  const router = useRouter();
  const [institutionName, setInstitutionName] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [maxSeats, setMaxSeats] = useState("100");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/v3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_batch",
        institutionName,
        batchCode,
        courseId,
        maxSeats: Number(maxSeats) || 50,
      }),
    });
    setInstitutionName("");
    setBatchCode("");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
          <School className="h-5 w-5 text-cyan-400" /> Create School / College Bulk Seat Batch
        </h3>
        <div className="grid gap-3 md:grid-cols-4">
          <input
            required
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            placeholder="School or College Name"
            className="rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
          />
          <input
            required
            value={batchCode}
            onChange={(e) => setBatchCode(e.target.value)}
            placeholder="BATCH-CODE-2026"
            className="rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 font-mono-code text-xs uppercase text-white"
          />
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={5}
            value={maxSeats}
            onChange={(e) => setMaxSeats(e.target.value)}
            placeholder="Seats"
            className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
          />
        </div>
        <button type="submit" className="btn-cyber rounded-xl px-5 py-2 text-xs font-semibold text-white">
          + Generate Institutional Batch
        </button>
      </form>

      <div className="glass-card overflow-hidden rounded-2xl">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase text-slate-400">
            <tr>
              <th className="px-5 py-3">School / College</th>
              <th className="px-5 py-3">Batch Code</th>
              <th className="px-5 py-3">Course</th>
              <th className="px-5 py-3 text-right">Seats Used</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {batches.map((b) => (
              <tr key={b.id}>
                <td className="px-5 py-3.5 font-semibold text-white">{b.institutionName}</td>
                <td className="px-5 py-3.5 font-mono-code text-xs font-bold text-cyan-300">{b.batchCode}</td>
                <td className="px-5 py-3.5 text-slate-300">{b.courseTitle}</td>
                <td className="px-5 py-3.5 text-right font-bold text-emerald-400">
                  {b.usedSeats} / {b.maxSeats}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SmtpSettingsAdmin({ initial }: { initial: SmtpSettings }) {
  const [smtp, setSmtp] = useState(initial);
  const [saved, setSaved] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/v3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_smtp", smtp }),
    });
    setSaved(true);
  }

  return (
    <form onSubmit={save} className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
          <Mail className="h-4 w-4 text-cyan-400" /> Email / SMTP &amp; AWS SES Configuration
        </h3>
        {saved && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={smtp.host}
          onChange={(e) => setSmtp((s) => ({ ...s, host: e.target.value }))}
          placeholder="SMTP Host (e.g. email-smtp.ap-south-1.amazonaws.com)"
          className="rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
        />
        <input
          type="number"
          value={smtp.port}
          onChange={(e) => setSmtp((s) => ({ ...s, port: Number(e.target.value) || 587 }))}
          placeholder="Port (587)"
          className="rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
        />
        <input
          value={smtp.username}
          onChange={(e) => setSmtp((s) => ({ ...s, username: e.target.value }))}
          placeholder="SMTP Username"
          className="rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
        />
        <input
          value={smtp.fromEmail}
          onChange={(e) => setSmtp((s) => ({ ...s, fromEmail: e.target.value }))}
          placeholder="From Email"
          className="rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
        />
      </div>
      <button type="submit" className="btn-cyber rounded-xl px-5 py-2 text-xs font-semibold text-white">
        Save SMTP Settings
      </button>
    </form>
  );
}
