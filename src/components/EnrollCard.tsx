"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  Clock,
  CreditCard,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  Tag,
  Ticket,
} from "lucide-react";
import { CourseData } from "@/lib/types";

export function EnrollCard({
  course,
  isEnrolled,
  isLoggedIn,
}: {
  course: CourseData;
  isEnrolled: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [gateway, setGateway] = useState<"RAZORPAY" | "PHONEPE">("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const [playingIntro, setPlayingIntro] = useState(false);

  const basePrice = course.discountPrice ?? course.price;
  const finalPrice = course.isFree ? 0 : Math.max(0, Math.round(basePrice * (1 - discount / 100)));

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (code === "AIBO20") {
      setDiscount(20);
      setCouponMsg("20% off applied (AIBO20)");
    } else if (code === "ROBOTICS50") {
      setDiscount(50);
      setCouponMsg("50% off applied (ROBOTICS50)");
    } else if (code === "LAUNCH100") {
      setDiscount(100);
      setCouponMsg("100% launch grant applied!");
    } else {
      setDiscount(0);
      setCouponMsg("Try AIBO20, ROBOTICS50, or LAUNCH100");
    }
  }

  async function handleEnroll() {
    if (!isLoggedIn) {
      router.push(`/auth/login?next=/courses/${course.slug}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "checkout",
          itemType: "COURSE",
          itemId: course.id,
          gateway: finalPrice === 0 ? "FREE" : gateway,
          couponCode: coupon,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (finalPrice > 0 && data.invoice?.id) {
          router.push(`/invoices/${data.invoice.id}`);
        } else {
          router.push(`/learn/${course.slug}`);
        }
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

  return (
    <div className="glass-card sticky top-24 overflow-hidden rounded-2xl">
      <div className="relative aspect-video overflow-hidden bg-black">
        {playingIntro && course.introVideoUrl ? (
          course.introVideoUrl.endsWith(".mp4") || course.introVideoUrl.endsWith(".webm") ? (
            <video src={course.introVideoUrl} controls autoPlay className="h-full w-full object-cover" />
          ) : (
            <iframe
              src={course.introVideoUrl}
              title={`${course.title} Intro Video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )
        ) : (
          <>
            <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
              {course.introVideoUrl ? (
                <button
                  type="button"
                  onClick={() => setPlayingIntro(true)}
                  className="flex items-center gap-2 rounded-full border border-cyan-400/50 bg-[#050814]/85 px-4 py-2 text-xs font-semibold text-cyan-200 backdrop-blur-md transition hover:scale-105 keep-white"
                >
                  <PlayCircle className="h-4 w-4 text-cyan-400" />
                  Watch Course Intro Video
                </button>
              ) : (
                <Link
                  href={`/learn/${course.slug}`}
                  className="flex items-center gap-2 rounded-full border border-cyan-400/50 bg-[#050814]/85 px-4 py-2 text-xs font-semibold text-cyan-200 backdrop-blur-md transition hover:scale-105 keep-white"
                >
                  <PlayCircle className="h-4 w-4 text-cyan-400" />
                  Preview Course Studio
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      <div className="p-6 space-y-5">
        {/* Pricing */}
        <div className="flex items-baseline justify-between">
          {finalPrice === 0 ? (
            <span className="font-display text-3xl font-bold text-emerald-400">Free</span>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-white">${finalPrice}</span>
              {(course.discountPrice || discount > 0) && (
                <span className="text-sm text-slate-500 line-through">${course.price}</span>
              )}
            </div>
          )}
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-300">
            Instant PDF Invoice
          </span>
        </div>

        {/* Razorpay / PhonePe selector for Paid courses */}
        {!isEnrolled && finalPrice > 0 && (
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Select Payment Method
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGateway("RAZORPAY")}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition ${
                  gateway === "RAZORPAY"
                    ? "border-cyan-400 bg-cyan-500/15 text-cyan-300"
                    : "border-white/10 bg-white/5 text-slate-300"
                }`}
              >
                <CreditCard className="h-3.5 w-3.5" /> Razorpay
              </button>
              <button
                type="button"
                onClick={() => setGateway("PHONEPE")}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition ${
                  gateway === "PHONEPE"
                    ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                    : "border-white/10 bg-white/5 text-slate-300"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" /> PhonePe UPI
              </button>
            </div>
          </div>
        )}

        {/* Action Button */}
        {isEnrolled ? (
          <Link
            href={`/learn/${course.slug}`}
            className="btn-cyber flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white"
          >
            <PlayCircle className="h-4 w-4" />
            Continue Learning
          </Link>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={loading}
            className="btn-cyber flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading
              ? "Processing Payment..."
              : finalPrice === 0
              ? "Enroll Free Instantly"
              : `Pay $${finalPrice} via ${gateway}`}
          </button>
        )}

        {/* Coupon Input */}
        {!isEnrolled && !course.isFree && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Ticket className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon (AIBO20)"
                  className="w-full rounded-xl border border-white/10 bg-[#050814] py-2 pl-9 pr-3 text-xs uppercase text-white placeholder:normal-case placeholder:text-slate-500"
                />
              </div>
              <button
                type="button"
                onClick={applyCoupon}
                className="rounded-xl border border-white/15 bg-white/5 px-3.5 text-xs font-semibold text-slate-200 hover:border-cyan-400/40"
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <p className={`text-xs ${discount > 0 ? "text-emerald-400" : "text-amber-300"}`}>
                <Tag className="mr-1 inline h-3 w-3" />
                {couponMsg}
              </p>
            )}
          </div>
        )}

        {/* Course Includes */}
        <div className="space-y-2.5 border-t border-white/10 pt-4 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>{course.duration} of HD labs &amp; hardware walkthroughs</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            <span>{totalLessons} lessons, code labs &amp; timed exams</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Award className="h-4 w-4 text-cyan-400" />
            <span>Official Aibo8 verified certificate</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Direct mentor Q&amp;A + downloadable PDF invoice</span>
          </div>
        </div>
      </div>
    </div>
  );
}
