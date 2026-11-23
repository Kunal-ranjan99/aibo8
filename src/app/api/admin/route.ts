import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  addCoupon,
  createCategory,
  createSubCategory,
  deleteCoupon,
  enrollInCourse,
  updateCoupon,
  updateCourseStatus,
  updateUserRecord,
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
    if (body.action === "update_user") {
      if (!body.userId) {
        return NextResponse.json({ error: "userId is required." }, { status: 400 });
      }
      if (body.newPassword && String(body.newPassword).trim().length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters." },
          { status: 400 }
        );
      }
      const updated = await updateUserRecord(body.userId, {
        name: body.name,
        email: body.email,
        role: body.role as Role,
        newPassword: body.newPassword,
      });
      return NextResponse.json({ user: updated });
    }
    if (body.action === "create_coupon") {
      const coupon = addCoupon({
        code: body.code,
        discountType: body.discountType === "FLAT" ? "FLAT" : "PERCENT",
        discountValue: Number(body.discountValue ?? body.discountPercent) || 15,
        active: body.active !== undefined ? Boolean(body.active) : true,
        expiresAt: body.expiresAt || null,
      });
      return NextResponse.json({ coupon });
    }
    if (body.action === "update_coupon") {
      const coupon = updateCoupon(body.couponId, {
        code: body.code,
        discountType: body.discountType,
        discountValue: body.discountValue !== undefined ? Number(body.discountValue) : undefined,
        active: body.active,
        expiresAt: body.expiresAt,
      });
      return NextResponse.json({ coupon });
    }
    if (body.action === "delete_coupon") {
      deleteCoupon(body.couponId);
      return NextResponse.json({ ok: true });
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
