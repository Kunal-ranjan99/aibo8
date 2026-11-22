import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  addLessonToSection,
  addSectionToCourse,
  deleteLessonFromSection,
  deleteSectionFromCourse,
} from "@/lib/store";
import { LessonType, QuizQuestion } from "@/lib/types";

export async function POST(req: Request) {
  const user = await getSession();
  if (!user || (user.role !== "ADMIN" && user.role !== "INSTRUCTOR")) {
    return NextResponse.json({ error: "Instructor or Admin access required." }, { status: 403 });
  }
  try {
    const body = await req.json();
    if (body.action === "add_section") {
      if (!body.courseId || !body.title?.trim()) {
        return NextResponse.json({ error: "Course and section title required." }, { status: 400 });
      }
      const section = addSectionToCourse(body.courseId, body.title);
      return NextResponse.json({ section }, { status: 201 });
    }

    if (body.action === "delete_section") {
      deleteSectionFromCourse(body.courseId, body.sectionId);
      return NextResponse.json({ ok: true });
    }

    if (body.action === "delete_lesson") {
      deleteLessonFromSection(body.courseId, body.sectionId, body.lessonId);
      return NextResponse.json({ ok: true });
    }

    if (body.action === "add_lesson") {
      if (!body.courseId || !body.sectionId || !body.title?.trim()) {
        return NextResponse.json({ error: "Course, section, and lesson title required." }, { status: 400 });
      }
      const lesson = addLessonToSection(body.courseId, body.sectionId, {
        title: body.title.trim(),
        type: (body.type as LessonType) || "VIDEO",
        duration: body.duration || "10:00",
        isPreview: Boolean(body.isPreview),
        videoUrl: body.videoUrl || null,
        content: body.content || null,
        codeSnippet: body.codeSnippet || null,
        codeLang: body.codeLang || null,
        quizData: (body.quizData as QuizQuestion[]) || null,
        passingScore: body.passingScore ? Number(body.passingScore) : 60,
        timeLimitMinutes: body.timeLimitMinutes ? Number(body.timeLimitMinutes) : 10,
      });
      return NextResponse.json({ lesson }, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update curriculum." },
      { status: 500 }
    );
  }
}
