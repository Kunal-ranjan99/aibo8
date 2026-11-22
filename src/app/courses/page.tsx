import { getAllCourses, getCategories } from "@/lib/store";
import { CatalogClient } from "@/components/CatalogClient";

export const dynamic = "force-dynamic";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string; q?: string }>;
}) {
  const params = await searchParams;
  const courses = await getAllCourses(false);
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Aibo8 Course Marketplace
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-5xl">
          AI, Robotics & IoT Courses
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Browse by Category, Sub-Category, Hardware Stack, or Level. Includes free & paid courses,
          objective exams, and official Aibo8 certificates.
        </p>
      </div>

      <CatalogClient
        courses={courses}
        categories={categories}
        initialTrack={params.track || "all"}
        initialQuery={params.q || ""}
      />
    </div>
  );
}
