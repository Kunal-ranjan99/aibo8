import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Code2,
  Cpu,
  FileText,
  HelpCircle,
  PlayCircle,
  Star,
  Users,
} from "lucide-react";
import { getCourseBySlug, getUserEnrollments } from "@/lib/store";
import { getPaymentSettings } from "@/lib/lms-extras";
import { getSession } from "@/lib/auth";
import { EnrollCard } from "@/components/EnrollCard";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const user = await getSession();
  const enrollments = user ? await getUserEnrollments(user.id) : [];
  const isEnrolled = enrollments.some((e) => e.courseId === course.id);
  const { activeGateway } = getPaymentSettings();

  return (
    <div className="pb-20">
      {/* Top Banner */}
      <section className="border-b border-white/10 bg-[#070B18] cyber-grid">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-400/35 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {course.categoryName}
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                  {course.level}
                </span>
                <span className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <strong className="text-white">{course.rating.toFixed(1)}</strong>
                  <span className="text-slate-400">({course.reviewsCount} reviews)</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Users className="h-3.5 w-3.5 text-cyan-400" />
                  {course.studentsCount.toLocaleString()} students
                </span>
              </div>

              <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
                {course.title}
              </h1>

              <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
                {course.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {course.hardwareTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 font-mono-code text-xs text-cyan-200"
                  >
                    <Cpu className="h-3 w-3 text-cyan-400" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2 text-sm text-slate-400">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 font-display text-sm font-bold text-white">
                  {course.instructorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold text-white">{course.instructorName}</div>
                  <div className="text-xs text-slate-400">{course.instructorTitle}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <EnrollCard
                course={course}
                isEnrolled={isEnrolled}
                isLoggedIn={Boolean(user)}
                activeGateway={activeGateway}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-10">
            {/* Outcomes */}
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-white">What You Will Build & Master</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {course.outcomes.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-white">Course Overview</h2>
              <p className="leading-relaxed text-slate-300">{course.description}</p>
            </div>

            {/* Curriculum */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-white">Course Curriculum</h2>
              <div className="space-y-4">
                {course.sections.map((sec) => (
                  <div key={sec.id} className="glass-card overflow-hidden rounded-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4">
                      <h3 className="font-display font-bold text-white">{sec.title}</h3>
                      <span className="text-xs text-slate-400">{sec.lessons.length} lessons</span>
                    </div>
                    <div className="divide-y divide-white/5">
                      {sec.lessons.map((les) => {
                        const Icon =
                          les.type === "CODE_LAB"
                            ? Code2
                            : les.type === "QUIZ"
                            ? HelpCircle
                            : les.type === "ARTICLE"
                            ? FileText
                            : PlayCircle;
                        return (
                          <div
                            key={les.id}
                            className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4 shrink-0 text-cyan-400" />
                              <span className="text-slate-200">{les.title}</span>
                              {les.isPreview && (
                                <span className="rounded bg-cyan-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-cyan-300">
                                  Preview
                                </span>
                              )}
                            </div>
                            <span className="shrink-0 font-mono-code text-xs text-slate-500">
                              {les.duration}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-white">Hardware & Prerequisites</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {course.requirements.map((req) => (
                  <li key={req} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-white">
                Student Reviews ({course.reviews.length})
              </h2>
              {course.reviews.length === 0 ? (
                <p className="text-sm text-slate-400">No reviews yet. Be the first to review after enrolling!</p>
              ) : (
                <div className="space-y-3">
                  {course.reviews.map((rev) => (
                    <div key={rev.id} className="glass-card rounded-xl p-5">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-white">{rev.userName}</div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{rev.comment}</p>
                      <div className="mt-2 text-xs text-slate-500">{rev.createdAt}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
