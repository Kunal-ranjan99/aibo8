"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, Smartphone } from "lucide-react";

export function BundleCheckoutButton({
  bundleId,
  price,
  isLoggedIn,
}: {
  bundleId: string;
  price: number;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [gateway, setGateway] = useState<"RAZORPAY" | "PHONEPE">("RAZORPAY");
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "checkout",
          itemType: "BUNDLE",
          itemId: bundleId,
          gateway,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/invoices/${data.invoice.id}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setGateway("RAZORPAY")}
          className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition ${
            gateway === "RAZORPAY"
              ? "border-cyan-400 bg-cyan-500/15 text-cyan-200"
              : "border-white/10 bg-white/5 text-slate-300"
          }`}
        >
          <CreditCard className="h-3.5 w-3.5" /> Razorpay
        </button>
        <button
          type="button"
          onClick={() => setGateway("PHONEPE")}
          className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition ${
            gateway === "PHONEPE"
              ? "border-indigo-400 bg-indigo-500/15 text-indigo-200"
              : "border-white/10 bg-white/5 text-slate-300"
          }`}
        >
          <Smartphone className="h-3.5 w-3.5" /> PhonePe UPI
        </button>
      </div>
      <button
        onClick={handleBuy}
        disabled={loading}
        className="btn-cyber flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        <CheckCircle2 className="h-4 w-4" />
        {loading ? "Processing Payment..." : `Unlock Bundle (₹${price}) via ${gateway}`}
      </button>
    </div>
  );
}
