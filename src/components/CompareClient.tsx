"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, CheckCircle2, Clock, Cpu, GitCompare, Star } from "lucide-react";
import { CourseData } from "@/lib/types";

export function CompareClient({ courses }: { courses: CourseData[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    courses.slice(0, 3).map((c) => c.id)
  );

  function setSlot(idx: number, courseId: string) {
    setSelectedIds((prev) => prev.map((id, i) => (i === idx ? courseId : id)));
  }

  const picked = selectedIds
    .map((id) => courses.find((c) => c.id === id))
    .filter((c): c is CourseData => Boolean(c));

  return (
    <div className="space-y-8">
      {/* Course Pickers */}
      <div className="glass-card grid gap-4 rounded-2xl p-5 md:grid-cols-3">
        {[0, 1, 2].map((slot) => (
          <div key={slot}>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cyan-400">
              Course {slot + 1}
            </label>
            <select
              value={selectedIds[slot] || ""}
              onChange={(e) => setSlot(slot, e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-xs font-semibold text-white"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Comparison Matrix */}
      <div className="glass-card overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="w-44 px-5 py-4 text-xs font-bold uppercase text-slate-400">
                <span className="flex items-center gap-1.5">
                  <GitCompare className="h-4 w-4 text-cyan-400" /> Feature
                </span>
              </th>
              {picked.map((c, i) => (
                <th key={`${c.id}-${i}`} className="px-5 py-4 align-top">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="mb-3 h-28 w-full rounded-xl object-cover"
                  />
                  <Link
                    href={`/courses/${c.slug}`}
                    className="font-display text-base font-bold text-white hover:text-cyan-300"
                  >
                    {c.title}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
            <tr>
              <td className="px-5 py-3.5 font-semibold text-slate-400">Category / Sub-Cat</td>
              {picked.map((c, i) => (
                <td key={i} className="px-5 py-3.5 text-cyan-300 font-medium">
                  {c.categoryName} › {c.subCategoryName}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-5 py-3.5 font-semibold text-slate-400">Price</td>
              {picked.map((c, i) => (
                <td key={i} className="px-5 py-3.5 font-display text-lg font-bold text-white">
                  {c.isFree ? (
                    <span className="text-emerald-400">Free</span>
                  ) : (
                    `₹${c.discountPrice ?? c.price}`
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-5 py-3.5 font-semibold text-slate-400">Level</td>
              {picked.map((c, i) => (
                <td key={i} className="px-5 py-3.5 text-slate-200">{c.level}</td>
              ))}
            </tr>
            <tr>
              <td className="px-5 py-3.5 font-semibold text-slate-400">Rating</td>
              {picked.map((c, i) => (
                <td key={i} className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="h-4 w-4 fill-amber-400" /> {c.rating.toFixed(1)}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-5 py-3.5 font-semibold text-slate-400">Duration</td>
              {picked.map((c, i) => (
                <td key={i} className="px-5 py-3.5 text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" /> {c.duration}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-5 py-3.5 font-semibold text-slate-400">Hardware / Tech</td>
              {picked.map((c, i) => (
                <td key={i} className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {c.hardwareTags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 font-mono-code text-[11px] text-slate-200"
                      >
                        <Cpu className="h-3 w-3 text-cyan-400" /> {t}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-5 py-3.5 font-semibold text-slate-400">Timed Exams &amp; Cert</td>
              {picked.map((c, i) => (
                <td key={i} className="px-5 py-3.5 text-emerald-400">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <Award className="h-4 w-4" /> Included
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-5 py-4 font-semibold text-slate-400">Action</td>
              {picked.map((c, i) => (
                <td key={i} className="px-5 py-4">
                  <Link
                    href={`/courses/${c.slug}`}
                    className="btn-cyber inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> View Course
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
