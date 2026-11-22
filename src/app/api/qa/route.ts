import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  addLessonQuestion,
  getLessonQuestions,
  replyToLessonQuestion,
} from "@/lib/lms-extras";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId") || "";
  return NextResponse.json({ questions: getLessonQuestions(lessonId) });
}

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Sign in to ask or reply." }, { status: 401 });
  const body = await req.json();

  if (body.action === "reply") {
    const reply = replyToLessonQuestion(body.questionId, user, body.body || "");
    return NextResponse.json({ reply }, { status: 201 });
  }

  if (!body.lessonId || !body.question?.trim()) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }
  const q = addLessonQuestion(user, body.courseId || "", body.lessonId, body.question);
  return NextResponse.json({ question: q }, { status: 201 });
}
