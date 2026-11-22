import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/store";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    await setSessionCookie(user);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
