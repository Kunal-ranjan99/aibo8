import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getSession();
  if (!user || (user.role !== "ADMIN" && user.role !== "INSTRUCTOR")) {
    return NextResponse.json({ error: "Instructor or Admin login required." }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 45MB max size (matches Nginx client_max_body_size 50M)
    if (buffer.length > 45 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 45MB limit." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase() || ".bin";
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"];
    if (!allowed.includes(ext)) {
      return NextResponse.json(
        { error: "Allowed formats: JPG, PNG, WEBP, GIF, MP4, WEBM, MOV." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    await writeFile(path.join(uploadDir, safeName), buffer);

    return NextResponse.json({ url: `/uploads/${safeName}` }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "File upload failed." }, { status: 500 });
  }
}
