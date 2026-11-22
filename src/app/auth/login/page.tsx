"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, Lock, Mail, ShieldCheck, Sparkles, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitLogin(eEmail: string, ePassword: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: eEmail, password: ePassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }
      const role = data.user?.role;
      const dest =
        role === "ADMIN"
          ? "/dashboard/admin"
          : role === "INSTRUCTOR"
          ? "/dashboard/instructor"
          : "/dashboard/student";
      router.push(dest);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <div className="glass-card w-full rounded-3xl p-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#070B18]">
              <Bot className="h-6 w-6 text-cyan-300" />
            </div>
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-white">Welcome back to Aibo8</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to access your labs, courses & studio</p>
        </div>

        {/* 1-Click Demo Logins */}
        <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.06] p-4">
          <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" /> 1-Click Instant Demo Access
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => submitLogin("student@aibo8.ai", "student123")}
              className="rounded-xl border border-white/10 bg-[#050814] py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-300"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => submitLogin("elena@aibo8.ai", "instructor123")}
              className="rounded-xl border border-white/10 bg-[#050814] py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-300"
            >
              Instructor
            </button>
            <button
              type="button"
              onClick={() => submitLogin("admin@aibo8.ai", "admin123")}
              className="rounded-xl border border-white/10 bg-[#050814] py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-300"
            >
              Admin
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitLogin(email, password);
          }}
          className="mt-6 space-y-4"
        >
          {error && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@aibo8.ai"
                className="w-full rounded-xl border border-white/10 bg-[#050814] py-2.5 pl-10 pr-4 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-[#050814] py-2.5 pl-10 pr-4 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-cyber flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            <UserCheck className="h-4 w-4" />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          New to Aibo8?{" "}
          <Link href="/auth/signup" className="font-semibold text-cyan-400 hover:underline">
            Create a free account
          </Link>
        </p>
        <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-500/70" /> Secured with HTTP-only JWT sessions
        </div>
      </div>
    </div>
  );
}
