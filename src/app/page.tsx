import Link from "next/link";
import {
  ArrowRight,
  Award,
  Bot,
  CheckCircle2,
  Code2,
  Cpu,
  GitCompare,
  GraduationCap,
  Layers,
  Package,
  Play,
  Radio,
  Rocket,
  School,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { getAllCourses, getCategories } from "@/lib/store";
import { getBundles } from "@/lib/lms-extras";
import { HomeCourseTabs } from "@/components/HomeCourseTabs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const courses = await getAllCourses(false);
  const categories = getCategories();
  const bundles = getBundles();

  const hardwareEcosystem = [
    "Arduino & Fun Kits",
    "ESP32 Smart IoT",
    "Raspberry Pi 5",
    "ROS2 Robotics",
    "NVIDIA Jetson AI",
    "TinyML Voice AI",
    "LiDAR SLAM",
    "Python & C++",
  ];

  const agePathways = [
    {
      badge: "Ages 8–12 • Primary & Middle School",
      title: "Junior Builders",
      desc: "Start from zero! Build glowing LED robots, obstacle-avoiding cars, and fun AI games with step-by-step visual guides.",
      tags: ["No Coding Needed", "Safe Guided Kits", "Fun Quizzes & Badges"],
      icon: Rocket,
      accent: "from-amber-400 to-orange-500",
      href: "/courses?track=iot-hardware",
    },
    {
      badge: "Grades 9–12 • High School & Science Fairs",
      title: "Teen Innovators",
      desc: "Create Wi-Fi smart home gadgets with ESP32, train voice-activated TinyML models, and win school robotics competitions.",
      tags: ["ESP32 & Sensors", "TinyML", "Verified Certificates"],
      icon: School,
      accent: "from-cyan-400 to-sky-500",
      href: "/courses?track=ai-ml",
    },
    {
      badge: "College • B.Tech, Diploma & Makers",
      title: "College & Pro Engineers",
      desc: "Build portfolio-ready ROS2 autonomous rovers, 60 FPS Jetson computer vision, and 6-DOF robotic arms for capstones & placements.",
      tags: ["ROS2 & SLAM", "PyTorch + TensorRT", "Capstone Projects"],
      icon: GraduationCap,
      accent: "from-indigo-400 to-violet-500",
      href: "/courses?track=robotics",
    },
  ];

  return (
    <div id="top" className="relative overflow-hidden">
      {/* HERO SECTION — School & College Student Focused */}
      <section className="hero-dark-canvas relative min-h-[84vh] flex items-center border-b border-white/10 cyber-grid">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src="/images/hero-robotics.jpg"
            alt="Aibo8 AI, Robotics and IoT Academy for Students"
            className="h-full w-full object-cover object-right opacity-60 lg:opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050814] via-[#050814]/90 to-[#050814]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-transparent to-[#050814]/40" />
          <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-cyan-500/15 blur-[130px]" />
          <div className="absolute right-12 bottom-12 h-80 w-80 rounded-full bg-indigo-600/20 blur-[130px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-22">
          {/* Left Hero */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-cyan-400/35 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Made for Kids, School &amp; College Students (Ages 8 to 24+)
            </div>

            <h1 className="font-display text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-6xl">
              Learn <span className="neon-text-gradient">AI, Robotics &amp; IoT</span> by Building Real Projects!
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Whether you&apos;re a school student building your first smart robot or a college
              engineer mastering ROS2 &amp; NVIDIA Jetson, <strong className="text-white">Aibo8</strong>{" "}
              gives you fun hands-on labs, timed quizzes, mentor chat, and official certificates.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href="/courses"
                className="btn-cyber inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white sm:text-base"
              >
                Explore All Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/learn/esp32-smart-iot-sensors-to-cloud"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-cyan-400/50 hover:bg-white/10 sm:text-base"
              >
                <Play className="h-4 w-4 fill-cyan-400 text-cyan-400" />
                Start Free Student Lab
              </Link>
              <Link
                href="/bundles"
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/35 bg-amber-500/10 px-5 py-3.5 text-sm font-semibold text-amber-300 hover:bg-amber-500/20"
              >
                <Package className="h-4 w-4" />
                Save with Bundles
              </Link>
            </div>

            {/* Friendly Stats */}
            <div className="grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-6">
              <div>
                <div className="font-display text-2xl font-bold text-white sm:text-3xl">26,000+</div>
                <div className="text-xs text-slate-400 sm:text-sm">School &amp; College Learners</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-cyan-300 sm:text-3xl">100%</div>
                <div className="text-xs text-slate-400 sm:text-sm">Hands-On Labs &amp; Quizzes</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-indigo-300 sm:text-3xl">4.9/5</div>
                <div className="text-xs text-slate-400 sm:text-sm">Student &amp; Parent Rating</div>
              </div>
            </div>
          </div>

          {/* Right Student Lab Mission Card */}
          <div className="hidden lg:col-span-5 lg:flex lg:justify-end">
            <div className="glass-card w-full max-w-sm rounded-3xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.65)] space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono-code text-xs font-semibold text-cyan-300">
                    student-mission://esp32-bot
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                  Beginner Friendly
                </span>
              </div>

              <div className="space-y-2 rounded-xl bg-black/55 p-3.5 font-mono-code text-xs text-cyan-200/95">
                <div className="text-slate-400"># Mission 01: Smart Sensor Bot</div>
                <div>sensor.connect(&quot;ESP32-WiFi&quot;)</div>
                <div className="text-emerald-400">✓ Distance sensor online: 18cm</div>
                <div className="text-amber-300">★ Quiz Passed: 100% (+250 XP)</div>
                <div className="text-indigo-300">🏆 Official Certificate Unlocked!</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                  <div className="font-display text-base font-bold text-white">Razorpay &amp; PhonePe</div>
                  <div className="text-[10px] text-slate-400">Instant UPI Checkout</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                  <div className="font-display text-base font-bold text-cyan-300">1-on-1 Mentor</div>
                  <div className="text-[10px] text-slate-400">Built-In Doubt Chat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HARDWARE ECOSYSTEM STRIP */}
      <section className="border-b border-white/10 bg-[#070B18]/90 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-7 gap-y-2.5 px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Learn With Real Tech:
          </span>
          {hardwareEcosystem.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 font-mono-code text-xs font-medium text-slate-300"
            >
              <Zap className="h-3 w-3 text-cyan-400" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* AGE & LEARNING STAGE PATHWAYS (Kids -> School -> College) */}
      <section className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Guided By Age &amp; Skill Stage
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            Pick the Right Starting Track for You
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Structured step-by-step pathways designed for young school builders and university engineers alike.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {agePathways.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.title}
                href={p.href}
                className="glass-card glass-card-hover group flex flex-col rounded-3xl p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.accent} text-slate-950 shadow-lg`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-cyan-300">
                    {p.badge}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-2xl font-bold text-white group-hover:text-cyan-300">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{p.desc}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400">
                  Start this pathway <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3 CORE TECHNOLOGY TRACKS */}
      <section className="border-t border-white/10 bg-[#070B18]/50 py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Core Tech Domains
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                Explore by Category &amp; Sub-Category
              </h2>
            </div>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
            >
              <GitCompare className="h-4 w-4" /> Compare Courses Side-by-Side
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {categories.map((cat) => {
              const trackCount = courses.filter((c) => c.categorySlug === cat.slug).length;
              const Icon = cat.icon === "Bot" ? Bot : cat.icon === "Radio" ? Radio : Cpu;
              return (
                <Link
                  key={cat.id}
                  href={`/courses?track=${cat.slug}`}
                  className="glass-card glass-card-hover group relative overflow-hidden rounded-2xl"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090E1D] via-[#090E1D]/45 to-transparent" />
                    <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/35 bg-[#050814]/80 text-cyan-300 backdrop-blur-md">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-[#050814]/80 px-3 py-1 text-xs font-semibold text-slate-200 keep-white">
                      {trackCount} Courses
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300">
                      {cat.name}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{cat.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cat.subCategories.slice(0, 3).map((sub) => (
                        <span
                          key={sub.id}
                          className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-cyan-300"
                        >
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="border-y border-white/10 py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Hands-On Catalog
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                Popular Student Courses
              </h2>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:border-cyan-400/40"
            >
              Browse All ({courses.length}) <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <HomeCourseTabs courses={courses} />
        </div>
      </section>

      {/* COURSE BUNDLES VALUE PACKS */}
      <section className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              Student Value Packs
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Save Up to 50% with Course Bundles
            </h2>
          </div>
          <Link
            href="/bundles"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:underline"
          >
            View All Bundles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {bundles.map((b) => (
            <Link
              key={b.id}
              href="/bundles"
              className="glass-card glass-card-hover group flex flex-col overflow-hidden rounded-3xl sm:flex-row"
            >
              <img
                src={b.thumbnail}
                alt={b.title}
                className="h-48 w-full object-cover sm:h-auto sm:w-48"
              />
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-[11px] font-bold text-amber-300">
                    {b.badge}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold text-white group-hover:text-cyan-300">
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400">{b.tagline}</p>
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-3">
                  <span className="text-xs text-slate-400">{b.courseIds.length} Full Courses Included</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-xl font-bold text-emerald-400">${b.bundlePrice}</span>
                    <span className="text-xs text-slate-500 line-through">${b.regularTotal}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY STUDENTS & PARENTS LOVE AIBO8 */}
      <section className="border-t border-white/10 bg-[#070B18]/60 py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Complete Learning Experience
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Everything Students Need to Succeed
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Code2,
                title: "Step-by-Step Code Labs",
                desc: "Copy-ready Arduino, ESP32, Python, and ROS2 code with clear wiring explanations.",
              },
              {
                icon: CheckCircle2,
                title: "Timed Objective Exams",
                desc: "Interactive countdown quizzes with instant grading and passing thresholds for mastery.",
              },
              {
                icon: Layers,
                title: "Projects & Mentor Chat",
                desc: "Submit GitHub repos or hardware photos for grading and message instructors anytime.",
              },
              {
                icon: Award,
                title: "Official Certificates",
                desc: "Earn formal, verifiable Aibo8 diplomas for school portfolios, college resumes & LinkedIn.",
              },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="glass-card rounded-2xl p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">{feat.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-cyan-950/50 via-[#0B1120] to-indigo-950/60 p-8 sm:p-14">
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-300">
                <Sparkles className="h-4 w-4" /> Free Forever Starter Labs
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Ready to build your first robot or AI project today?
              </h2>
              <p className="mt-3 text-slate-300">
                Join thousands of school &amp; college makers learning AI, Robotics, and IoT with Aibo8.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="btn-cyber inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white"
              >
                Join Free Today <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                Sign In to Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
