"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CreditCard,
  Database,
  FolderGit2,
  FolderTree,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Plus,
  PlusCircle,
  School,
  Settings,
  Ticket,
  UserPlus,
  Users,
  Video,
  Wallet,
} from "lucide-react";
import {
  AssignmentSubmissionData,
  CategoryData,
  CouponData,
  CourseData,
  InvoiceData,
  PaymentGatewaySettings,
  PayoutRequestData,
  Role,
} from "@/lib/types";
import {
  AnnouncementItem,
  InstitutionBatchItem,
  LiveClassItem,
  SmtpSettings,
} from "@/lib/v3-features";
import { CreateCourseForm, CurriculumAndQuizManager } from "./CourseCreatorAndQuizBuilder";
import { CourseManager } from "./CourseManager";
import {
  AssignmentGradingPanel,
  PaymentSettingsPanel,
  PayoutsAndSalesAdminPanel,
} from "./AdminPaymentAndPayouts";
import {
  InstitutionalBatchesAdmin,
  LiveAndAnnouncementsAdmin,
  SmtpSettingsAdmin,
} from "./AdminV3Panels";
import { ThemeToggle } from "./ThemeToggle";

type AdminTab =
  | "dashboard"
  | "courses"
  | "create-course"
  | "curriculum"
  | "categories"
  | "students"
  | "assignments"
  | "live"
  | "batches"
  | "payouts"
  | "payments"
  | "users"
  | "coupons"
  | "settings";

interface Props {
  adminName: string;
  courses: CourseData[];
  categories: CategoryData[];
  users: { id: string; name: string; email: string; role: Role }[];
  enrollments: {
    id: string;
    userName: string;
    userEmail: string;
    courseTitle: string;
    progress: number;
    enrolledAt: string;
  }[];
  coupons: CouponData[];
  paymentSettings: PaymentGatewaySettings;
  invoices: InvoiceData[];
  payouts: PayoutRequestData[];
  assignments: AssignmentSubmissionData[];
  liveClasses: LiveClassItem[];
  announcements: AnnouncementItem[];
  batches: InstitutionBatchItem[];
  smtp: SmtpSettings;
  stats: {
    totalCourses: number;
    publishedCourses: number;
    pendingCourses: number;
    totalUsers: number;
    totalStudents: number;
    totalRevenue: number;
    totalQuizzes: number;
    totalCategories: number;
    totalSubCategories: number;
    activeCoupons: number;
    databaseMode: string;
  };
}

export function AdminPanelClient({
  adminName,
  courses,
  categories,
  users,
  enrollments,
  coupons,
  paymentSettings,
  invoices,
  payouts,
  assignments,
  liveClasses,
  announcements,
  batches,
  smtp,
  stats,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  // Category & Sub-category state
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [subParentId, setSubParentId] = useState(categories[0]?.id || "");
  const [subName, setSubName] = useState("");

  // Manual enrollment state
  const [enrollUserId, setEnrollUserId] = useState(
    users.find((u) => u.role === "STUDENT")?.id || users[0]?.id || ""
  );
  const [enrollCourseId, setEnrollCourseId] = useState(courses[0]?.id || "");
  const [enrollMsg, setEnrollMsg] = useState("");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("25");

  const menuItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "Course Manager", icon: BookOpen, badge: stats.totalCourses },
    { id: "create-course", label: "Create Course", icon: PlusCircle },
    { id: "curriculum", label: "Curriculum & Quizzes", icon: HelpCircle, badge: stats.totalQuizzes },
    { id: "categories", label: "Categories & Sub-Cat", icon: FolderTree },
    { id: "students", label: "Student Enrollment", icon: GraduationCap },
    { id: "assignments", label: "Project Grading", icon: FolderGit2, badge: assignments.length },
    { id: "live", label: "Live & Notices", icon: Video },
    { id: "batches", label: "School / College B2B", icon: School },
    { id: "payouts", label: "Payouts & Sales", icon: Wallet },
    { id: "payments", label: "Razorpay / PhonePe", icon: CreditCard },
    { id: "users", label: "Users & Roles", icon: Users },
    { id: "coupons", label: "Coupons", icon: Ticket },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  async function changeRole(userId: string, role: Role) {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "user_role", userId, role }),
    });
    router.refresh();
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!catName.trim()) return;
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_category", name: catName, description: catDesc }),
    });
    setCatName("");
    setCatDesc("");
    router.refresh();
  }

  async function handleAddSubCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!subName.trim() || !subParentId) return;
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_subcategory", categoryId: subParentId, name: subName }),
    });
    setSubName("");
    router.refresh();
  }

  async function handleManualEnroll(e: React.FormEvent) {
    e.preventDefault();
    setEnrollMsg("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "manual_enroll",
        userId: enrollUserId,
        courseId: enrollCourseId,
      }),
    });
    if (res.ok) {
      setEnrollMsg("Student enrolled in course!");
      router.refresh();
    }
  }

  async function handleAddCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponCode.trim()) return;
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_coupon",
        code: couponCode,
        discountPercent: Number(couponDiscount),
      }),
    });
    setCouponCode("");
    router.refresh();
  }

  const monthlyRevenueBars = [
    { month: "Jun", val: 38 },
    { month: "Jul", val: 52 },
    { month: "Aug", val: 64 },
    { month: "Sep", val: 59 },
    { month: "Oct", val: 82 },
    { month: "Nov", val: 96 },
  ];

  return (
    <div className="flex min-h-[calc(100vh-68px)] flex-col lg:flex-row">
      {/* LEFT ADMIN SIDEBAR */}
      <aside className="admin-sidebar w-full shrink-0 border-b border-white/10 bg-[#070B18] lg:w-64 lg:border-b-0 lg:border-r">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                Admin Panel
              </div>
              <div className="mt-0.5 font-display text-base font-bold text-white">{adminName}</div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex shrink-0 items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition lg:w-full ${
                  active
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-400/35"
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-5 sm:p-8 space-y-6 overflow-x-hidden">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {menuItems.find((m) => m.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-slate-400">Aibo8 Academy LMS Administration Workspace</p>
          </div>
          <button
            onClick={() => setActiveTab("create-course")}
            className="btn-cyber inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> New Course
          </button>
        </div>

        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="glass-card rounded-2xl p-5">
                <div className="text-xs font-semibold uppercase text-slate-400">Total Courses</div>
                <div className="mt-2 font-display text-3xl font-bold text-white">{stats.totalCourses}</div>
                <div className="mt-1 text-xs text-cyan-300">
                  {stats.publishedCourses} live • {stats.pendingCourses} pending
                </div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="text-xs font-semibold uppercase text-slate-400">Total Enrollments</div>
                <div className="mt-2 font-display text-3xl font-bold text-white">
                  {stats.totalStudents.toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-emerald-400">+18% this month</div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="text-xs font-semibold uppercase text-slate-400">Platform Revenue</div>
                <div className="mt-2 font-display text-3xl font-bold text-emerald-400">
                  ₹{stats.totalRevenue.toLocaleString("en-IN")}
                </div>
                <div className="mt-1 text-xs text-slate-400">Free + Paid catalog</div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="text-xs font-semibold uppercase text-slate-400">Categories & Exams</div>
                <div className="mt-2 font-display text-3xl font-bold text-indigo-300">
                  {stats.totalCategories} / {stats.totalSubCategories}
                </div>
                <div className="mt-1 text-xs text-slate-400">{stats.totalQuizzes} objective quizzes active</div>
              </div>
            </div>

            {/* Revenue & Enrollment Chart */}
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="glass-card lg:col-span-8 rounded-2xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
                      <BarChart3 className="h-4 w-4 text-cyan-400" /> Admin Revenue & Enrollment Growth
                    </h3>
                    <p className="text-xs text-slate-400">Last 6 months across AI, Robotics & IoT tracks</p>
                  </div>
                </div>
                <div className="flex h-48 items-end justify-between gap-3 pt-4">
                  {monthlyRevenueBars.map((b) => (
                    <div key={b.month} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full max-w-[44px] rounded-t-xl bg-gradient-to-t from-indigo-600 to-cyan-400 transition-all hover:brightness-125" style={{ height: `${b.val * 1.6}px` }} />
                      <span className="text-xs font-medium text-slate-400">{b.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card lg:col-span-4 rounded-2xl p-6 space-y-4">
                <h3 className="font-display text-base font-bold text-white">Quick Admin Actions</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab("create-course")}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold text-white hover:border-cyan-400/50"
                  >
                    <span>+ Create Free or Paid Course</span>
                    <PlusCircle className="h-4 w-4 text-cyan-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab("curriculum")}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold text-white hover:border-cyan-400/50"
                  >
                    <span>+ Build Objective Exam / Quiz</span>
                    <HelpCircle className="h-4 w-4 text-indigo-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab("categories")}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold text-white hover:border-cyan-400/50"
                  >
                    <span>+ Manage Categories & Sub-Cats</span>
                    <FolderTree className="h-4 w-4 text-emerald-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab("students")}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold text-white hover:border-cyan-400/50"
                  >
                    <span>+ Manually Enroll Student</span>
                    <UserPlus className="h-4 w-4 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ALL COURSES MANAGER */}
        {activeTab === "courses" && (
          <CourseManager
            courses={courses}
            categories={categories}
            isAdmin={true}
            onCreateNew={() => setActiveTab("create-course")}
          />
        )}

        {/* 3. CREATE COURSE (ADMIN CAN CREATE COURSES!) */}
        {activeTab === "create-course" && (
          <CreateCourseForm categories={categories} onCreated={() => setActiveTab("courses")} />
        )}

        {/* 4. CURRICULUM & OBJECTIVE EXAMS / QUIZZES */}
        {activeTab === "curriculum" && <CurriculumAndQuizManager courses={courses} />}

        {/* 5. CATEGORIES & SUB-CATEGORIES */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <form onSubmit={handleAddCategory} className="glass-card rounded-2xl p-6 space-y-3">
                <h3 className="font-display text-base font-bold text-white">Add Main Category</h3>
                <input
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g., Autonomous Drones"
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2.5 text-sm text-white"
                />
                <input
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Short description..."
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2.5 text-sm text-white"
                />
                <button type="submit" className="btn-cyber rounded-xl px-5 py-2 text-xs font-semibold text-white">
                  + Add Category
                </button>
              </form>

              <form onSubmit={handleAddSubCategory} className="glass-card rounded-2xl p-6 space-y-3">
                <h3 className="font-display text-base font-bold text-white">Add Sub-Category</h3>
                <select
                  value={subParentId}
                  onChange={(e) => setSubParentId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      Parent: {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  required
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g., PCB Design & KiCad"
                  className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2.5 text-sm text-white"
                />
                <button type="submit" className="btn-cyber rounded-xl px-5 py-2 text-xs font-semibold text-white">
                  + Add Sub-Category
                </button>
              </form>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {categories.map((cat) => (
                <div key={cat.id} className="glass-card rounded-2xl p-5 space-y-3">
                  <div className="font-display text-lg font-bold text-white">{cat.name}</div>
                  <p className="text-xs text-slate-400">{cat.description}</p>
                  <div className="space-y-1.5 border-t border-white/10 pt-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      Sub-Categories ({cat.subCategories.length})
                    </div>
                    {cat.subCategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-200"
                      >
                        {sub.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. STUDENTS & MANUAL ENROLLMENT */}
        {activeTab === "students" && (
          <div className="space-y-6">
            <form onSubmit={handleManualEnroll} className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-white">
                  Manual Course Enrollment
                </h3>
                {enrollMsg && <span className="text-xs font-semibold text-emerald-400">{enrollMsg}</span>}
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <select
                  value={enrollUserId}
                  onChange={(e) => setEnrollUserId(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-white"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
                <select
                  value={enrollCourseId}
                  onChange={(e) => setEnrollCourseId(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn-cyber rounded-xl px-5 py-2.5 text-sm font-semibold text-white">
                  Enroll Student
                </button>
              </div>
            </form>

            <div className="glass-card overflow-hidden rounded-2xl">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Student</th>
                    <th className="px-5 py-3">Course</th>
                    <th className="px-5 py-3">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {enrollments.map((enr) => (
                    <tr key={enr.id}>
                      <td className="px-5 py-3">
                        <div className="font-semibold text-white">{enr.userName}</div>
                        <div className="text-xs text-slate-400">{enr.userEmail}</div>
                      </td>
                      <td className="px-5 py-3 text-slate-300">{enr.courseTitle}</td>
                      <td className="px-5 py-3 font-semibold text-cyan-300">{enr.progress}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. PROJECT ASSIGNMENTS GRADING */}
        {activeTab === "assignments" && <AssignmentGradingPanel assignments={assignments} />}

        {/* 7B. LIVE CLASSES & ANNOUNCEMENTS */}
        {activeTab === "live" && (
          <LiveAndAnnouncementsAdmin
            courses={courses}
            liveClasses={liveClasses}
            announcements={announcements}
          />
        )}

        {/* 7C. SCHOOL & COLLEGE BULK BATCHES */}
        {activeTab === "batches" && (
          <InstitutionalBatchesAdmin courses={courses} batches={batches} />
        )}

        {/* 8. PAYOUTS & SALES */}
        {activeTab === "payouts" && (
          <PayoutsAndSalesAdminPanel invoices={invoices} payouts={payouts} />
        )}

        {/* 9. RAZORPAY & PHONEPE PAYMENT SETTINGS */}
        {activeTab === "payments" && <PaymentSettingsPanel initial={paymentSettings} />}

        {/* 10. USERS & ROLES */}
        {activeTab === "users" && (
          <div className="glass-card rounded-2xl p-6 divide-y divide-white/5">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-3.5">
                <div>
                  <div className="text-sm font-semibold text-white">{u.name}</div>
                  <div className="text-xs text-slate-400">{u.email}</div>
                </div>
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value as Role)}
                  className="rounded-lg border border-white/10 bg-[#050814] px-3 py-1.5 text-xs font-semibold text-cyan-300"
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="INSTRUCTOR">INSTRUCTOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* 8. COUPONS */}
        {activeTab === "coupons" && (
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <form onSubmit={handleAddCoupon} className="flex flex-wrap gap-3">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="COUPON CODE (e.g. AIBO30)"
                className="flex-1 min-w-[200px] rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-xs uppercase text-white"
              />
              <input
                type="number"
                min={5}
                max={100}
                value={couponDiscount}
                onChange={(e) => setCouponDiscount(e.target.value)}
                className="w-28 rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-xs text-white"
              />
              <button type="submit" className="btn-cyber rounded-xl px-5 py-2.5 text-xs font-semibold text-white">
                + Create Coupon
              </button>
            </form>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {coupons.map((cp) => (
                <div
                  key={cp.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <span className="font-mono-code text-sm font-bold text-cyan-300">{cp.code}</span>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    {cp.discountPercent}% OFF
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. SYSTEM SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="glass-card rounded-2xl p-6 space-y-3">
                <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
                  <Database className="h-4 w-4 text-cyan-400" /> Database &amp; Deployment Mode
                </h3>
                <p className="text-sm text-slate-300">{stats.databaseMode}</p>
                <p className="text-xs text-slate-400">
                  Full 20+ table PostgreSQL schema ready in prisma/schema.prisma for AWS EC2.
                </p>
              </div>
              <div className="glass-card rounded-2xl p-6 space-y-3">
                <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
                  <CreditCard className="h-4 w-4 text-emerald-400" /> Active Payment Gateway
                </h3>
                <p className="text-sm text-slate-300">
                  Active Frontend Method: <strong>{paymentSettings.activeGateway}</strong>
                </p>
                <p className="text-xs text-slate-400">
                  Switch between Razorpay &amp; PhonePe anytime in the Razorpay / PhonePe tab.
                </p>
              </div>
            </div>
            <SmtpSettingsAdmin initial={smtp} />
          </div>
        )}
      </div>
    </div>
  );
}
