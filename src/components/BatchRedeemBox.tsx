"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, School } from "lucide-react";

export function BatchRedeemBox({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    setMsg("");
    setErr("");
    try {
      const res = await fetch("/api/v3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "redeem_batch", batchCode: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Invalid batch code.");
      } else {
        setMsg(`Enrolled via ${data.batch.institutionName} into ${data.batch.courseTitle}!`);
        setCode("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleRedeem} className="glass-card rounded-2xl p-6 space-y-3">
      <div className="flex items-center gap-2 font-display text-base font-bold text-white">
        <School className="h-5 w-5 text-cyan-400" /> School / College Batch Code
      </div>
      <p className="text-xs text-slate-400">
        Have an institutional batch code from your school or college robotics club? Redeem it for instant free seat access!
      </p>
      <div className="flex gap-2">
        <input
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. DPS-ROBO-2026"
          className="flex-1 rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2.5 font-mono-code text-xs uppercase text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-cyber rounded-xl px-5 py-2.5 text-xs font-semibold text-white"
        >
          {loading ? "Checking..." : "Redeem Seat"}
        </button>
      </div>
      {msg && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="h-4 w-4" /> {msg}
        </p>
      )}
      {err && <p className="text-xs font-semibold text-rose-400">{err}</p>}
    </form>
  );
}
