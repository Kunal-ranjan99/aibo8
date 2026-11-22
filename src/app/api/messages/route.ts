import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserMessages, sendMessageInStore } from "@/lib/lms-extras";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ messages: [] });
  return NextResponse.json({ messages: getUserMessages(user.id) });
}

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Sign in to send messages." }, { status: 401 });
  const { receiverId, receiverName, body } = await req.json();
  if (!receiverId || !body?.trim()) {
    return NextResponse.json({ error: "Recipient and message body are required." }, { status: 400 });
  }
  const msg = sendMessageInStore({
    sender: user,
    receiverId,
    receiverName: receiverName || "Aibo8 Member",
    body,
  });
  return NextResponse.json({ message: msg }, { status: 201 });
}
