import { Calendar, ExternalLink, Flame, Megaphone, Trophy, Video } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getAnnouncements, getLeaderboard, getLiveClasses } from "@/lib/v3-features";
import { BatchRedeemBox } from "@/components/BatchRedeemBox";

export const dynamic = "force-dynamic";

export default async function CommunityHubPage() {
  const user = await getSession();
  const liveClasses = getLiveClasses();
  const announcements = getAnnouncements();
  const leaderboard = getLeaderboard();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Live Workshops, XP &amp; Noticeboard
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-5xl">
          Aibo8 Student Community Hub
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Join live weekend robotics &amp; AI classes, climb the student XP leaderboard, read
          hackathon announcements, and redeem school/college batch seats.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Live Classes + Announcements */}
        <div className="lg:col-span-7 space-y-8">
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
              <Video className="h-5 w-5 text-cyan-400" /> Upcoming Live Classes &amp; Workshops
            </h2>
            <div className="space-y-4">
              {liveClasses.map((lc) => (
                <div key={lc.id} className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-cyan-300">
                      {lc.platform} • {lc.durationMin} mins
                    </span>
                    <h3 className="font-display text-lg font-bold text-white">{lc.title}</h3>
                    <p className="text-xs text-slate-400">
                      Host: <strong className="text-slate-200">{lc.hostName}</strong> • {lc.courseTitle}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-cyan-300">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(lc.scheduledAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <a
                    href={lc.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-cyber inline-flex shrink-0 items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold text-white"
                  >
                    Join Live <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
              <Megaphone className="h-5 w-5 text-amber-400" /> Announcements &amp; Noticeboard
            </h2>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="glass-card rounded-2xl p-5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-bold text-white">{a.title}</h3>
                    <span className="text-[11px] text-slate-500">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{a.body}</p>
                  <div className="text-xs text-cyan-400">Posted by {a.author}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: XP Leaderboard + School/College Batch Redeem */}
        <div className="lg:col-span-5 space-y-6">
          <section className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white">
              <Trophy className="h-5 w-5 text-amber-400" /> Top Student Builders (XP)
            </h2>
            <div className="space-y-3">
              {leaderboard.map((st, idx) => (
                <div
                  key={st.userId}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-display text-xs font-bold ${
                        idx === 0
                          ? "bg-amber-400 text-slate-950"
                          : idx === 1
                          ? "bg-slate-300 text-slate-950"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">{st.name}</div>
                      <div className="text-[11px] text-slate-400">{st.level}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-sm font-bold text-cyan-300">{st.xp} XP</div>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-amber-300">
                      <Flame className="h-3 w-3" /> {st.streakDays}d streak
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <BatchRedeemBox isLoggedIn={Boolean(user)} />
        </div>
      </div>
    </div>
  );
}
