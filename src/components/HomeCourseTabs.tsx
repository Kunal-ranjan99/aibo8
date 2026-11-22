"use client";

import { useState } from "react";
import { CourseData } from "@/lib/types";
import { CourseCard } from "./CourseCard";

const TABS = [
  { id: "all", label: "All Courses" },
  { id: "ai-ml", label: "AI & Edge ML" },
  { id: "robotics", label: "Robotics & ROS2" },
  { id: "iot-hardware", label: "IoT & Hardware" },
  { id: "free", label: "Free Labs" },
];

export function HomeCourseTabs({ courses }: { courses: CourseData[] }) {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = courses.filter((c) => {
    if (activeTab === "all") return true;
    if (activeTab === "free") return c.isFree;
    return c.categorySlug === activeTab;
  });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-semibold shadow-[0_0_20px_rgba(0,240,255,0.35)]"
                  : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-400/40 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
