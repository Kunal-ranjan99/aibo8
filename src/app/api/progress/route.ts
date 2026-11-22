import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateLessonProgress } from "@/lib/store";

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { courseId, lessonId, completed, quizScore } = await req.json();
    const result = await updateLessonProgress(user.id, courseId, lessonId, Boolean(completed), quizScore);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Could not update progress." }, { status: 500 });
  }
}
