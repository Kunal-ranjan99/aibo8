import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, BookOpen, CheckCircle2, Flame, ShieldCheck, Trophy } from "lucide-react";
import { getAllCourses, getAllUsersForAdmin, getUserCertificates, getUserEnrollments } from "@/lib/store";
import { getAllAssignments } from "@/lib/lms-extras";
import { getGamificationForUser } from "@/lib/v3-features";

export const dynamic = "force-dynamic";

export default async function ParentPortalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const users = getAllUsersForAdmin();
  const student = users.find((u) => u.id === id);
  if (!student) notFound();

  const [courses, enrollments, certificates] = await Promise.all([
    getAllCourses(true),
    getUserEnrollments(student.id),
    getUserCertificates(student.id),
  ]);
  const gamification = getGamificationForUser(student.id, student.name);
  const assignments = getAllAssignments().filter((a) => a.userId === student.id);

  const avgProgress =
    enrollments.length > 0
      ? Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length)
      : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Parent &amp; Guardian Progress Report
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">{student.name}</h1>
          <p className="text-xs text-slate-400">{student.email} • {gamification.level}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-1 font-display text-xl font-bold text-amber-300">
              <Flame className="h-5 w-5" /> {gamification.streakDays}d
            </div>
            <div className="text-[10px] uppercase text-slate-400">Learning Streak</div>
          </div>
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-1 font-display text-xl font-bold text-cyan-300">
              <Trophy className="h-5 w-5" /> {gamification.xp} XP
            </div>
            <div className="text-[10px] uppercase text-slate-400">Total XP</div>
          </div>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex justify-between text-xs uppercase text-slate-400">
            <span>Courses Active</span>
            <BookOpen className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-white">{enrollments.length}</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex justify-between text-xs uppercase text-slate-400">
            <span>Avg Completion</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-emerald-400">{avgProgress}%</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex justify-between text-xs uppercase text-slate-400">
            <span>Earned Certificates</span>
            <Award className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-white">{certificates.length}</div>
        </div>
      </div>

      {/* Course Progress Breakdown */}
      <section className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-white">Course &amp; Exam Progress</h2>
        <div className="space-y-4">
          {enrollments.map((enr) => {
            const c = courses.find((x) => x.id === enr.courseId);
            if (!c) return null;
            const examEntries = Object.values(enr.quizScores || {});
            return (
              <div key={enr.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-display font-bold text-white">{c.title}</div>
                  <span className="text-xs font-bold text-cyan-300">{enr.progress}% Complete</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
                    style={{ width: `${enr.progress}%` }}
                  />
                </div>
                {examEntries.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 text-xs">
                    {examEntries.map((ex, i) => (
                      <span
                        key={i}
                        className={`rounded-full px-2.5 py-0.5 font-semibold ${
                          ex.passed
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        Objective Exam #{i + 1}: {ex.percent}% ({ex.passed ? "Passed" : "Retry"})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Graded Hardware Projects & Certificates */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="glass-card rounded-2xl p-6 space-y-3">
          <h2 className="font-display text-lg font-bold text-white">Graded Projects</h2>
          {assignments.length === 0 ? (
            <p className="text-xs text-slate-400">No project submissions yet.</p>
          ) : (
            assignments.map((a) => (
              <div key={a.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-xs space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>{a.projectTitle}</span>
                  <span className="text-emerald-400">{a.grade ? `${a.grade}/100` : "Submitted"}</span>
                </div>
                {a.feedback && <p className="text-slate-400">{a.feedback}</p>}
              </div>
            ))
          )}
        </section>

        <section className="glass-card rounded-2xl p-6 space-y-3">
          <h2 className="font-display text-lg font-bold text-white">Verified Certificates</h2>
          {certificates.length === 0 ? (
            <p className="text-xs text-slate-400">Certificates will appear here upon course completion.</p>
          ) : (
            certificates.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                <div>
                  <div className="font-bold text-white text-xs">{cert.courseTitle}</div>
                  <div className="font-mono-code text-[11px] text-cyan-300">{cert.verifyCode}</div>
                </div>
                <Link href={`/certificates/${cert.id}`} className="text-xs font-semibold text-cyan-400 hover:underline">
                  View →
                </Link>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
