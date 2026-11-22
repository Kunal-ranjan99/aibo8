import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addLessonNote, getLessonNotes } from "@/lib/store";

export async function GET(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ notes: [] });
  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId") || "";
  const notes = await getLessonNotes(user.id, lessonId);
  return NextResponse.json({ notes });
}

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Sign in to save notes." }, { status: 401 });
  const { lessonId, content } = await req.json();
  if (!lessonId || !content?.trim()) {
    return NextResponse.json({ error: "Note content is required." }, { status: 400 });
  }
  const note = await addLessonNote(user.id, lessonId, content.trim());
  return NextResponse.json({ note }, { status: 201 });
}
