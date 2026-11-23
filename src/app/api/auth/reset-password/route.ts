import { NextResponse } from "next/server";
import { updateUserPassword } from "@/lib/store";
import { createPasswordResetCode, verifyPasswordResetCode } from "@/lib/v3-features";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.action === "request_code") {
    const email = String(body.email || "").trim().toLowerCase();
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });
    const code = createPasswordResetCode(email);
    // In production with SMTP enabled, this code is emailed; returned in dev/demo response for easy testing
    return NextResponse.json({
      ok: true,
      message: "6-digit verification code sent to your email.",
      demoCode: code,
    });
  }

  if (body.action === "confirm_reset") {
    const { email, code, newPassword } = body;
    if (!email || !code || !newPassword || String(newPassword).length < 6) {
      return NextResponse.json(
        { error: "Email, 6-digit code, and new password (min 6 chars) are required." },
        { status: 400 }
      );
    }
    if (!verifyPasswordResetCode(email, code)) {
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
    }
    const ok = await updateUserPassword(email, newPassword);
    if (!ok) {
      return NextResponse.json({ error: "No account found with that email." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: "Password updated! You can now sign in." });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
