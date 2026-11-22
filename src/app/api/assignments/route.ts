import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getAllAssignments,
  getCourseAssignments,
  gradeAssignment,
  submitAssignment,
} from "@/lib/lms-extras";

export async function GET(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ assignments: [] });
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  if (courseId) {
    const list =
      user.role === "STUDENT"
        ? getCourseAssignments(courseId, user.id)
        : getCourseAssignments(courseId);
    return NextResponse.json({ assignments: list });
  }
  return NextResponse.json({ assignments: getAllAssignments() });
}

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const body = await req.json();

  if (body.action === "grade") {
    if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Instructor/Admin access required." }, { status: 403 });
    }
    const graded = gradeAssignment(body.assignmentId, Number(body.grade) || 0, body.feedback || "");
    return NextResponse.json({ assignment: graded });
  }

  if (!body.courseId || !body.projectTitle?.trim()) {
    return NextResponse.json({ error: "Project title is required." }, { status: 400 });
  }
  const sub = submitAssignment({
    user,
    courseId: body.courseId,
    courseTitle: body.courseTitle || "Aibo8 Course",
    projectTitle: body.projectTitle,
    repoUrl: body.repoUrl || "",
    schematicUrl: body.schematicUrl || "",
    notes: body.notes || "",
  });
  return NextResponse.json({ assignment: sub }, { status: 201 });
}
