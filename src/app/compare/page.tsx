import { getAllCourses } from "@/lib/store";
import { CompareClient } from "@/components/CompareClient";

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const courses = await getAllCourses(false);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Side-by-Side Comparison
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-5xl">
          Compare Aibo8 Courses
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Help students and parents pick the right AI, Robotics, or IoT course by comparing hardware
          kits, difficulty, duration, and pricing side by side.
        </p>
      </div>
      <CompareClient courses={courses} />
    </div>
  );
}
