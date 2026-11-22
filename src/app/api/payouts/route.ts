import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { requestInstructorPayout, updatePayoutStatus } from "@/lib/lms-extras";

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if (body.action === "request") {
    if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Instructor access required" }, { status: 403 });
    }
    const payout = requestInstructorPayout(
      user,
      Number(body.amount) || 0,
      body.method || "UPI / Bank Transfer",
      body.accountDetails || ""
    );
    return NextResponse.json({ payout }, { status: 201 });
  }

  if (body.action === "update_status") {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    const payout = updatePayoutStatus(body.payoutId, body.status);
    return NextResponse.json({ payout });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
