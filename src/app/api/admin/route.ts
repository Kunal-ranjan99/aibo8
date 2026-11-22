import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  addCoupon,
  createCategory,
  createSubCategory,
  enrollInCourse,
  updateCourseStatus,
  updateUserRole,
} from "@/lib/store";
import { CourseStatus, Role } from "@/lib/types";

export async function POST(req: Request) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin privileges required." }, { status: 403 });
  }
  try {
    const body = await req.json();
    if (body.action === "course_status") {
      const updated = await updateCourseStatus(body.courseId, body.status as CourseStatus);
      return NextResponse.json({ course: updated });
    }
    if (body.action === "user_role") {
      const updated = updateUserRole(body.userId, body.role as Role);
      return NextResponse.json({ user: updated });
    }
    if (body.action === "create_coupon") {
      const coupon = addCoupon(body.code, Number(body.discountPercent) || 15);
      return NextResponse.json({ coupon });
    }
    if (body.action === "create_category") {
      const category = createCategory(body.name, body.description || "");
      return NextResponse.json({ category }, { status: 201 });
    }
    if (body.action === "create_subcategory") {
      const subCategory = createSubCategory(body.categoryId, body.name);
      return NextResponse.json({ subCategory }, { status: 201 });
    }
    if (body.action === "manual_enroll") {
      const enrollment = await enrollInCourse(body.userId, body.courseId);
      return NextResponse.json({ enrollment }, { status: 201 });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Admin action failed" },
      { status: 500 }
    );
  }
}
