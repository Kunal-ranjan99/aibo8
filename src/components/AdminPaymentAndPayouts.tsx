"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  CreditCard,
  DollarSign,
  ExternalLink,
  FolderGit2,
  Save,
  Smartphone,
  Wallet,
} from "lucide-react";
import {
  AssignmentSubmissionData,
  InvoiceData,
  PaymentGatewaySettings,
  PayoutRequestData,
} from "@/lib/types";

/* 1. ADMIN PAYMENT GATEWAY SETTINGS (Razorpay + PhonePe + Commission) */
export function PaymentSettingsPanel({ initial }: { initial: PaymentGatewaySettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState<PaymentGatewaySettings>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_settings", settings }),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <DollarSign className="h-5 w-5 text-emerald-400" /> Revenue Split &amp; Currency
          </h3>
          {saved && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Payment settings saved!
            </span>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Admin Commission (%) — Instructor gets {100 - settings.adminCommissionPercent}%
            </label>
            <input
              type="number"
              min={0}
              max={80}
              value={settings.adminCommissionPercent}
              onChange={(e) =>
                setSettings((s) => ({ ...s, adminCommissionPercent: Number(e.target.value) || 0 }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">Primary Currency</label>
            <select
              value={settings.currency}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  currency: e.target.value as "INR" | "USD",
                  currencySymbol: e.target.value === "INR" ? "₹" : "$",
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-white"
            >
              <option value="INR">INR (₹ — Indian Rupee)</option>
              <option value="USD">USD ($ — US Dollar)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Razorpay Card */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
              <CreditCard className="h-5 w-5 text-cyan-400" /> Razorpay Gateway
            </h3>
            <label className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
              <input
                type="checkbox"
                checked={settings.razorpay.enabled}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    razorpay: { ...s.razorpay, enabled: e.target.checked },
                  }))
                }
              />
              Enabled
            </label>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Mode</label>
            <select
              value={settings.razorpay.mode}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  razorpay: { ...s.razorpay, mode: e.target.value as "test" | "live" },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
            >
              <option value="test">Test / Sandbox Mode</option>
              <option value="live">Live Production Mode</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Razorpay Key ID</label>
            <input
              value={settings.razorpay.keyId}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  razorpay: { ...s.razorpay, keyId: e.target.value },
                }))
              }
              placeholder="rzp_live_..."
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 font-mono-code text-xs text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Razorpay Key Secret</label>
            <input
              type="password"
              value={settings.razorpay.keySecret}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  razorpay: { ...s.razorpay, keySecret: e.target.value },
                }))
              }
              placeholder="Enter Razorpay Key Secret"
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 font-mono-code text-xs text-white"
            />
          </div>
        </div>

        {/* PhonePe Card */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
              <Smartphone className="h-5 w-5 text-indigo-400" /> PhonePe UPI Gateway
            </h3>
            <label className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <input
                type="checkbox"
                checked={settings.phonepe.enabled}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    phonepe: { ...s.phonepe, enabled: e.target.checked },
                  }))
                }
              />
              Enabled
            </label>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Environment</label>
            <select
              value={settings.phonepe.mode}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  phonepe: { ...s.phonepe, mode: e.target.value as "sandbox" | "production" },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
            >
              <option value="sandbox">Sandbox Mode</option>
              <option value="production">Production Live</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">PhonePe Merchant ID</label>
            <input
              value={settings.phonepe.merchantId}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  phonepe: { ...s.phonepe, merchantId: e.target.value },
                }))
              }
              placeholder="M123456789..."
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 font-mono-code text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Salt Key</label>
              <input
                type="password"
                value={settings.phonepe.saltKey}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    phonepe: { ...s.phonepe, saltKey: e.target.value },
                  }))
                }
                placeholder="PhonePe Salt Key"
                className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 font-mono-code text-xs text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Salt Index</label>
              <input
                value={settings.phonepe.saltIndex}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    phonepe: { ...s.phonepe, saltIndex: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 font-mono-code text-xs text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="btn-cyber inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save Payment Gateway Settings"}
      </button>
    </form>
  );
}

/* 2. ADMIN PAYOUTS & SALES REPORT */
export function PayoutsAndSalesAdminPanel({
  invoices,
  payouts,
}: {
  invoices: InvoiceData[];
  payouts: PayoutRequestData[];
}) {
  const router = useRouter();

  async function markPayout(payoutId: string, status: "PAID" | "REJECTED") {
    await fetch("/api/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_status", payoutId, status }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Instructor Payout Requests */}
      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="border-b border-white/10 px-5 py-4 font-display text-base font-bold text-white flex items-center gap-2">
          <Wallet className="h-5 w-5 text-cyan-400" /> Instructor Withdrawal Requests
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Instructor</th>
                <th className="px-5 py-3">Method &amp; Account</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3.5 font-semibold text-white">{p.instructorName}</td>
                  <td className="px-5 py-3.5 text-slate-300">
                    {p.method} • <span className="font-mono-code text-xs">{p.accountDetails}</span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-400">₹{p.amount}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        p.status === "PAID"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : p.status === "PENDING"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    {p.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => markPayout(p.id, "PAID")}
                          className="rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30"
                        >
                          Approve &amp; Pay
                        </button>
                        <button
                          onClick={() => markPayout(p.id, "REJECTED")}
                          className="rounded-lg bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-300"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Sales & Commission Split */}
      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="border-b border-white/10 px-5 py-4 font-display text-base font-bold text-white">
          Sales Report &amp; Commission Split
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Student &amp; Item</th>
                <th className="px-5 py-3">Gateway</th>
                <th className="px-5 py-3">Admin / Inst Split</th>
                <th className="px-5 py-3 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-5 py-3.5 font-mono-code text-xs text-cyan-300">{inv.invoiceNumber}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-white">{inv.itemTitle}</div>
                    <div className="text-xs text-slate-400">{inv.userName}</div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-bold text-slate-300">{inv.gateway}</td>
                  <td className="px-5 py-3.5 text-xs">
                    <span className="text-emerald-400 font-bold">Admin ₹{inv.adminShare}</span> •{" "}
                    <span className="text-indigo-300 font-bold">Inst ₹{inv.instructorShare}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/invoices/${inv.id}`} className="text-xs font-semibold text-cyan-400 hover:underline">
                      Receipt →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* 3. INSTRUCTOR SALES & PAYOUT REQUEST PANEL */
export function InstructorPayoutsPanel({
  sales,
  payouts,
}: {
  sales: InvoiceData[];
  payouts: PayoutRequestData[];
}) {
  const router = useRouter();
  const [amount, setAmount] = useState("150");
  const [method, setMethod] = useState("UPI");
  const [accountDetails, setAccountDetails] = useState("instructor@okaxis");
  const [msg, setMsg] = useState("");

  const totalEarned = sales.reduce((a, s) => a + s.instructorShare, 0);
  const totalPaid = payouts
    .filter((p) => p.status === "PAID")
    .reduce((a, p) => a + p.amount, 0);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "request", amount: Number(amount), method, accountDetails }),
    });
    if (res.ok) {
      setMsg("Withdrawal request submitted to Admin!");
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs uppercase text-slate-400">Net Instructor Earnings</div>
          <div className="mt-2 font-display text-3xl font-bold text-emerald-400">
            ₹{totalEarned.toFixed(2)}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs uppercase text-slate-400">Total Paid Out</div>
          <div className="mt-2 font-display text-3xl font-bold text-white">₹{totalPaid}</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs uppercase text-slate-400">Paid Course Sales</div>
          <div className="mt-2 font-display text-3xl font-bold text-cyan-300">{sales.length}</div>
        </div>
      </div>

      <form onSubmit={handleRequest} className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-white">Request Payout Withdrawal</h3>
          {msg && <span className="text-xs font-semibold text-emerald-400">{msg}</span>}
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <input
            type="number"
            min={10}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (₹)"
            className="rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2.5 text-sm text-white"
          />
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#050814] px-3 py-2.5 text-sm text-white"
          >
            <option value="UPI">UPI (PhonePe / GPay)</option>
            <option value="Bank IMPS">Bank Transfer (IMPS/NEFT)</option>
          </select>
          <input
            required
            value={accountDetails}
            onChange={(e) => setAccountDetails(e.target.value)}
            placeholder="UPI ID or Bank A/C"
            className="rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2.5 text-sm text-white"
          />
          <button type="submit" className="btn-cyber rounded-xl px-5 py-2.5 text-xs font-semibold text-white">
            Request Payout
          </button>
        </div>
      </form>

      <div className="glass-card rounded-2xl p-5 space-y-3">
        <h3 className="font-display text-base font-bold text-white">My Payout History</h3>
        {payouts.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs">
            <div>
              <span className="font-bold text-white">₹{p.amount}</span> via {p.method} ({p.accountDetails})
            </div>
            <span className="font-bold text-cyan-300">{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 4. PROJECT ASSIGNMENTS GRADING PANEL (Admin & Instructor) */
export function AssignmentGradingPanel({ assignments }: { assignments: AssignmentSubmissionData[] }) {
  const router = useRouter();
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});

  async function handleGrade(id: string) {
    await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "grade",
        assignmentId: id,
        grade: Number(grades[id] || 90),
        feedback: feedbacks[id] || "Great hardware & code work!",
      }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 font-display text-lg font-bold text-white">
        <FolderGit2 className="h-5 w-5 text-cyan-400" /> Student Hardware &amp; Code Submissions ({assignments.length})
      </div>
      {assignments.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-sm text-slate-400">
          No project submissions yet.
        </div>
      ) : (
        assignments.map((a) => (
          <div key={a.id} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-display text-base font-bold text-white">{a.projectTitle}</div>
                <div className="text-xs text-slate-400">
                  By <strong className="text-cyan-300">{a.userName}</strong> • {a.courseTitle}
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  a.status === "GRADED"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {a.status === "GRADED" ? `Graded: ${a.grade}/100` : "Needs Grading"}
              </span>
            </div>
            <p className="text-xs text-slate-300">{a.notes}</p>
            <div className="flex flex-wrap gap-3 text-xs">
              {a.repoUrl && (
                <a href={a.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan-400 hover:underline">
                  <ExternalLink className="h-3.5 w-3.5" /> GitHub / Code Link
                </a>
              )}
              {a.schematicUrl && (
                <a href={a.schematicUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-300 hover:underline">
                  <ExternalLink className="h-3.5 w-3.5" /> Circuit Schematic / Photo
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
              <input
                type="number"
                min={0}
                max={100}
                value={grades[a.id] ?? (a.grade ? String(a.grade) : "95")}
                onChange={(e) => setGrades((p) => ({ ...p, [a.id]: e.target.value }))}
                className="w-24 rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
                placeholder="Score"
              />
              <input
                value={feedbacks[a.id] ?? (a.feedback || "")}
                onChange={(e) => setFeedbacks((p) => ({ ...p, [a.id]: e.target.value }))}
                placeholder="Write constructive feedback for the student..."
                className="flex-1 min-w-[200px] rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
              />
              <button
                onClick={() => handleGrade(a.id)}
                className="btn-cyber rounded-xl px-4 py-2 text-xs font-semibold text-white"
              >
                Save Grade
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
