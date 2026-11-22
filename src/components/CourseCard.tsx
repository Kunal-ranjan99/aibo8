"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, Cpu, Heart, Star, Users } from "lucide-react";
import { CourseData } from "@/lib/types";

export function CourseCard({ course }: { course: CourseData }) {
  const effectivePrice = course.discountPrice ?? course.price;
  const [saved, setSaved] = useState(false);

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id }),
    });
    if (res.ok) {
      setSaved((s) => !s);
    }
  }

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="glass-card glass-card-hover group flex flex-col overflow-hidden rounded-2xl"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#070B18]">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B18] via-transparent to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5 pr-20">
          <span className="rounded-full border border-cyan-400/35 bg-[#050814]/85 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-300 backdrop-blur-md keep-white">
            {course.categoryName}
          </span>
          {course.subCategoryName && (
            <span className="rounded-full border border-white/15 bg-[#050814]/80 px-2.5 py-0.5 text-[10px] font-medium text-slate-200 backdrop-blur-md keep-white">
              {course.subCategoryName}
            </span>
          )}
        </div>

        {/* Wishlist Heart + Price Badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleWishlist}
            title="Save to Wishlist"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-[#050814]/80 text-white backdrop-blur-md transition hover:scale-110"
          >
            <Heart className={`h-3.5 w-3.5 ${saved ? "fill-rose-500 text-rose-500" : "text-white"}`} />
          </button>
          {course.isFree ? (
            <span className="rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-950">
              Free
            </span>
          ) : course.discountPrice ? (
            <span className="rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-2.5 py-0.5 text-[11px] font-bold text-slate-950">
              Save {Math.round(((course.price - course.discountPrice) / course.price) * 100)}%
            </span>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-amber-400">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <strong className="text-slate-100">{course.rating.toFixed(1)}</strong>
            <span className="text-slate-500">({course.reviewsCount})</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-cyan-400/80" />
            {course.duration}
          </span>
        </div>

        <h3 className="font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-cyan-300">
          {course.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
          {course.shortDescription}
        </p>

        {/* Hardware Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {course.hardwareTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono-code text-[11px] text-slate-300"
            >
              <Cpu className="h-2.5 w-2.5 text-cyan-400" />
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 mt-5">
          <div>
            <div className="text-xs font-medium text-slate-300">{course.instructorName}</div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Users className="h-3 w-3" /> {course.studentsCount.toLocaleString()} learners
            </div>
          </div>

          <div className="text-right">
            {course.isFree ? (
              <span className="font-display text-lg font-bold text-emerald-400">Free</span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-lg font-bold text-white">${effectivePrice}</span>
                {course.discountPrice && (
                  <span className="text-xs text-slate-500 line-through">${course.price}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
