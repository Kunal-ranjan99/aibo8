import { NextResponse } from "next/server";
import { validateCouponCode } from "@/lib/store";

export async function POST(req: Request) {
  const { code, amount } = await req.json();
  if (!code) {
    return NextResponse.json({ valid: false, discountAmount: 0, message: "Enter a coupon code." });
  }
  const result = validateCouponCode(String(code), Number(amount) || 0);
  return NextResponse.json(result);
}
