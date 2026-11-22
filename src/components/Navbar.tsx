"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bot, Cpu, LayoutDashboard, LogOut, Menu, Search, Sparkles, X } from "lucide-react";
import { UserSession } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar({ user }: { user: UserSession | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/dashboard/admin"
      : user?.role === "INSTRUCTOR"
      ? "/dashboard/instructor"
      : "/dashboard/student";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/courses?q=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
  }

  const navLinks = [
    { href: "/courses", label: "Courses" },
    { href: "/bundles", label: "Bundles" },
    { href: "/compare", label: "Compare" },
    ...(user ? [{ href: "/messages", label: "Inbox" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050814]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 p-[1px] shadow-[0_0_24px_rgba(0,240,255,0.45)]">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#070B18]">
              <Bot className="h-5 w-5 text-cyan-300 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Aibo<span className="text-cyan-400">8</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-300/75">
              AI • Robotics • IoT
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors xl:px-3.5 ${
                  active
                    ? "bg-cyan-500/15 text-cyan-300"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Search + Auth */}
        <div className="hidden shrink-0 items-center gap-2.5 md:flex">
          <form onSubmit={handleSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ROS2, ESP32, Jetson..."
              className="w-44 rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 xl:w-60"
            />
          </form>

          <ThemeToggle />

          {user ? (
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={dashboardHref}
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span>{user.role === "ADMIN" ? "Admin" : user.role === "INSTRUCTOR" ? "Studio" : "Dashboard"}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-rose-400/40 hover:text-rose-300"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/auth/login"
                className="whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="btn-cyber flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold text-white"
              >
                <Sparkles className="h-4 w-4 shrink-0" />
                Start Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#070B18] px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AI, Robotics, IoT..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-400"
            />
          </form>
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
            <ThemeToggle />

          {user ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className="btn-cyber flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white"
                >
                  <Cpu className="h-4 w-4" />
                  Open {user.role} Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-white/10 py-2.5 text-sm font-medium text-slate-300"
                >
                  Sign Out ({user.name})
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-white/10 py-2.5 text-center text-sm font-medium text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  className="btn-cyber rounded-xl py-2.5 text-center text-sm font-semibold text-white"
                >
                  Start Learning Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
