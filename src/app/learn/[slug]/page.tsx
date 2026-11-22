import { notFound } from "next/navigation";
import { getCourseBySlug, getUserCertificates, getUserEnrollments } from "@/lib/store";
import { getSession } from "@/lib/auth";
import { CoursePlayerClient } from "@/components/CoursePlayerClient";

export const dynamic = "force-dynamic";

export default async function LearnCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const user = await getSession();
  const enrollments = user ? await getUserEnrollments(user.id) : [];
  const enrollment = enrollments.find((e) => e.courseId === course.id) ?? null;
  const certs = user ? await getUserCertificates(user.id) : [];
  const cert = certs.find((c) => c.courseId === course.id) ?? null;

  return (
    <CoursePlayerClient
      course={course}
      initialEnrollment={enrollment}
      initialCertificate={cert}
      isLoggedIn={Boolean(user)}
    />
  );
}
