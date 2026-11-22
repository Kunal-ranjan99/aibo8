"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CategoryData, CourseData } from "@/lib/types";
import { CourseCard } from "./CourseCard";

interface Props {
  courses: CourseData[];
  categories: CategoryData[];
  initialTrack?: string;
  initialQuery?: string;
}

export function CatalogClient({
  courses,
  categories,
  initialTrack = "all",
  initialQuery = "",
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [track, setTrack] = useState(initialTrack);
  const [subTrack, setSubTrack] = useState("all");
  const [level, setLevel] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const activeCategory = categories.find((c) => c.slug === track);
  const subCategories = activeCategory ? activeCategory.subCategories : [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = courses.filter((c) => {
      if (track !== "all" && c.categorySlug !== track) return false;
      if (subTrack !== "all" && c.subCategorySlug !== subTrack) return false;
      if (level !== "all" && c.level.toLowerCase() !== level.toLowerCase()) return false;
      if (priceFilter === "free" && !c.isFree) return false;
      if (priceFilter === "paid" && c.isFree) return false;
      if (q) {
        const hay = `${c.title} ${c.shortDescription} ${c.categoryName} ${c.subCategoryName} ${c.hardwareTags.join(" ")} ${c.instructorName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-low") return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
      if (sortBy === "price-high") return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
      return b.studentsCount - a.studentsCount;
    });
  }, [courses, query, track, subTrack, level, priceFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-4">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, ROS2, ESP32, Jetson..."
              className="w-full rounded-xl border border-white/10 bg-[#050814] py-2.5 pl-10 pr-8 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <select
            value={track}
            onChange={(e) => {
              setTrack(e.target.value);
              setSubTrack("all");
            }}
            className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-slate-200 focus:border-cyan-400/60 focus:outline-none md:col-span-2"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={subTrack}
            onChange={(e) => setSubTrack(e.target.value)}
            disabled={subCategories.length === 0}
            className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-slate-200 focus:border-cyan-400/60 focus:outline-none disabled:opacity-50 md:col-span-2"
          >
            <option value="all">All Sub-Categories</option>
            {subCategories.map((sub) => (
              <option key={sub.id} value={sub.slug}>
                {sub.name}
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-slate-200 focus:border-cyan-400/60 focus:outline-none md:col-span-2"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-slate-200 focus:border-cyan-400/60 focus:outline-none md:col-span-1"
          >
            <option value="all">Price</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-slate-200 focus:border-cyan-400/60 focus:outline-none md:col-span-1"
          >
            <option value="popular">Popular</option>
            <option value="rating">Rating</option>
            <option value="price-low">Low $</option>
            <option value="price-high">High $</option>
          </select>
        </div>

        {/* Sub-Category Quick Pills when a Category is selected */}
        {subCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
            <span className="text-xs font-semibold text-slate-400">Sub-Categories:</span>
            <button
              onClick={() => setSubTrack("all")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                subTrack === "all"
                  ? "bg-cyan-500 text-slate-950 font-semibold"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/50"
              }`}
            >
              All {activeCategory?.name}
            </button>
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSubTrack(sub.slug)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  subTrack === sub.slug
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/50"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
          Showing <strong className="text-white">{filtered.length}</strong> courses
        </div>
        {(track !== "all" || subTrack !== "all" || level !== "all" || priceFilter !== "all" || query) && (
          <button
            onClick={() => {
              setQuery("");
              setTrack("all");
              setSubTrack("all");
              setLevel("all");
              setPriceFilter("all");
            }}
            className="text-xs font-semibold text-cyan-400 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="font-display text-xl font-bold text-white">No courses match your filters</p>
          <p className="mt-2 text-sm text-slate-400">Try clearing your search or selecting another category.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
