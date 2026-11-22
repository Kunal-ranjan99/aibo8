"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Smartphone } from "lucide-react";

export function BundleCheckoutButton({
  bundleId,
  price,
  isLoggedIn,
  activeGateway = "RAZORPAY",
}: {
  bundleId: string;
  price: number;
  isLoggedIn: boolean;
  activeGateway?: "RAZORPAY" | "PHONEPE";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const label = activeGateway === "PHONEPE" ? "PhonePe UPI" : "Razorpay";

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
          gateway: activeGateway,
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
    <button
      onClick={handleBuy}
      disabled={loading}
      className="btn-cyber flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
    >
      {activeGateway === "PHONEPE" ? (
        <Smartphone className="h-4 w-4" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      {loading ? "Processing Payment..." : `Unlock Bundle (₹${price}) via ${label}`}
    </button>
  );
}
