"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit3,
  Eye,
  FileText,
  HelpCircle,
  Layers,
  ListChecks,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { CategoryData, CourseData, CourseStatus } from "@/lib/types";
import { CurriculumAndQuizManager } from "./CourseCreatorAndQuizBuilder";
import { MediaUploadFields } from "./MediaUploadFields";

interface Props {
  courses: CourseData[];
  categories: CategoryData[];
  isAdmin: boolean;
  onCreateNew?: () => void;
}

type EditorTab = "basic" | "pricing" | "outcomes" | "curriculum";

export function CourseManager({ courses, categories, isAdmin, onCreateNew }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | CourseStatus>("ALL");
  const [catFilter, setCatFilter] = useState("ALL");
  const [priceFilter, setPriceFilter] = useState<"ALL" | "FREE" | "PAID">("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Editing state
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const editingCourse = courses.find((c) => c.id === editingCourseId) || null;

  const stats = useMemo(() => {
    return {
      total: courses.length,
      published: courses.filter((c) => c.status === "PUBLISHED").length,
      pending: courses.filter((c) => c.status === "PENDING").length,
      free: courses.filter((c) => c.isFree).length,
      paid: courses.filter((c) => !c.isFree).length,
    };
  }, [courses]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((c) => {
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (catFilter !== "ALL" && c.categorySlug !== catFilter) return false;
      if (priceFilter === "FREE" && !c.isFree) return false;
      if (priceFilter === "PAID" && c.isFree) return false;
      if (q) {
        const hay = `${c.title} ${c.instructorName} ${c.categoryName} ${c.subCategoryName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [courses, search, statusFilter, catFilter, priceFilter]);

  async function handleStatusChange(courseId: string, status: CourseStatus) {
    setBusyId(courseId);
    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "course_status", courseId, status }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(courseId: string, title: string) {
    if (!confirm(`Delete "${title}" permanently?`)) return;
    setBusyId(courseId);
    try {
      await fetch(`/api/courses?id=${encodeURIComponent(courseId)}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  // If editing a course, render the full Tabbed Course Editor
  if (editingCourse) {
    return (
      <CourseEditorView
        course={editingCourse}
        categories={categories}
        isAdmin={isAdmin}
        onBack={() => setEditingCourseId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top KPI Strip (Clickable Quick Filters!) */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <button
          onClick={() => {
            setStatusFilter("ALL");
            setPriceFilter("ALL");
          }}
          className={`glass-card rounded-2xl p-4 text-left transition ${
            statusFilter === "ALL" && priceFilter === "ALL" ? "border-cyan-400/60" : ""
          }`}
        >
          <div className="text-[11px] font-semibold uppercase text-slate-400">All Courses</div>
          <div className="mt-1 font-display text-2xl font-bold text-white">{stats.total}</div>
        </button>

        <button
          onClick={() => setStatusFilter("PENDING")}
          className={`glass-card rounded-2xl p-4 text-left transition ${
            statusFilter === "PENDING" ? "border-amber-400/70" : ""
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-amber-400">
            <span>Pending Approval</span>
            <Clock className="h-3.5 w-3.5" />
          </div>
          <div className="mt-1 font-display text-2xl font-bold text-amber-300">{stats.pending}</div>
        </button>

        <button
          onClick={() => setStatusFilter("PUBLISHED")}
          className={`glass-card rounded-2xl p-4 text-left transition ${
            statusFilter === "PUBLISHED" ? "border-emerald-400/70" : ""
          }`}
        >
          <div className="text-[11px] font-semibold uppercase text-emerald-400">Active / Live</div>
          <div className="mt-1 font-display text-2xl font-bold text-emerald-300">{stats.published}</div>
        </button>

        <button
          onClick={() => setPriceFilter(priceFilter === "FREE" ? "ALL" : "FREE")}
          className={`glass-card rounded-2xl p-4 text-left transition ${
            priceFilter === "FREE" ? "border-cyan-400/70" : ""
          }`}
        >
          <div className="text-[11px] font-semibold uppercase text-slate-400">Free Courses</div>
          <div className="mt-1 font-display text-2xl font-bold text-cyan-300">{stats.free}</div>
        </button>

        <button
          onClick={() => setPriceFilter(priceFilter === "PAID" ? "ALL" : "PAID")}
          className={`glass-card rounded-2xl p-4 text-left transition ${
            priceFilter === "PAID" ? "border-indigo-400/70" : ""
          }`}
        >
          <div className="text-[11px] font-semibold uppercase text-slate-400">Paid Courses</div>
          <div className="mt-1 font-display text-2xl font-bold text-indigo-300">{stats.paid}</div>
        </button>
      </div>

      {/* Pending Approval Callout Banner for Admin */}
      {isAdmin && stats.pending > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/35 bg-amber-500/10 px-5 py-3.5">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-amber-200">
            <Clock className="h-4 w-4 shrink-0 text-amber-400" />
            <span>
              <strong>{stats.pending} course{stats.pending > 1 ? "s" : ""}</strong> waiting for Admin
              review & approval before appearing on the storefront.
            </span>
          </div>
          <button
            onClick={() => setStatusFilter("PENDING")}
            className="rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300"
          >
            Review Pending Queue
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="glass-card rounded-2xl p-4">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, instructor, category..."
              className="w-full rounded-xl border border-white/10 bg-[#050814] py-2 pl-9 pr-3 text-xs text-white focus:border-cyan-400/60 focus:outline-none"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-slate-200 md:col-span-3"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | CourseStatus)}
            className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-slate-200 md:col-span-2"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value as "ALL" | "FREE" | "PAID")}
            className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-slate-200 md:col-span-2"
          >
            <option value="ALL">All Prices</option>
            <option value="FREE">Free Only</option>
            <option value="PAID">Paid Only</option>
          </select>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="btn-cyber inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-white md:col-span-1"
              title="Add New Course"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Rich User-Friendly Course Manager List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center text-sm text-slate-400">
            No courses match the current filter.
          </div>
        ) : (
          filtered.map((course) => {
            const totalLessons = course.sections.reduce((a, s) => a + s.lessons.length, 0);
            const totalQuizzes = course.sections.reduce(
              (a, s) => a + s.lessons.filter((l) => l.type === "QUIZ").length,
              0
            );
            return (
              <div
                key={course.id}
                className="glass-card flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-20 w-32 shrink-0 rounded-xl object-cover border border-white/10"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          course.status === "PUBLISHED"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : course.status === "PENDING"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-slate-500/20 text-slate-300"
                        }`}
                      >
                        {course.status === "PENDING" ? "Pending Admin Approval" : course.status}
                      </span>
                      <span className="text-[11px] font-semibold text-cyan-300">
                        {course.categoryName} › {course.subCategoryName}
                      </span>
                    </div>

                    <h3 className="truncate font-display text-base font-bold text-white">
                      {course.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span>By <strong className="text-slate-200">{course.instructorName}</strong></span>
                      <span className="flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-cyan-400" />
                        {course.sections.length} Modules • {totalLessons} Lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
                        {totalQuizzes} Quiz{totalQuizzes === 1 ? "" : "zes"}
                      </span>
                      <span className="font-semibold text-white">
                        {course.isFree ? (
                          <span className="text-emerald-400">Free</span>
                        ) : (
                          <>
                            ${course.discountPrice ?? course.price}
                            {course.discountPrice && (
                              <span className="ml-1 text-slate-500 line-through">${course.price}</span>
                            )}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingCourseId(course.id)}
                    className="btn-cyber inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-white"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit Course
                  </button>

                  <Link
                    href={`/learn/${course.slug}`}
                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/50"
                  >
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </Link>

                  {isAdmin && course.status !== "PUBLISHED" && (
                    <button
                      disabled={busyId === course.id}
                      onClick={() => handleStatusChange(course.id, "PUBLISHED")}
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/20 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}

                  {isAdmin && course.status === "PUBLISHED" && (
                    <button
                      disabled={busyId === course.id}
                      onClick={() => handleStatusChange(course.id, "DRAFT")}
                      className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-amber-300"
                    >
                      <X className="h-3.5 w-3.5" /> Hold
                    </button>
                  )}

                  <button
                    disabled={busyId === course.id}
                    onClick={() => handleDelete(course.id, course.title)}
                    title="Delete Course"
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:border-rose-400/50 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TABBED COURSE EDITOR (Basic, Pricing, Outcomes, Curriculum)
   ============================================================ */
function CourseEditorView({
  course,
  categories,
  isAdmin,
  onBack,
}: {
  course: CourseData;
  categories: CategoryData[];
  isAdmin: boolean;
  onBack: () => void;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<EditorTab>("basic");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  // Editable Fields
  const [title, setTitle] = useState(course.title);
  const [shortDescription, setShortDescription] = useState(course.shortDescription);
  const [description, setDescription] = useState(course.description);
  const [thumbnail, setThumbnail] = useState(course.thumbnail);
  const [introVideoUrl, setIntroVideoUrl] = useState(course.introVideoUrl || "");
  const [categorySlug, setCategorySlug] = useState(course.categorySlug);
  const [subCategorySlug, setSubCategorySlug] = useState(course.subCategorySlug);
  const [level, setLevel] = useState(course.level);
  const [duration, setDuration] = useState(course.duration);
  const [hardwareTags, setHardwareTags] = useState(course.hardwareTags.join(", "));
  const [status, setStatus] = useState<CourseStatus>(course.status);

  const [isFree, setIsFree] = useState(course.isFree);
  const [price, setPrice] = useState(String(course.price || 49));
  const [discountPrice, setDiscountPrice] = useState(
    course.discountPrice ? String(course.discountPrice) : ""
  );

  const [outcomes, setOutcomes] = useState<string[]>(course.outcomes.length ? course.outcomes : [""]);
  const [requirements, setRequirements] = useState<string[]>(
    course.requirements.length ? course.requirements : [""]
  );

  const currentCat = categories.find((c) => c.slug === categorySlug) || categories[0];
  const subCategories = currentCat?.subCategories || [];

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedMsg("");
    try {
      const res = await fetch("/api/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: course.id,
          title,
          shortDescription,
          description,
          thumbnail,
          introVideoUrl,
          categorySlug,
          subCategorySlug,
          level,
          duration,
          hardwareTags,
          isFree,
          price: isFree ? 0 : Number(price) || 0,
          discountPrice: !isFree && discountPrice ? Number(discountPrice) : null,
          outcomes: outcomes.map((x) => x.trim()).filter(Boolean),
          requirements: requirements.map((x) => x.trim()).filter(Boolean),
          status: isAdmin ? status : undefined,
        }),
      });
      if (res.ok) {
        setSavedMsg("Changes saved!");
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  const tabs: { id: EditorTab; label: string; icon: React.ElementType }[] = [
    { id: "basic", label: "Basic Info", icon: FileText },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "outcomes", label: "Outcomes & Requirements", icon: ListChecks },
    { id: "curriculum", label: "Curriculum & Quizzes", icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="glass-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/50 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
              Course Editor
            </div>
            <h2 className="font-display text-lg font-bold text-white sm:text-xl">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> {savedMsg}
            </span>
          )}
          <Link
            href={`/learn/${course.slug}`}
            className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/50"
          >
            Preview Course →
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                active
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md"
                  : "glass-card text-slate-300 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {tab === "curriculum" ? (
        <CurriculumAndQuizManager courses={[course]} />
      ) : (
        <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 space-y-5">
          {tab === "basic" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Course Title</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Short Description</label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Full Course Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
                />
              </div>

              <MediaUploadFields
                thumbnail={thumbnail}
                onThumbnailChange={setThumbnail}
                introVideoUrl={introVideoUrl}
                onIntroVideoChange={setIntroVideoUrl}
              />

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Category</label>
                <select
                  value={categorySlug}
                  onChange={(e) => {
                    const nextSlug = e.target.value;
                    setCategorySlug(nextSlug);
                    const nextSubs = categories.find((c) => c.slug === nextSlug)?.subCategories || [];
                    setSubCategorySlug(nextSubs[0]?.slug || "");
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Sub-Category</label>
                <select
                  value={subCategorySlug}
                  onChange={(e) => setSubCategorySlug(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-white"
                >
                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.slug}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Estimated Duration</label>
                <input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div className={isAdmin ? "" : "md:col-span-2"}>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Hardware / Tech Tags (comma-separated)
                </label>
                <input
                  value={hardwareTags}
                  onChange={(e) => setHardwareTags(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
                />
              </div>

              {isAdmin && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Admin Approval Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CourseStatus)}
                    className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm font-semibold text-cyan-300"
                  >
                    <option value="PENDING">PENDING (Awaiting Approval)</option>
                    <option value="PUBLISHED">PUBLISHED (Live on Storefront)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {tab === "pricing" && (
            <div className="space-y-5">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFree(true)}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold transition ${
                    isFree
                      ? "bg-emerald-500 text-slate-950"
                      : "border border-white/10 bg-white/5 text-slate-300"
                  }`}
                >
                  Free Course ($0)
                </button>
                <button
                  type="button"
                  onClick={() => setIsFree(false)}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold transition ${
                    !isFree
                      ? "bg-cyan-500 text-slate-950"
                      : "border border-white/10 bg-white/5 text-slate-300"
                  }`}
                >
                  Paid Course
                </button>
              </div>

              {!isFree && (
                <div className="grid gap-4 sm:grid-cols-2 max-w-xl">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                      Regular Price (USD)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                      Discount Price (Optional)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      placeholder="Optional sale price"
                      className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "outcomes" && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Learning Outcomes
                  </label>
                  <button
                    type="button"
                    onClick={() => setOutcomes((p) => [...p, ""])}
                    className="text-xs font-semibold text-cyan-400 hover:underline"
                  >
                    + Add Outcome
                  </button>
                </div>
                {outcomes.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      value={item}
                      onChange={(e) =>
                        setOutcomes((p) => p.map((x, i) => (i === idx ? e.target.value : x)))
                      }
                      placeholder="What students will build..."
                      className="flex-1 rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setOutcomes((p) => p.filter((_, i) => i !== idx))}
                      className="rounded-lg border border-white/10 px-2.5 text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Hardware & Prerequisites
                  </label>
                  <button
                    type="button"
                    onClick={() => setRequirements((p) => [...p, ""])}
                    className="text-xs font-semibold text-indigo-400 hover:underline"
                  >
                    + Add Requirement
                  </button>
                </div>
                {requirements.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      value={item}
                      onChange={(e) =>
                        setRequirements((p) => p.map((x, i) => (i === idx ? e.target.value : x)))
                      }
                      placeholder="e.g., ESP32 DevKit or simulator..."
                      className="flex-1 rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setRequirements((p) => p.filter((_, i) => i !== idx))}
                      className="rounded-lg border border-white/10 px-2.5 text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-cyber inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold text-white"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Course Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
