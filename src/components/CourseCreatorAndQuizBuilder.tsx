"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Code2,
  FileText,
  FolderPlus,
  HelpCircle,
  PlayCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { CategoryData, CourseData, LessonType, QuizQuestion } from "@/lib/types";
import { MediaUploadFields } from "./MediaUploadFields";

interface CreateProps {
  categories: CategoryData[];
  onCreated?: () => void;
}

export function CreateCourseForm({ categories, onCreated }: CreateProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [introVideoUrl, setIntroVideoUrl] = useState("");
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || "robotics");
  const firstSubs = categories.find((c) => c.slug === categorySlug)?.subCategories || [];
  const [subCategorySlug, setSubCategorySlug] = useState(firstSubs[0]?.slug || "");
  const [level, setLevel] = useState("Beginner");
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState("49");
  const [discountPrice, setDiscountPrice] = useState("");
  const [hardwareTags, setHardwareTags] = useState("ROS2, ESP32, Python");
  const [sectionTitle, setSectionTitle] = useState("Module 1: Architecture & Hardware Setup");
  const [lessonTitle, setLessonTitle] = useState("Kickoff & Lab Environment");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");

  const currentCat = categories.find((c) => c.slug === categorySlug) || categories[0];
  const subCategories = currentCat?.subCategories || [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          shortDescription,
          description: shortDescription,
          thumbnail: thumbnail || undefined,
          introVideoUrl: introVideoUrl || null,
          categorySlug,
          subCategorySlug: subCategorySlug || subCategories[0]?.slug,
          level,
          isFree,
          price: isFree ? 0 : Number(price) || 0,
          discountPrice: !isFree && discountPrice ? Number(discountPrice) : null,
          hardwareTags,
          sectionTitle,
          lessonTitle,
          lessonVideoUrl,
        }),
      });
      if (res.ok) {
        setTitle("");
        setShortDescription("");
        setThumbnail("");
        setIntroVideoUrl("");
        setDiscountPrice("");
        setLessonVideoUrl("");
        setSuccessMsg("Course created & sent to Pending Admin Approval queue!");
        router.refresh();
        onCreated?.();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-display text-xl font-bold text-white">Create New Course</h3>
          <p className="text-xs text-slate-400">
            Configure category, sub-category, free or paid pricing, and your starter lab module.
          </p>
        </div>
        {successMsg && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> {successMsg}
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">Course Title *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Autonomous Quadcopter Flight Control with PX4 & ROS2"
            className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">Short Description *</label>
          <textarea
            required
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Describe the AI, Robotics, or IoT project students will build..."
            className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
          />
        </div>

        <MediaUploadFields
          thumbnail={thumbnail}
          onThumbnailChange={setThumbnail}
          introVideoUrl={introVideoUrl}
          onIntroVideoChange={setIntroVideoUrl}
        />

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">Category *</label>
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
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">Sub-Category *</label>
          <select
            value={subCategorySlug}
            onChange={(e) => setSubCategorySlug(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-white"
          >
            {subCategories.length === 0 ? (
              <option value="">General</option>
            ) : (
              subCategories.map((sub) => (
                <option key={sub.id} value={sub.slug}>
                  {sub.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Free vs Paid Toggle */}
        <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Course Pricing Type
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsFree(true)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                  isFree
                    ? "bg-emerald-500 text-slate-950"
                    : "border border-white/10 bg-white/5 text-slate-300"
                }`}
              >
                Free Course
              </button>
              <button
                type="button"
                onClick={() => setIsFree(false)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                  !isFree
                    ? "bg-cyan-500 text-slate-950"
                    : "border border-white/10 bg-white/5 text-slate-300"
                }`}
              >
                Paid Course
              </button>
            </div>
          </div>

          {!isFree && (
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div>
                <label className="mb-1 block text-xs text-slate-400">Regular Price (INR ₹)</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">Discount Price (Optional)</label>
                <input
                  type="number"
                  min={1}
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder="Leave blank for no discount"
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">Difficulty Level</label>
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
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">Hardware / Tech Tags</label>
          <input
            value={hardwareTags}
            onChange={(e) => setHardwareTags(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">First Module Title</label>
          <input
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">First Lesson Title</label>
          <input
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">
            Optional YouTube Embed URL
          </label>
          <input
            value={lessonVideoUrl}
            onChange={(e) => setLessonVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
            className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-cyber inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        <Plus className="h-4 w-4" />
        {loading ? "Publishing Course..." : "Create Course"}
      </button>
    </form>
  );
}

export function CurriculumAndQuizManager({ courses }: { courses: CourseData[] }) {
  const router = useRouter();
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const course = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [sectionId, setSectionId] = useState(course?.sections[0]?.id || "");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<LessonType>("QUIZ");
  const [duration, setDuration] = useState("10:00");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [passingScore, setPassingScore] = useState("70");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("10");
  const [statusMsg, setStatusMsg] = useState("");

  // Dynamic MCQ Objective Exam Builder
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "q-init-1",
      question: "Which protocol is lightweight and ideal for ESP32 IoT sensor telemetry?",
      options: ["FTP", "MQTT", "SMTP", "POP3"],
      correctIndex: 1,
      explanation: "MQTT uses a tiny 2-byte header and publish/subscribe broker architecture.",
    },
  ]);

  function addEmptyQuestion() {
    setQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        explanation: "",
      },
    ]);
  }

  function updateQuestion(idx: number, patch: Partial<QuizQuestion>) {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)));
  }

  function updateOption(qIdx: number, oIdx: number, val: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o, j) => (j === oIdx ? val : o)) }
          : q
      )
    );
  }

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    if (!course || !newSectionTitle.trim()) return;
    const res = await fetch("/api/curriculum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_section", courseId: course.id, title: newSectionTitle }),
    });
    if (res.ok) {
      setNewSectionTitle("");
      setStatusMsg("New module/section added!");
      router.refresh();
    }
  }

  async function handleAddLesson(e: React.FormEvent) {
    e.preventDefault();
    if (!course || !lessonTitle.trim()) return;
    const targetSecId = sectionId || course.sections[0]?.id;
    const res = await fetch("/api/curriculum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_lesson",
        courseId: course.id,
        sectionId: targetSecId,
        title: lessonTitle,
        type: lessonType,
        duration,
        videoUrl: lessonType === "VIDEO" ? videoUrl : null,
        content,
        codeSnippet: lessonType === "CODE_LAB" ? codeSnippet : null,
        codeLang: lessonType === "CODE_LAB" ? "python" : null,
        quizData: lessonType === "QUIZ" ? questions.filter((q) => q.question.trim()) : null,
        passingScore: Number(passingScore) || 70,
        timeLimitMinutes: Number(timeLimitMinutes) || 10,
      }),
    });
    if (res.ok) {
      setLessonTitle("");
      setContent("");
      setCodeSnippet("");
      setVideoUrl("");
      setStatusMsg(
        lessonType === "QUIZ"
          ? "Objective Exam / Quiz added to curriculum!"
          : "Lesson added to curriculum!"
      );
      router.refresh();
    }
  }

  if (!course) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-sm text-slate-400">
        Create a course first to manage its curriculum and objective exams.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Picker */}
      <div className="glass-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
        <div className="flex-1 min-w-[240px]">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Select Course to Manage Curriculum & Objective Exams
          </label>
          <select
            value={course.id}
            onChange={(e) => {
              const next = courses.find((c) => c.id === e.target.value);
              setSelectedCourseId(e.target.value);
              setSectionId(next?.sections[0]?.id || "");
            }}
            className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2.5 text-sm font-medium text-white"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.sections.length} modules)
              </option>
            ))}
          </select>
        </div>

        {statusMsg && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> {statusMsg}
          </span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Current Curriculum Tree + Add Section */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleAddSection} className="glass-card rounded-2xl p-5 space-y-3">
            <h4 className="flex items-center gap-2 font-display text-sm font-bold text-white">
              <FolderPlus className="h-4 w-4 text-cyan-400" /> Add New Module / Section
            </h4>
            <div className="flex gap-2">
              <input
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="e.g., Module 3: Sensor Fusion & Exam"
                className="flex-1 rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
              />
              <button
                type="submit"
                className="btn-cyber rounded-xl px-4 py-2 text-xs font-semibold text-white"
              >
                Add
              </button>
            </div>
          </form>

          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h4 className="font-display text-sm font-bold text-white">Current Curriculum</h4>
            {course.sections.map((sec) => (
              <div key={sec.id} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <div className="border-b border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-cyan-300">
                  {sec.title}
                </div>
                <div className="divide-y divide-white/5">
                  {sec.lessons.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-500">No lessons yet</div>
                  ) : (
                    sec.lessons.map((les) => {
                      const Icon =
                        les.type === "QUIZ"
                          ? HelpCircle
                          : les.type === "CODE_LAB"
                          ? Code2
                          : les.type === "ARTICLE"
                          ? FileText
                          : PlayCircle;
                      return (
                        <div key={les.id} className="flex items-center justify-between px-4 py-2.5 text-xs">
                          <span className="flex items-center gap-2 text-slate-200">
                            <Icon className="h-3.5 w-3.5 text-cyan-400" />
                            {les.title}
                          </span>
                          <span className="rounded bg-white/5 px-2 py-0.5 font-mono-code text-[10px] text-slate-400">
                            {les.type === "QUIZ"
                              ? `${les.quizData?.length || 0} Qs`
                              : les.duration}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Add Lesson / Objective Exam Builder */}
        <form onSubmit={handleAddLesson} className="glass-card lg:col-span-7 rounded-2xl p-6 space-y-4">
          <h4 className="font-display text-lg font-bold text-white">
            Add Lesson or Objective Exam (Quiz)
          </h4>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Target Module</label>
              <select
                value={sectionId || course.sections[0]?.id || ""}
                onChange={(e) => setSectionId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
              >
                {course.sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Content Type</label>
              <select
                value={lessonType}
                onChange={(e) => setLessonType(e.target.value as LessonType)}
                className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
              >
                <option value="QUIZ">Objective Exam / Quiz (MCQs)</option>
                <option value="VIDEO">Video Lesson</option>
                <option value="CODE_LAB">Interactive Code Lab</option>
                <option value="ARTICLE">Technical Reading / Guide</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-300">Lesson / Exam Title *</label>
              <input
                required
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder={
                  lessonType === "QUIZ"
                    ? "e.g., Objective Exam: ESP32 Sensors & MQTT"
                    : "e.g., Wiring Ultrasonic Sensors with PWM"
                }
                className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-sm text-white"
              />
            </div>

            {lessonType === "VIDEO" && (
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-300">Video Embed URL</label>
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
                />
              </div>
            )}

            {lessonType !== "QUIZ" && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">Duration</label>
                  <input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-300">Lesson Content / Summary</label>
                  <textarea
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </>
            )}

            {lessonType === "CODE_LAB" && (
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-300">Code Snippet</label>
                <textarea
                  rows={4}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="# Paste Python, C++, or ROS2 code here"
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 font-mono-code text-xs text-cyan-200"
                />
              </div>
            )}

            {lessonType === "QUIZ" && (
              <div className="sm:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">Passing Score (%)</label>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={passingScore}
                      onChange={(e) => setPassingScore(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">Time Limit (Minutes)</label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={timeLimitMinutes}
                      onChange={(e) => setTimeLimitMinutes(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      Objective Questions ({questions.length})
                    </span>
                    <button
                      type="button"
                      onClick={addEmptyQuestion}
                      className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Question
                    </button>
                  </div>

                  {questions.map((q, qIdx) => (
                    <div key={q.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-300">Question {qIdx + 1}</span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== qIdx))}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        required
                        value={q.question}
                        onChange={(e) => updateQuestion(qIdx, { question: e.target.value })}
                        placeholder="Enter objective exam question..."
                        className="w-full rounded-lg border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
                      />
                      <div className="grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex min-w-0 items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctIndex === oIdx}
                              onChange={() => updateQuestion(qIdx, { correctIndex: oIdx })}
                              title="Mark as correct answer"
                              className="shrink-0"
                            />
                            <input
                              required
                              value={opt}
                              onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                              className="w-full min-w-0 flex-1 rounded-lg border border-white/10 bg-[#050814] px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>
                      <input
                        value={q.explanation}
                        onChange={(e) => updateQuestion(qIdx, { explanation: e.target.value })}
                        placeholder="Answer explanation shown after grading..."
                        className="w-full rounded-lg border border-white/10 bg-[#050814] px-3 py-1.5 text-xs text-slate-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-cyber inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            {lessonType === "QUIZ" ? "Save Objective Exam to Course" : "Add Lesson to Course"}
          </button>
        </form>
      </div>
    </div>
  );
}
