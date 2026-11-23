import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { enrollInCourse, getAllCourses } from "@/lib/store";
import {
  addAnnouncement,
  addLiveClass,
  createInstitutionBatch,
  createKitOrder,
  generateAiTutorReply,
  getAnnouncements,
  getHardwareBom,
  getInstitutionBatches,
  getLeaderboard,
  getLiveClasses,
  getSmtpSettings,
  getUserNotifications,
  markAllNotificationsRead,
  redeemInstitutionBatch,
  updateSmtpSettings,
} from "@/lib/v3-features";

export async function GET(req: Request) {
  const user = await getSession();
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId") || undefined;

  return NextResponse.json({
    liveClasses: getLiveClasses(courseId),
    announcements: getAnnouncements(),
    leaderboard: getLeaderboard(),
    hardwareBom: courseId ? getHardwareBom(courseId) : [],
    notifications: user ? getUserNotifications(user.id) : [],
    batches: user?.role === "ADMIN" ? getInstitutionBatches() : [],
    smtp: user?.role === "ADMIN" ? getSmtpSettings() : null,
  });
}

export async function POST(req: Request) {
  const user = await getSession();
  const body = await req.json();

  // AI Study Buddy inside Course Player (available to any signed-in or guest learner)
  if (body.action === "ai_tutor") {
    const prompt = String(body.prompt || "").trim();
    const courseTitle = String(body.courseTitle || "Aibo8 Lab");
    if (!prompt) return NextResponse.json({ error: "Enter a question." }, { status: 400 });

    // Optional live OpenAI support if OPENAI_API_KEY is set on EC2
    if (process.env.OPENAI_API_KEY) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are Aibo8 AI Study Buddy helping school & college students learn AI, Robotics & IoT in "${courseTitle}". Keep explanations clear, friendly, and practical.`,
              },
              { role: "user", content: prompt },
            ],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) return NextResponse.json({ reply });
        }
      } catch {
        // fall through to built-in Robotics/IoT tutor
      }
    }

    return NextResponse.json({ reply: generateAiTutorReply(prompt, courseTitle) });
  }

  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  if (body.action === "mark_notifications_read") {
    markAllNotificationsRead(user.id);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "order_kit") {
    const order = createKitOrder({
      userId: user.id,
      userName: user.name,
      courseId: body.courseId,
      courseTitle: body.courseTitle || "Aibo8 Course",
      totalInr: Number(body.totalInr) || 1299,
      address: String(body.address || "").trim(),
    });
    return NextResponse.json({ order }, { status: 201 });
  }

  if (body.action === "redeem_batch") {
    const batch = redeemInstitutionBatch(String(body.batchCode || ""));
    if (!batch) {
      return NextResponse.json(
        { error: "Invalid batch code or all seats are filled." },
        { status: 400 }
      );
    }
    await enrollInCourse(user.id, batch.courseId);
    return NextResponse.json({ batch });
  }

  if (body.action === "create_live_class") {
    if (user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const courses = await getAllCourses(true);
    const course = courses.find((c) => c.id === body.courseId);
    const created = addLiveClass({
      courseId: body.courseId || "course-2",
      courseTitle: course?.title || "Aibo8 Live Workshop",
      title: body.title,
      hostName: user.name,
      platform: body.platform || "Zoom",
      meetingUrl: body.meetingUrl || "https://meet.google.com/new",
      scheduledAt: body.scheduledAt || new Date(Date.now() + 86400000).toISOString(),
      durationMin: Number(body.durationMin) || 60,
    });
    return NextResponse.json({ liveClass: created }, { status: 201 });
  }

  if (body.action === "create_announcement") {
    if (user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const ann = addAnnouncement(body.title, body.body, user.name, body.courseId);
    return NextResponse.json({ announcement: ann }, { status: 201 });
  }

  if (body.action === "create_batch") {
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Admin required" }, { status: 403 });
    const courses = await getAllCourses(true);
    const course = courses.find((c) => c.id === body.courseId) || courses[0];
    const batch = createInstitutionBatch({
      institutionName: body.institutionName,
      batchCode: body.batchCode,
      courseId: course.id,
      courseTitle: course.title,
      maxSeats: Number(body.maxSeats) || 50,
    });
    return NextResponse.json({ batch }, { status: 201 });
  }

  if (body.action === "update_smtp") {
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Admin required" }, { status: 403 });
    const smtp = updateSmtpSettings(body.smtp);
    return NextResponse.json({ smtp });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
