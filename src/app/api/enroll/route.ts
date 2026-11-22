import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { enrollInCourse, getCoupons } from "@/lib/store";

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to enroll." }, { status: 401 });
  }
  try {
    const { courseId, couponCode } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: "courseId is required." }, { status: 400 });
    }
    let appliedDiscount = 0;
    if (couponCode) {
      const coupon = getCoupons().find(
        (c) => c.active && c.code.toUpperCase() === String(couponCode).trim().toUpperCase()
      );
      if (coupon) appliedDiscount = coupon.discountPercent;
    }
    const enrollment = await enrollInCourse(user.id, courseId);
    return NextResponse.json({ enrollment, appliedDiscount });
  } catch {
    return NextResponse.json({ error: "Enrollment failed." }, { status: 500 });
  }
}
