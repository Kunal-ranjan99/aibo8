import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSession } from "@/lib/auth";
import { enrollInCourse, getAllCourses, validateCouponCode } from "@/lib/store";
import {
  createInvoice,
  getBundleById,
  getPaymentSettings,
  updatePaymentSettings,
} from "@/lib/lms-extras";

export async function GET() {
  const settings = getPaymentSettings();
  return NextResponse.json({
    settings: {
      activeGateway: settings.activeGateway,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      adminCommissionPercent: settings.adminCommissionPercent,
      razorpay: {
        enabled: settings.razorpay.enabled,
        mode: settings.razorpay.mode,
        keyId: settings.razorpay.keyId,
        hasSecret: Boolean(settings.razorpay.keySecret),
      },
      phonepe: {
        enabled: settings.phonepe.enabled,
        mode: settings.phonepe.mode,
        merchantId: settings.phonepe.merchantId,
        saltIndex: settings.phonepe.saltIndex,
        hasSaltKey: Boolean(settings.phonepe.saltKey),
      },
    },
  });
}

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const body = await req.json();

  // Admin: update Razorpay / PhonePe / Commission settings
  if (body.action === "update_settings") {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    const updated = updatePaymentSettings(body.settings);
    return NextResponse.json({ settings: updated });
  }

  // Verify live Razorpay HMAC-SHA256 signature or PhonePe SHA-256 checksum
  if (body.action === "verify_signature") {
    const settings = getPaymentSettings();
    if (body.gateway === "RAZORPAY" && settings.razorpay.keySecret) {
      const expected = crypto
        .createHmac("sha256", settings.razorpay.keySecret)
        .update(`${body.orderId}|${body.paymentId}`)
        .digest("hex");
      return NextResponse.json({ verified: expected === body.signature });
    }
    if (body.gateway === "PHONEPE" && settings.phonepe.saltKey) {
      const expected =
        crypto
          .createHash("sha256")
          .update(`${body.payload}/pg/v1/pay${settings.phonepe.saltKey}`)
          .digest("hex") +
        "###" +
        settings.phonepe.saltIndex;
      return NextResponse.json({ verified: expected === body.checksum });
    }
    return NextResponse.json({ verified: true, mode: "sandbox" });
  }

  // Checkout for Course or Bundle (Razorpay / PhonePe / Free)
  if (body.action === "checkout") {
    const gateway = (body.gateway || "RAZORPAY") as "RAZORPAY" | "PHONEPE" | "FREE" | "DEMO";

    if (body.itemType === "BUNDLE") {
      const bundle = getBundleById(body.itemId);
      if (!bundle) return NextResponse.json({ error: "Bundle not found." }, { status: 404 });
      const couponCheck = body.couponCode
        ? validateCouponCode(String(body.couponCode), bundle.bundlePrice)
        : { valid: false, discountAmount: 0 };
      const discount = couponCheck.valid ? couponCheck.discountAmount : 0;
      for (const cid of bundle.courseIds) {
        await enrollInCourse(user.id, cid);
      }
      const invoice = createInvoice({
        user,
        itemType: "BUNDLE",
        itemId: bundle.id,
        itemTitle: bundle.title,
        instructorId: "user-inst-1",
        gateway,
        subtotal: bundle.bundlePrice,
        discount,
      });
      return NextResponse.json({ ok: true, invoice });
    }

    const courses = await getAllCourses(true);
    const course = courses.find((c) => c.id === body.itemId);
    if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });

    const basePrice = course.isFree ? 0 : (course.discountPrice ?? course.price);
    const couponCheck =
      !course.isFree && body.couponCode
        ? validateCouponCode(String(body.couponCode), basePrice)
        : { valid: false, discountAmount: 0 };
    const discount = couponCheck.valid ? couponCheck.discountAmount : 0;
    await enrollInCourse(user.id, course.id);
    const invoice = createInvoice({
      user,
      itemType: "COURSE",
      itemId: course.id,
      itemTitle: course.title,
      instructorId: course.instructorId,
      gateway: basePrice - discount <= 0 ? "FREE" : gateway,
      subtotal: basePrice,
      discount,
    });
    return NextResponse.json({ ok: true, invoice });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
