"use client";

import { useState } from "react";
import {
  BookOpen,
  DollarSign,
  FolderGit2,
  HelpCircle,
  LayoutDashboard,
  Plus,
  PlusCircle,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import {
  AssignmentSubmissionData,
  CategoryData,
  CourseData,
  InvoiceData,
  PayoutRequestData,
} from "@/lib/types";
import { CreateCourseForm, CurriculumAndQuizManager } from "./CourseCreatorAndQuizBuilder";
import { CourseManager } from "./CourseManager";
import { AssignmentGradingPanel, InstructorPayoutsPanel } from "./AdminPaymentAndPayouts";
import { ThemeToggle } from "./ThemeToggle";

type InstructorTab =
  | "overview"
  | "courses"
  | "create-course"
  | "curriculum"
  | "assignments"
  | "payouts";

export function InstructorStudioClient({
  instructorName,
  courses,
  categories,
  sales,
  payouts,
  assignments,
}: {
  instructorName: string;
  courses: CourseData[];
  categories: CategoryData[];
  sales: InvoiceData[];
  payouts: PayoutRequestData[];
  assignments: AssignmentSubmissionData[];
}) {
  const [activeTab, setActiveTab] = useState<InstructorTab>("overview");

  const totalStudents = courses.reduce((a, c) => a + c.studentsCount, 0);
  const avgRating =
    courses.length > 0
      ? (courses.reduce((a, c) => a + c.rating, 0) / courses.length).toFixed(1)
      : "5.0";
  const estRevenue = courses.reduce(
    (a, c) => a + (c.isFree ? 0 : (c.discountPrice ?? c.price) * Math.min(c.studentsCount, 35)),
    0
  );

  const menu: { id: InstructorTab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Instructor Overview", icon: LayoutDashboard },
    { id: "courses", label: "Course Manager", icon: BookOpen },
    { id: "create-course", label: "Create Course", icon: PlusCircle },
    { id: "curriculum", label: "Curriculum & Quizzes", icon: HelpCircle },
    { id: "assignments", label: "Project Grading", icon: FolderGit2 },
    { id: "payouts", label: "Sales & Payouts", icon: Wallet },
  ];

  return (
    <div className="flex min-h-[calc(100vh-68px)] flex-col lg:flex-row">
      {/* LEFT INSTRUCTOR SIDEBAR */}
      <aside className="admin-sidebar w-full shrink-0 border-b border-white/10 bg-[#070B18] lg:w-64 lg:border-b-0 lg:border-r">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                Instructor Studio
              </div>
              <div className="mt-0.5 font-display text-base font-bold text-white">
                {instructorName}
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition lg:w-full ${
                  active
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-400/35"
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN STUDIO AREA */}
      <div className="flex-1 p-5 sm:p-8 space-y-6 overflow-x-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {menu.find((m) => m.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-slate-400">
              Build free or paid AI, Robotics & IoT courses with objective exams
            </p>
          </div>
          <button
            onClick={() => setActiveTab("create-course")}
            className="btn-cyber inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Create Course
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="glass-card rounded-2xl p-5">
                <div className="flex justify-between text-xs uppercase text-slate-400">
                  <span>My Courses</span>
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="mt-2 font-display text-3xl font-bold text-white">{courses.length}</div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="flex justify-between text-xs uppercase text-slate-400">
                  <span>Total Learners</span>
                  <Users className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="mt-2 font-display text-3xl font-bold text-white">
                  {totalStudents.toLocaleString()}
                </div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="flex justify-between text-xs uppercase text-slate-400">
                  <span>Est. Earnings</span>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="mt-2 font-display text-3xl font-bold text-emerald-400">
                  ${estRevenue.toLocaleString()}
                </div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="flex justify-between text-xs uppercase text-slate-400">
                  <span>Avg Rating</span>
                  <Star className="h-4 w-4 text-amber-400" />
                </div>
                <div className="mt-2 font-display text-3xl font-bold text-white">{avgRating}</div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <button
                onClick={() => setActiveTab("create-course")}
                className="glass-card glass-card-hover rounded-2xl p-6 text-left"
              >
                <PlusCircle className="h-7 w-7 text-cyan-400" />
                <h3 className="mt-3 font-display text-lg font-bold text-white">Launch a New Course</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Choose Category & Sub-Category, set Free or Paid pricing, and publish your first lab.
                </p>
              </button>
              <button
                onClick={() => setActiveTab("curriculum")}
                className="glass-card glass-card-hover rounded-2xl p-6 text-left"
              >
                <HelpCircle className="h-7 w-7 text-indigo-400" />
                <h3 className="mt-3 font-display text-lg font-bold text-white">
                  Add Modules, Code Labs & Objective Exams
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Expand existing courses with multi-question MCQ quizzes, video lessons, and code snippets.
                </p>
              </button>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <CourseManager
            courses={courses}
            categories={categories}
            isAdmin={false}
            onCreateNew={() => setActiveTab("create-course")}
          />
        )}

        {activeTab === "create-course" && (
          <CreateCourseForm categories={categories} onCreated={() => setActiveTab("courses")} />
        )}

        {activeTab === "curriculum" && <CurriculumAndQuizManager courses={courses} />}

        {activeTab === "assignments" && <AssignmentGradingPanel assignments={assignments} />}

        {activeTab === "payouts" && <InstructorPayoutsPanel sales={sales} payouts={payouts} />}
      </div>
    </div>
  );
}
