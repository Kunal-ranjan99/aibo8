import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getAllCourses,
  getAllEnrollmentsForAdmin,
  getAllUsersForAdmin,
  getCategories,
  getCoupons,
  getPlatformStats,
} from "@/lib/store";
import {
  getAllAssignments,
  getAllInvoices,
  getAllPayouts,
  getPaymentSettings,
} from "@/lib/lms-extras";
import {
  getAnnouncements,
  getInstitutionBatches,
  getLiveClasses,
  getSmtpSettings,
} from "@/lib/v3-features";
import { AdminPanelClient } from "@/components/AdminPanelClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getSession();
  if (!user) redirect("/auth/login");
  if (user.role !== "ADMIN") redirect("/dashboard/student");

  const courses = await getAllCourses(true);
  const categories = getCategories();
  const users = getAllUsersForAdmin();
  const enrollments = getAllEnrollmentsForAdmin();
  const coupons = getCoupons();
  const stats = getPlatformStats();
  const paymentSettings = getPaymentSettings();
  const invoices = getAllInvoices();
  const payouts = getAllPayouts();
  const assignments = getAllAssignments();
  const liveClasses = getLiveClasses();
  const announcements = getAnnouncements();
  const batches = getInstitutionBatches();
  const smtp = getSmtpSettings();

  return (
    <AdminPanelClient
      adminName={user.name}
      courses={courses}
      categories={categories}
      users={users}
      enrollments={enrollments}
      coupons={coupons}
      stats={stats}
      paymentSettings={paymentSettings}
      invoices={invoices}
      payouts={payouts}
      assignments={assignments}
      liveClasses={liveClasses}
      announcements={announcements}
      batches={batches}
      smtp={smtp}
    />
  );
}
