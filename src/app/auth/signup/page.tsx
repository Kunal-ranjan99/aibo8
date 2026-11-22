"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, Lock, Mail, Sparkles, User } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create account.");
        return;
      }
      router.push(role === "INSTRUCTOR" ? "/dashboard/instructor" : "/dashboard/student");
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
          <h1 className="mt-4 font-display text-2xl font-bold text-white">Join Aibo8</h1>
          <p className="mt-1 text-sm text-slate-400">Start mastering AI, Robotics & IoT today</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {(["STUDENT", "INSTRUCTOR"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-xl border py-2.5 text-xs font-semibold transition ${
                  role === r
                    ? "border-cyan-400 bg-cyan-500/15 text-cyan-200"
                    : "border-white/10 bg-[#050814] text-slate-400 hover:text-white"
                }`}
              >
                {r === "STUDENT" ? "I'm a Student" : "I'm an Instructor"}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">Full Name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full rounded-xl border border-white/10 bg-[#050814] py-2.5 pl-10 pr-4 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@university.edu"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full rounded-xl border border-white/10 bg-[#050814] py-2.5 pl-10 pr-4 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-cyber flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Creating account..." : "Create Free Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-cyan-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
