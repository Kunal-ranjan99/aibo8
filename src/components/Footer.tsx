import Link from "next/link";
import { Bot, Cpu, Github, Globe, Mail, Radio } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#04060F]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#070B18]">
                  <Bot className="h-5 w-5 text-cyan-300" />
                </div>
              </div>
              <span className="font-display text-xl font-bold text-white">
                Aibo<span className="text-cyan-400">8</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Next-generation Learning Management System engineered for builders mastering Artificial
              Intelligence, Autonomous Robotics, and Connected IoT Hardware.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#top" className="rounded-lg border border-white/10 p-2 hover:border-cyan-400/40 hover:text-cyan-300">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#top" className="rounded-lg border border-white/10 p-2 hover:border-cyan-400/40 hover:text-cyan-300">
                <Github className="h-4 w-4" />
              </a>
              <a href="mailto:hello@aibo8.ai" className="rounded-lg border border-white/10 p-2 hover:border-cyan-400/40 hover:text-cyan-300">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Learning Tracks
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/courses?track=ai-ml" className="flex items-center gap-2 hover:text-cyan-300">
                  <Cpu className="h-3.5 w-3.5 text-cyan-400" /> AI & Edge Machine Learning
                </Link>
              </li>
              <li>
                <Link href="/courses?track=robotics" className="flex items-center gap-2 hover:text-cyan-300">
                  <Bot className="h-3.5 w-3.5 text-indigo-400" /> Autonomous Robotics & ROS2
                </Link>
              </li>
              <li>
                <Link href="/courses?track=iot-hardware" className="flex items-center gap-2 hover:text-cyan-300">
                  <Radio className="h-3.5 w-3.5 text-sky-400" /> IoT, ESP32 & Embedded Systems
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Platform Portals
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/courses" className="hover:text-cyan-300">Course Marketplace</Link>
              </li>
              <li>
                <Link href="/dashboard/student" className="hover:text-cyan-300">Student Dashboard</Link>
              </li>
              <li>
                <Link href="/dashboard/instructor" className="hover:text-cyan-300">Instructor Studio</Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="hover:text-cyan-300">Admin Control Panel</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Contact &amp; Support
            </h4>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              Need help choosing an AI, Robotics, or IoT track for your school or college?
            </p>
            <div className="mt-3 space-y-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-300">
              <div>Support: support@aibo8.ai</div>
              <div>Schools &amp; Colleges: edu@aibo8.ai</div>
              <div>Mon – Sat • 9:00 AM – 7:00 PM IST</div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Aibo8 Robotics &amp; AI Academy. All rights reserved.</p>
          <p>Empowering Young Innovators in AI, Robotics &amp; IoT • Made in India</p>
        </div>
      </div>
    </footer>
  );
}
