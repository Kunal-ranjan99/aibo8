import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addCourseReview } from "@/lib/store";

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Sign in to post a review." }, { status: 401 });
  const { courseId, rating, comment } = await req.json();
  if (!courseId || !comment?.trim()) {
    return NextResponse.json({ error: "Review comment is required." }, { status: 400 });
  }
  const review = await addCourseReview(courseId, user, Number(rating) || 5, comment.trim());
  return NextResponse.json({ review }, { status: 201 });
}
