import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, BookOpen, CheckCircle2, FileText, Heart, MessageSquare, PlayCircle, Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getAllCourses, getUserCertificates, getUserEnrollments } from "@/lib/store";
import { getUserInvoices, getUserWishlist } from "@/lib/lms-extras";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const user = await getSession();
  if (!user) redirect("/auth/login");

  const [courses, enrollments, certificates] = await Promise.all([
    getAllCourses(true),
    getUserEnrollments(user.id),
    getUserCertificates(user.id),
  ]);

  const invoices = getUserInvoices(user.id);
  const wishlistIds = getUserWishlist(user.id);
  const wishlistCourses = courses.filter((c) => wishlistIds.includes(c.id));

  const enrolledItems = enrollments
    .map((e) => ({
      enrollment: e,
      course: courses.find((c) => c.id === e.courseId),
    }))
    .filter((x) => Boolean(x.course));

  const avgProgress =
    enrolledItems.length > 0
      ? Math.round(
          enrolledItems.reduce((a, x) => a + x.enrollment.progress, 0) / enrolledItems.length
        )
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Student Learning Portal
          </span>
          <h1 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">
            Welcome back, {user.name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/messages"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:border-cyan-400/50"
          >
            <MessageSquare className="h-4 w-4 text-cyan-400" />
            Mentor Inbox
          </Link>
          <Link
            href="/courses"
            className="btn-cyber inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white"
          >
            <Sparkles className="h-4 w-4" />
            Browse More Labs
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Enrolled</span>
            <BookOpen className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-white">{enrolledItems.length}</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Avg Progress</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-cyan-300">{avgProgress}%</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Certificates</span>
            <Award className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-white">{certificates.length}</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Wishlist</span>
            <Heart className="h-5 w-5 text-rose-400" />
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-white">{wishlistCourses.length}</div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-white">My Active Courses</h2>
        {enrolledItems.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="font-display text-lg font-bold text-white">No courses enrolled yet</p>
            <Link
              href="/courses"
              className="btn-cyber mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {enrolledItems.map(({ enrollment, course }) => (
              <div key={enrollment.id} className="glass-card overflow-hidden rounded-2xl flex flex-col sm:flex-row">
                <img
                  src={course!.thumbnail}
                  alt={course!.title}
                  className="h-44 w-full object-cover sm:h-auto sm:w-44"
                />
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <span className="text-[11px] font-semibold uppercase text-cyan-400">
                      {course!.categoryName}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-bold text-white">{course!.title}</h3>
                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-slate-400">Completion</span>
                        <span className="font-semibold text-cyan-300">{enrollment.progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/learn/${course!.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:underline"
                    >
                      <PlayCircle className="h-4 w-4" />
                      {enrollment.progress >= 100 ? "Review Lessons" : "Continue Learning"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Certificates + Purchase Invoices */}
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Verified Certificates</h2>
          {certificates.length === 0 ? (
            <p className="text-sm text-slate-400">
              Complete 100% of lessons and pass objective exams to unlock your official diploma.
            </p>
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="glass-card flex items-center justify-between gap-4 rounded-2xl p-4">
                  <div>
                    <div className="text-xs font-mono-code text-cyan-300">{cert.verifyCode}</div>
                    <h3 className="mt-0.5 font-display font-bold text-white">{cert.courseTitle}</h3>
                  </div>
                  <Link
                    href={`/certificates/${cert.id}`}
                    className="btn-cyber shrink-0 rounded-xl px-4 py-2 text-xs font-semibold text-white"
                  >
                    Open Diploma
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <FileText className="h-5 w-5 text-cyan-400" /> Purchase Receipts &amp; PDF Invoices
          </h2>
          {invoices.length === 0 ? (
            <p className="text-sm text-slate-400">No invoices generated yet.</p>
          ) : (
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="glass-card flex items-center justify-between gap-4 rounded-2xl p-4">
                  <div>
                    <div className="text-xs font-mono-code text-slate-400">
                      {inv.invoiceNumber} • {inv.gateway}
                    </div>
                    <div className="font-semibold text-white text-sm">{inv.itemTitle}</div>
                    <div className="text-xs text-emerald-400 font-bold">
                      Paid: {inv.currencySymbol}
                      {inv.totalPaid.toFixed(2)}
                    </div>
                  </div>
                  <Link
                    href={`/invoices/${inv.id}`}
                    className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
                  >
                    PDF Receipt
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Saved Wishlist */}
      {wishlistCourses.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <Heart className="h-5 w-5 text-rose-400" /> Saved Wishlist
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistCourses.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.slug}`}
                className="glass-card glass-card-hover flex items-center gap-3 rounded-2xl p-3.5"
              >
                <img src={c.thumbnail} alt={c.title} className="h-14 w-20 rounded-xl object-cover" />
                <div className="min-w-0">
                  <div className="truncate font-display text-sm font-bold text-white">{c.title}</div>
                  <div className="text-xs text-cyan-300">
                    {c.isFree ? "Free" : `₹${c.discountPrice ?? c.price}`}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
