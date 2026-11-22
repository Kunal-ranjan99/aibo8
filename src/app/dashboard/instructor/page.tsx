import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllCourses, getCategories } from "@/lib/store";
import {
  getAllAssignments,
  getInstructorPayouts,
  getInstructorSales,
} from "@/lib/lms-extras";
import { InstructorStudioClient } from "@/components/InstructorStudioClient";

export const dynamic = "force-dynamic";

export default async function InstructorDashboardPage() {
  const user = await getSession();
  if (!user) redirect("/auth/login");
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") redirect("/dashboard/student");

  const allCourses = await getAllCourses(true);
  const categories = getCategories();
  const myCourses =
    user.role === "ADMIN" ? allCourses : allCourses.filter((c) => c.instructorId === user.id);
  const sales = getInstructorSales(user.id);
  const payouts = getInstructorPayouts(user.id);
  const assignments = getAllAssignments();

  return (
    <InstructorStudioClient
      instructorName={user.name}
      courses={myCourses}
      categories={categories}
      sales={sales}
      payouts={payouts}
      assignments={assignments}
    />
  );
}
