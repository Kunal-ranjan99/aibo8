import { NextResponse } from "next/server";
import { registerUser } from "@/lib/store";
import { setSessionCookie } from "@/lib/auth";
import { Role } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    const safeRole: Role = role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT";
    const user = await registerUser(name, email, password, safeRole);
    await setSessionCookie(user);
    return NextResponse.json({ user });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Signup failed.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
