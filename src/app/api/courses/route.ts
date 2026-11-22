import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createCourseInStore,
  deleteCourseFromStore,
  getAllCourses,
  updateCourseInStore,
} from "@/lib/store";

export async function GET() {
  const courses = await getAllCourses(false);
  return NextResponse.json({ courses });
}

export async function POST(req: Request) {
  const user = await getSession();
  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Instructor or Admin access required." }, { status: 403 });
  }
  try {
    const body = await req.json();
    if (!body.title || !body.shortDescription) {
      return NextResponse.json({ error: "Title and short description are required." }, { status: 400 });
    }
    const isFree = Boolean(body.isFree) || Number(body.price) <= 0;
    const course = await createCourseInStore({
      title: body.title,
      shortDescription: body.shortDescription,
      description: body.description || body.shortDescription,
      categorySlug: body.categorySlug || "robotics",
      subCategorySlug: body.subCategorySlug || undefined,
      level: body.level || "Beginner",
      isFree,
      price: isFree ? 0 : Number(body.price) || 0,
      discountPrice: !isFree && body.discountPrice ? Number(body.discountPrice) : null,
      hardwareTags: Array.isArray(body.hardwareTags)
        ? body.hardwareTags
        : String(body.hardwareTags || "")
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean),
      instructor: user,
      sectionTitle: body.sectionTitle,
      lessonTitle: body.lessonTitle,
      lessonVideoUrl: body.lessonVideoUrl,
    });
    return NextResponse.json({ course }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create course." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const user = await getSession();
  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Course ID is required." }, { status: 400 });
    }
    const all = await getAllCourses(true);
    const existing = all.find((c) => c.id === body.id);
    if (!existing) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }
    if (user.role !== "ADMIN" && existing.instructorId !== user.id) {
      return NextResponse.json({ error: "You can only edit your own courses." }, { status: 403 });
    }

    const updated = await updateCourseInStore(body.id, {
      title: body.title,
      shortDescription: body.shortDescription,
      description: body.description,
      categorySlug: body.categorySlug,
      subCategorySlug: body.subCategorySlug,
      level: body.level,
      duration: body.duration,
      isFree: body.isFree,
      price: body.price,
      discountPrice: body.discountPrice,
      hardwareTags: Array.isArray(body.hardwareTags)
        ? body.hardwareTags
        : typeof body.hardwareTags === "string"
        ? body.hardwareTags
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean)
        : undefined,
      outcomes: Array.isArray(body.outcomes) ? body.outcomes : undefined,
      requirements: Array.isArray(body.requirements) ? body.requirements : undefined,
      // Only Admin can directly set PUBLISHED status; instructor edits keep/set PENDING if requested
      status: user.role === "ADMIN" ? body.status : existing.status,
    });

    return NextResponse.json({ course: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update course." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getSession();
  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing course id" }, { status: 400 });

  const all = await getAllCourses(true);
  const existing = all.find((c) => c.id === id);
  if (!existing) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  if (user.role !== "ADMIN" && existing.instructorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  deleteCourseFromStore(id);
  return NextResponse.json({ ok: true });
}
