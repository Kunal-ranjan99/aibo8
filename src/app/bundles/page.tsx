import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import { getAllCourses } from "@/lib/store";
import { getBundles } from "@/lib/lms-extras";
import { getSession } from "@/lib/auth";
import { BundleCheckoutButton } from "@/components/BundleCheckoutButton";

export const dynamic = "force-dynamic";

export default async function BundlesPage() {
  const [courses, user] = await Promise.all([getAllCourses(false), getSession()]);
  const bundles = getBundles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          <Package className="h-4 w-4" /> Multi-Course Value Packs
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-5xl">
          School &amp; College Course Bundles
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Enroll in a full AI, Robotics, or IoT learning track at once, save up to 52%, and get an
          instant GST PDF receipt via Razorpay or PhonePe.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {bundles.map((b) => {
          const included = courses.filter((c) => b.courseIds.includes(c.id));
          return (
            <div key={b.id} className="glass-card overflow-hidden rounded-3xl flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img src={b.thumbnail} alt={b.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B18] via-[#070B18]/40 to-transparent" />
                <div className="absolute left-5 top-5 flex gap-2">
                  <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-950">
                    {b.badge}
                  </span>
                  <span className="rounded-full border border-white/20 bg-[#050814]/80 px-3 py-1 text-xs font-semibold text-white keep-white">
                    {b.ageGroup}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="font-display text-2xl font-bold text-white">{b.title}</h2>
                  <p className="text-sm text-slate-400">{b.tagline}</p>

                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Included Courses ({included.length})
                    </div>
                    {included.map((c) => (
                      <Link
                        key={c.id}
                        href={`/courses/${c.slug}`}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm hover:border-cyan-400/50"
                      >
                        <span className="flex items-center gap-2 text-slate-200">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          {c.title}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">{c.duration}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-5 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Bundle Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl font-bold text-emerald-400">
                        ₹{b.bundlePrice}
                      </span>
                      <span className="text-sm text-slate-500 line-through">₹{b.regularTotal}</span>
                    </div>
                  </div>
                  <BundleCheckoutButton
                    bundleId={b.id}
                    price={b.bundlePrice}
                    isLoggedIn={Boolean(user)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
