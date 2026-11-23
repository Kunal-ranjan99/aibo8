"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, CheckCircle2, Edit3, Plus, Save, Ticket, Trash2 } from "lucide-react";
import { CouponData } from "@/lib/types";

export function CouponManagerAdmin({ coupons }: { coupons: CouponData[] }) {
  const router = useRouter();

  // Create form state
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENT" | "FLAT">("PERCENT");
  const [discountValue, setDiscountValue] = useState("20");
  const [active, setActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState("2027-03-31");
  const [statusMsg, setStatusMsg] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editType, setEditType] = useState<"PERCENT" | "FLAT">("PERCENT");
  const [editValue, setEditValue] = useState("20");
  const [editActive, setEditActive] = useState(true);
  const [editExpiresAt, setEditExpiresAt] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setStatusMsg("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_coupon",
        code,
        discountType,
        discountValue: Number(discountValue) || 10,
        active,
        expiresAt: expiresAt || null,
      }),
    });
    if (res.ok) {
      setCode("");
      setStatusMsg("Coupon created!");
      router.refresh();
    }
  }

  function startEdit(c: CouponData) {
    setEditingId(c.id);
    setEditCode(c.code);
    setEditType(c.discountType || "PERCENT");
    setEditValue(String(c.discountValue ?? c.discountPercent));
    setEditActive(c.active);
    setEditExpiresAt(c.expiresAt || "");
    setStatusMsg("");
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_coupon",
        couponId: editingId,
        code: editCode,
        discountType: editType,
        discountValue: Number(editValue) || 1,
        active: editActive,
        expiresAt: editExpiresAt || null,
      }),
    });
    if (res.ok) {
      setEditingId(null);
      setStatusMsg("Coupon updated!");
      router.refresh();
    }
  }

  async function toggleQuickActive(c: CouponData) {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_coupon",
        couponId: c.id,
        active: !c.active,
      }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon?")) return;
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_coupon", couponId: id }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Create Coupon Form */}
      <form onSubmit={handleCreate} className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
            <Ticket className="h-4 w-4 text-cyan-400" /> Create New Coupon
          </h3>
          {statusMsg && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> {statusMsg}
            </span>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-400">Coupon Code *</label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. SAVE500"
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 font-mono-code text-xs uppercase text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-400">Discount Type</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as "PERCENT" | "FLAT")}
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
            >
              <option value="PERCENT">Percentage (%)</option>
              <option value="FLAT">Flat Amount (₹)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-400">
              {discountType === "FLAT" ? "Flat Discount (₹)" : "Discount (%)"}
            </label>
            <input
              type="number"
              required
              min={1}
              max={discountType === "PERCENT" ? 100 : 100000}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-400">Active Till Date</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-400">Status</label>
            <select
              value={active ? "ACTIVE" : "INACTIVE"}
              onChange={(e) => setActive(e.target.value === "ACTIVE")}
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn-cyber inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Create Coupon
        </button>
      </form>

      {/* Coupon List + Inline Editor */}
      <div className="space-y-3">
        {coupons.map((cp) => {
          const isEditing = editingId === cp.id;
          const isExpired =
            cp.expiresAt && new Date(`${cp.expiresAt}T23:59:59`).getTime() < Date.now();

          return (
            <div key={cp.id} className="glass-card rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono-code text-base font-bold text-cyan-300">{cp.code}</span>
                  <span className="rounded-full bg-indigo-500/20 px-3 py-0.5 text-xs font-bold text-indigo-300">
                    {cp.discountType === "FLAT"
                      ? `₹${cp.discountValue} FLAT OFF`
                      : `${cp.discountValue ?? cp.discountPercent}% OFF`}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      !cp.active
                        ? "bg-slate-500/20 text-slate-400"
                        : isExpired
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {!cp.active ? "INACTIVE" : isExpired ? "EXPIRED" : "ACTIVE"}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                    {cp.expiresAt ? `Valid till ${cp.expiresAt}` : "No expiry"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleQuickActive(cp)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-400/50"
                  >
                    {cp.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => (isEditing ? setEditingId(null) : startEdit(cp))}
                    className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> {isEditing ? "Cancel" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cp.id)}
                    title="Delete Coupon"
                    className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:border-rose-400/50 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {isEditing && (
                <form
                  onSubmit={handleSaveEdit}
                  className="rounded-xl border border-cyan-400/25 bg-white/[0.03] p-4 space-y-3"
                >
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-slate-400">Code</label>
                      <input
                        required
                        value={editCode}
                        onChange={(e) => setEditCode(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 font-mono-code text-xs uppercase text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-slate-400">Type</label>
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value as "PERCENT" | "FLAT")}
                        className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
                      >
                        <option value="PERCENT">Percentage (%)</option>
                        <option value="FLAT">Flat Amount (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-slate-400">
                        {editType === "FLAT" ? "Flat (₹)" : "Percent (%)"}
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={editType === "PERCENT" ? 100 : 100000}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-slate-400">
                        Active Till Date
                      </label>
                      <input
                        type="date"
                        value={editExpiresAt}
                        onChange={(e) => setEditExpiresAt(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-slate-400">Status</label>
                      <select
                        value={editActive ? "ACTIVE" : "INACTIVE"}
                        onChange={(e) => setEditActive(e.target.value === "ACTIVE")}
                        className="w-full rounded-xl border border-white/10 bg-[#050814] px-3 py-2 text-xs text-white"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-cyber inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold text-white"
                  >
                    <Save className="h-3.5 w-3.5" /> Save Coupon Changes
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
