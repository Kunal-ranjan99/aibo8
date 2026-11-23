"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, CheckCircle2, Search, ShieldCheck, XCircle } from "lucide-react";
import { CertificateData } from "@/lib/types";

export default function VerifyCertificatePage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cert, setCert] = useState<CertificateData | null>(null);
  const [error, setError] = useState("");

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setCert(null);
    try {
      const res = await fetch(`/api/verify?code=${encodeURIComponent(code.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No certificate matches this Credential ID.");
      } else {
        setCert(data.certificate);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/15 text-cyan-300">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Verify Aibo8 Certificate
        </h1>
        <p className="text-sm text-slate-400">
          Schools, colleges, and recruiters can verify the authenticity of any official Aibo8
          diploma using its Credential ID (e.g., <code className="font-mono-code text-cyan-300">AIBO8-IOT-2026-9X4K</code>).
        </p>
      </div>

      <form onSubmit={handleVerify} className="glass-card flex flex-col gap-3 rounded-2xl p-5 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Credential ID (e.g. AIBO8-IOT-2026-9X4K)"
            className="w-full rounded-xl border border-white/10 bg-[#050814] py-3 pl-10 pr-4 font-mono-code text-sm uppercase text-white focus:border-cyan-400/60 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-cyber rounded-xl px-7 py-3 text-sm font-semibold text-white"
        >
          {loading ? "Verifying..." : "Verify Now"}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5 text-sm text-rose-300">
          <XCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {cert && (
        <div className="glass-card rounded-3xl border border-emerald-400/40 p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3.5 py-1 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Authentic Verified Credential
            </span>
            <span className="font-mono-code text-xs font-bold text-cyan-300">{cert.verifyCode}</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <div className="text-xs uppercase text-slate-400">Student Name</div>
              <div className="mt-1 font-display text-xl font-bold text-white">{cert.userName}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-slate-400">Issued Date</div>
              <div className="mt-1 font-semibold text-white">
                {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs uppercase text-slate-400">Completed Program</div>
              <div className="mt-1 font-display text-lg font-bold text-cyan-300">{cert.courseTitle}</div>
              <div className="text-xs text-slate-400">Lead Instructor: {cert.instructorName}</div>
            </div>
          </div>

          <Link
            href={`/certificates/${cert.id}`}
            className="btn-cyber inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white"
          >
            <Award className="h-4 w-4" /> View Official Diploma
          </Link>
        </div>
      )}
    </div>
  );
}
