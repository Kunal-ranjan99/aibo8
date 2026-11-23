"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, KeyRound, Lock, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_code", email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not send reset code.");
      } else {
        setInfo(`${data.message} (Code: ${data.demoCode})`);
        setStep(2);
      }
    } finally {
      setLoading(false);
    }
  }

  async function confirmReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm_reset", email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed.");
      } else {
        setStep(3);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[78vh] max-w-md items-center px-4 py-12">
      <div className="glass-card w-full rounded-3xl p-8 space-y-5">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/15 text-cyan-300">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-white">Reset Password</h1>
          <p className="mt-1 text-xs text-slate-400">Recover access to your Aibo8 account</p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">
            {error}
          </div>
        )}
        {info && step === 2 && (
          <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2.5 text-xs text-cyan-200">
            {info}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={requestCode} className="space-y-4">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full rounded-xl border border-white/10 bg-[#050814] py-2.5 pl-10 pr-4 text-sm text-white"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-cyber w-full rounded-xl py-3 text-sm font-semibold text-white">
              {loading ? "Sending Code..." : "Send 6-Digit Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={confirmReset} className="space-y-4">
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-Digit Verification Code"
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 font-mono-code text-sm text-white"
            />
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password (min 6 chars)"
                className="w-full rounded-xl border border-white/10 bg-[#050814] py-2.5 pl-10 pr-4 text-sm text-white"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-cyber w-full rounded-xl py-3 text-sm font-semibold text-white">
              {loading ? "Updating..." : "Set New Password"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
            <p className="text-sm font-semibold text-white">Your password has been reset!</p>
            <Link href="/auth/login" className="btn-cyber inline-block rounded-xl px-6 py-2.5 text-sm font-semibold text-white">
              Sign In Now
            </Link>
          </div>
        )}

        <p className="text-center text-xs text-slate-400">
          <Link href="/auth/login" className="text-cyan-400 hover:underline">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
