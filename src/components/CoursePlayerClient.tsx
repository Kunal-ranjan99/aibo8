"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  Copy,
  FileText,
  FolderGit2,
  HelpCircle,
  Lock,
  MessageCircleQuestion,
  PlayCircle,
  Send,
  StickyNote,
  Timer,
} from "lucide-react";
import {
  AssignmentSubmissionData,
  CertificateData,
  CourseData,
  EnrollmentData,
  LessonData,
  LessonQuestionData,
  NoteData,
} from "@/lib/types";

interface Props {
  course: CourseData;
  initialEnrollment: EnrollmentData | null;
  initialCertificate: CertificateData | null;
  isLoggedIn: boolean;
}

export function CoursePlayerClient({
  course,
  initialEnrollment,
  initialCertificate,
  isLoggedIn,
}: Props) {
  const allLessons: LessonData[] = course.sections.flatMap((s) => s.lessons);
  const [activeLesson, setActiveLesson] = useState<LessonData>(allLessons[0]);
  const [completedIds, setCompletedIds] = useState<string[]>(
    initialEnrollment?.completedLessons || []
  );
  const [progress, setProgress] = useState<number>(initialEnrollment?.progress || 0);
  const [certificate, setCertificate] = useState<CertificateData | null>(initialCertificate);
  const [quizScores, setQuizScores] = useState(initialEnrollment?.quizScores || {});

  const [copied, setCopied] = useState(false);

  // Timed Objective Exam State
  const [examStarted, setExamStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
    percent: number;
    passed: boolean;
  } | null>(null);

  // Tabs below player
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "qa" | "assignments">("overview");
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [questions, setQuestions] = useState<LessonQuestionData[]>([]);
  const [qaInput, setQaInput] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  // Assignments
  const [assignments, setAssignments] = useState<AssignmentSubmissionData[]>([]);
  const [projTitle, setProjTitle] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [schematicUrl, setSchematicUrl] = useState("");
  const [projNotes, setProjNotes] = useState("");
  const [submittingAsgn, setSubmittingAsgn] = useState(false);

  const passingThreshold = activeLesson.passingScore || 60;
  const maxAttempts = activeLesson.maxAttempts || 3;
  const currentAttempts = quizScores[activeLesson.id]?.attempts || 0;

  useEffect(() => {
    setExamStarted(false);
    setSecondsLeft(0);
    setAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);

    if (activeLesson) {
      fetch(`/api/qa?lessonId=${activeLesson.id}`)
        .then((r) => r.json())
        .then((d) => setQuestions(d.questions || []))
        .catch(() => {});
    }
    if (isLoggedIn && activeLesson) {
      fetch(`/api/notes?lessonId=${activeLesson.id}`)
        .then((r) => r.json())
        .then((d) => setNotes(d.notes || []))
        .catch(() => {});
    }
  }, [activeLesson, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch(`/api/assignments?courseId=${course.id}`)
        .then((r) => r.json())
        .then((d) => setAssignments(d.assignments || []))
        .catch(() => {});
    }
  }, [course.id, isLoggedIn]);

  // Live countdown timer for Objective Exam
  useEffect(() => {
    if (!examStarted || quizSubmitted) return;
    if (secondsLeft <= 0) {
      handleQuizSubmit();
      return;
    }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examStarted, secondsLeft, quizSubmitted]);

  function startTimedExam() {
    const mins = activeLesson.timeLimitMinutes || 5;
    setSecondsLeft(mins * 60);
    setAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    setExamStarted(true);
  }

  async function toggleComplete(
    lessonId: string,
    forceComplete?: boolean,
    qScore?: { score: number; total: number; percent: number; passed: boolean }
  ) {
    const isCurrentlyDone = completedIds.includes(lessonId);
    const nextDone = forceComplete !== undefined ? forceComplete : !isCurrentlyDone;

    const nextSet = new Set(completedIds);
    if (nextDone) nextSet.add(lessonId);
    else nextSet.delete(lessonId);
    const nextArr = Array.from(nextSet);
    setCompletedIds(nextArr);
    setProgress(Math.round((nextArr.length / Math.max(1, allLessons.length)) * 100));

    if (!isLoggedIn) return;
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: course.id,
        lessonId,
        completed: nextDone,
        quizScore: qScore,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.enrollment?.quizScores) setQuizScores(data.enrollment.quizScores);
      if (data.certificate) setCertificate(data.certificate);
    }
  }

  async function handleQuizSubmit() {
    if (!activeLesson.quizData || quizSubmitted) return;
    let correct = 0;
    for (const q of activeLesson.quizData) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const total = activeLesson.quizData.length;
    const percent = Math.round((correct / Math.max(1, total)) * 100);
    const passed = percent >= passingThreshold;
    const resObj = { score: correct, total, percent, passed };
    setQuizResult(resObj);
    setQuizSubmitted(true);
    setExamStarted(false);
    await toggleComplete(activeLesson.id, passed, resObj);
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteInput.trim() || !isLoggedIn) return;
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: activeLesson.id, content: noteInput }),
    });
    if (res.ok) {
      const { note } = await res.json();
      setNotes((prev) => [note, ...prev]);
      setNoteInput("");
    }
  }

  async function handleAskQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!qaInput.trim() || !isLoggedIn) return;
    const res = await fetch("/api/qa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: course.id,
        lessonId: activeLesson.id,
        question: qaInput,
      }),
    });
    if (res.ok) {
      const { question } = await res.json();
      setQuestions((prev) => [question, ...prev]);
      setQaInput("");
    }
  }

  async function handleReply(questionId: string) {
    const body = replyText[questionId];
    if (!body?.trim() || !isLoggedIn) return;
    const res = await fetch("/api/qa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reply", questionId, body }),
    });
    if (res.ok) {
      const { reply } = await res.json();
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, replies: [...q.replies, reply] } : q))
      );
      setReplyText((prev) => ({ ...prev, [questionId]: "" }));
    }
  }

  async function handleSubmitAssignment(e: React.FormEvent) {
    e.preventDefault();
    if (!projTitle.trim() || !isLoggedIn) return;
    setSubmittingAsgn(true);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          courseTitle: course.title,
          projectTitle: projTitle,
          repoUrl,
          schematicUrl,
          notes: projNotes,
        }),
      });
      if (res.ok) {
        const { assignment } = await res.json();
        setAssignments((prev) => [assignment, ...prev]);
        setProjTitle("");
        setRepoUrl("");
        setSchematicUrl("");
        setProjNotes("");
      }
    } finally {
      setSubmittingAsgn(false);
    }
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Studio Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#070B18] px-5 py-3.5">
        <div>
          <Link href={`/courses/${course.slug}`} className="text-xs font-semibold text-cyan-400 hover:underline">
            ← Back to Course Overview
          </Link>
          <h1 className="font-display text-lg font-bold text-white sm:text-xl">{course.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="w-40">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-400">Progress</span>
              <span className="font-semibold text-cyan-300">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {certificate ? (
            <Link
              href={`/certificates/${certificate.id}`}
              className="btn-cyber inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white"
            >
              <Award className="h-4 w-4" />
              Download Certificate
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              Complete lessons &amp; pass exams for certificate
            </span>
          )}
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card overflow-hidden rounded-2xl">
            {/* VIDEO */}
            {activeLesson.type === "VIDEO" && (
              <div className="aspect-video w-full bg-black">
                {activeLesson.videoUrl ? (
                  <iframe
                    src={activeLesson.videoUrl}
                    title={activeLesson.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    Video ready
                  </div>
                )}
              </div>
            )}

            {/* CODE LAB */}
            {activeLesson.type === "CODE_LAB" && (
              <div className="p-6 space-y-4 bg-[#060913]">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-cyan-400" />
                    <span className="font-mono-code text-xs font-semibold uppercase text-cyan-300">
                      Hands-On Code Lab ({activeLesson.codeLang || "code"})
                    </span>
                  </div>
                  {activeLesson.codeSnippet && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activeLesson.codeSnippet!);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1800);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied!" : "Copy Code"}
                    </button>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{activeLesson.content}</p>
                {activeLesson.codeSnippet && (
                  <pre className="overflow-x-auto rounded-xl border border-cyan-500/20 bg-black/75 p-4 font-mono-code text-xs leading-relaxed text-cyan-100">
                    <code>{activeLesson.codeSnippet}</code>
                  </pre>
                )}
              </div>
            )}

            {/* ARTICLE */}
            {activeLesson.type === "ARTICLE" && (
              <div className="p-6 sm:p-8 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                  <FileText className="h-3.5 w-3.5" /> Engineering Brief
                </div>
                <h2 className="font-display text-2xl font-bold text-white">{activeLesson.title}</h2>
                <div className="whitespace-pre-line text-sm leading-7 text-slate-300">
                  {activeLesson.content}
                </div>
              </div>
            )}

            {/* TIMED OBJECTIVE EXAM */}
            {activeLesson.type === "QUIZ" && activeLesson.quizData && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                      Timed Objective Exam
                    </span>
                    <h2 className="mt-1 font-display text-2xl font-bold text-white">
                      {activeLesson.title}
                    </h2>
                  </div>

                  {examStarted && !quizSubmitted && (
                    <div
                      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-mono-code text-base font-bold ${
                        secondsLeft < 60
                          ? "border-rose-400 bg-rose-500/20 text-rose-300 animate-pulse"
                          : "border-cyan-400/40 bg-cyan-500/15 text-cyan-300"
                      }`}
                    >
                      <Timer className="h-4 w-4" /> {mm}:{ss}
                    </div>
                  )}

                  {quizResult && (
                    <div
                      className={`rounded-xl border px-4 py-2 text-center ${
                        quizResult.passed
                          ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-300"
                          : "border-rose-400/50 bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      <div className="font-display text-xl font-bold">
                        {quizResult.percent}% ({quizResult.score}/{quizResult.total})
                      </div>
                      <div className="text-[10px] font-bold uppercase">
                        {quizResult.passed ? "PASSED ✓" : `NEED ${passingThreshold}% TO PASS`}
                      </div>
                    </div>
                  )}
                </div>

                {!examStarted && !quizSubmitted ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3 text-xs">
                      <div className="rounded-xl border border-white/10 bg-[#050814] p-3">
                        <div className="text-slate-400">Time Limit</div>
                        <div className="mt-1 font-display text-lg font-bold text-cyan-300">
                          {activeLesson.timeLimitMinutes || 5} mins
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-[#050814] p-3">
                        <div className="text-slate-400">Passing Score</div>
                        <div className="mt-1 font-display text-lg font-bold text-emerald-400">
                          {passingThreshold}%
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-[#050814] p-3">
                        <div className="text-slate-400">Attempts Used</div>
                        <div className="mt-1 font-display text-lg font-bold text-white">
                          {currentAttempts} / {maxAttempts}
                        </div>
                      </div>
                    </div>

                    {currentAttempts >= maxAttempts && !quizScores[activeLesson.id]?.passed ? (
                      <p className="text-sm font-semibold text-rose-400">
                        Maximum attempts reached. Contact your instructor in the Q&amp;A tab to reset.
                      </p>
                    ) : (
                      <button
                        onClick={startTimedExam}
                        className="btn-cyber inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-white"
                      >
                        <Clock className="h-4 w-4" /> Start Timed Objective Exam
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="space-y-5">
                      {activeLesson.quizData.map((q, idx) => (
                        <div key={q.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                          <p className="font-medium text-white">
                            {idx + 1}. {q.question}
                          </p>
                          <div className="mt-3 grid gap-2">
                            {q.options.map((opt, optIdx) => {
                              const selected = answers[q.id] === optIdx;
                              const isCorrect = optIdx === q.correctIndex;
                              let style = "border-white/10 bg-[#050814] text-slate-300 hover:border-cyan-400/40";
                              if (quizSubmitted) {
                                if (isCorrect) style = "border-emerald-400 bg-emerald-500/15 text-emerald-200";
                                else if (selected && !isCorrect) style = "border-rose-400 bg-rose-500/15 text-rose-200";
                              } else if (selected) {
                                style = "border-cyan-400 bg-cyan-500/15 text-cyan-100";
                              }
                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  disabled={quizSubmitted}
                                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                                  className={`rounded-xl border px-4 py-2.5 text-left text-sm transition ${style}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {quizSubmitted && (
                            <p className="mt-3 text-xs text-cyan-300/90">
                              <strong>Explanation:</strong> {q.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {!quizSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        className="btn-cyber rounded-xl px-6 py-3 text-sm font-semibold text-white"
                      >
                        Submit Exam &amp; Grade
                      </button>
                    ) : (
                      <button
                        onClick={startTimedExam}
                        disabled={currentAttempts >= maxAttempts}
                        className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 disabled:opacity-40"
                      >
                        Retake Exam ({maxAttempts - currentAttempts} attempts left)
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Lesson Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#070B18] px-6 py-4">
              <div>
                <h3 className="font-display font-bold text-white">{activeLesson.title}</h3>
                <p className="text-xs text-slate-400">
                  {activeLesson.type.replace("_", " ")} • {activeLesson.duration}
                </p>
              </div>
              {activeLesson.type !== "QUIZ" && (
                <button
                  onClick={() => toggleComplete(activeLesson.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                    completedIds.includes(activeLesson.id)
                      ? "border border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
                      : "btn-cyber text-white"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {completedIds.includes(activeLesson.id) ? "Completed" : "Mark Lesson Complete"}
                </button>
              )}
            </div>
          </div>

          {/* BELOW-PLAYER TABS: Summary | Notes | Lesson Q&A | Project Assignments */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex flex-wrap gap-4 border-b border-white/10 pb-3">
              {[
                { id: "overview", label: "Summary", icon: FileText },
                { id: "notes", label: `Lab Notes (${notes.length})`, icon: StickyNote },
                { id: "qa", label: `Lesson Q&A (${questions.length})`, icon: MessageCircleQuestion },
                { id: "assignments", label: `Project Assignment (${assignments.length})`, icon: FolderGit2 },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as typeof activeTab)}
                    className={`flex items-center gap-1.5 pb-1 text-xs sm:text-sm font-semibold border-b-2 transition ${
                      activeTab === t.id
                        ? "border-cyan-400 text-cyan-300"
                        : "border-transparent text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {activeTab === "overview" && (
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                {activeLesson.content || course.description}
              </p>
            )}

            {activeTab === "notes" && (
              <div className="mt-4 space-y-4">
                {isLoggedIn ? (
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Save a pinout reminder or code note..."
                      className="flex-1 rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
                    />
                    <button type="submit" className="btn-cyber inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-white">
                      <Send className="h-3.5 w-3.5" /> Save
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-amber-300">
                    <Link href="/auth/login" className="underline">Sign in</Link> to save personal notes.
                  </p>
                )}
                <div className="space-y-2.5">
                  {notes.map((n) => (
                    <div key={n.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-sm text-slate-200">
                      {n.content}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "qa" && (
              <div className="mt-4 space-y-5">
                {isLoggedIn ? (
                  <form onSubmit={handleAskQuestion} className="flex gap-2">
                    <input
                      value={qaInput}
                      onChange={(e) => setQaInput(e.target.value)}
                      placeholder="Ask a doubt about this lesson (wiring, code error, concept)..."
                      className="flex-1 rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
                    />
                    <button type="submit" className="btn-cyber rounded-xl px-4 py-2.5 text-xs font-semibold text-white">
                      Ask Doubt
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-amber-300">Sign in to post a doubt or reply.</p>
                )}

                <div className="space-y-3">
                  {questions.length === 0 ? (
                    <p className="text-xs text-slate-500">No questions yet for this lesson. Ask the first doubt!</p>
                  ) : (
                    questions.map((q) => (
                      <div key={q.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                        <div>
                          <div className="text-xs font-bold text-cyan-300">
                            {q.userName} <span className="text-slate-500">({q.userRole})</span>
                          </div>
                          <p className="mt-1 text-sm text-white">{q.question}</p>
                        </div>
                        {q.replies.map((r) => (
                          <div key={r.id} className="ml-4 rounded-lg border-l-2 border-cyan-400 bg-white/[0.03] px-3 py-2 text-xs">
                            <span className="font-bold text-emerald-400">{r.userName} ({r.userRole}): </span>
                            <span className="text-slate-200">{r.body}</span>
                          </div>
                        ))}
                        {isLoggedIn && (
                          <div className="flex gap-2 pt-1">
                            <input
                              value={replyText[q.id] || ""}
                              onChange={(e) => setReplyText((p) => ({ ...p, [q.id]: e.target.value }))}
                              placeholder="Write a reply..."
                              className="flex-1 rounded-lg border border-white/10 bg-[#050814] px-3 py-1.5 text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleReply(q.id)}
                              className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300"
                            >
                              Reply
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "assignments" && (
              <div className="mt-4 space-y-5">
                {isLoggedIn ? (
                  <form onSubmit={handleSubmitAssignment} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                    <h4 className="font-display text-sm font-bold text-white">
                      Submit Hands-On Hardware / AI Project
                    </h4>
                    <input
                      required
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="Project Title (e.g., My ESP32 Smart Plant Watering Bot)"
                      className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="GitHub Repo / Wokwi Sim URL"
                        className="rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
                      />
                      <input
                        value={schematicUrl}
                        onChange={(e) => setSchematicUrl(e.target.value)}
                        placeholder="Circuit Schematic / Photo URL"
                        className="rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={projNotes}
                      onChange={(e) => setProjNotes(e.target.value)}
                      placeholder="Explain what you built and tested..."
                      className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
                    />
                    <button
                      type="submit"
                      disabled={submittingAsgn}
                      className="btn-cyber rounded-xl px-5 py-2 text-xs font-semibold text-white"
                    >
                      {submittingAsgn ? "Submitting..." : "Submit Project for Grading"}
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-amber-300">Sign in to submit your project assignment.</p>
                )}

                <div className="space-y-3">
                  {assignments.map((a) => (
                    <div key={a.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-white">{a.projectTitle}</div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            a.status === "GRADED"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {a.status === "GRADED" ? `Graded: ${a.grade}/100` : "Submitted — Pending Review"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{a.notes}</p>
                      {a.feedback && (
                        <div className="rounded-lg border-l-2 border-emerald-400 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                          <strong>Instructor Feedback:</strong> {a.feedback}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Curriculum Sidebar */}
        <aside className="lg:col-span-4">
          <div className="glass-card overflow-hidden rounded-2xl sticky top-24">
            <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
              <h2 className="font-display font-bold text-white">Course Curriculum</h2>
              <p className="text-xs text-slate-400">
                {completedIds.length} of {allLessons.length} lessons completed
              </p>
            </div>
            <div className="max-h-[70vh] overflow-y-auto divide-y divide-white/10">
              {course.sections.map((sec) => (
                <div key={sec.id}>
                  <div className="bg-[#050814]/60 px-5 py-3 text-xs font-bold uppercase tracking-wider text-cyan-300/90">
                    {sec.title}
                  </div>
                  <div className="divide-y divide-white/5">
                    {sec.lessons.map((les) => {
                      const isActive = activeLesson.id === les.id;
                      const isDone = completedIds.includes(les.id);
                      const Icon =
                        les.type === "CODE_LAB"
                          ? Code2
                          : les.type === "QUIZ"
                          ? HelpCircle
                          : les.type === "ARTICLE"
                          ? FileText
                          : PlayCircle;
                      return (
                        <button
                          key={les.id}
                          onClick={() => setActiveLesson(les)}
                          className={`flex w-full items-start gap-3 px-5 py-3.5 text-left transition ${
                            isActive
                              ? "bg-cyan-500/15 border-l-2 border-cyan-400"
                              : "hover:bg-white/[0.04]"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                          ) : (
                            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium ${isActive ? "text-white" : "text-slate-300"}`}>
                              {les.title}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                              <Icon className="h-3 w-3 text-cyan-400/80" />
                              <span>{les.type === "QUIZ" ? "TIMED EXAM" : les.type.replace("_", " ")}</span>
                              <span>•</span>
                              <span>{les.duration}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
