"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { NotificationItem } from "@/lib/v3-features";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    fetch("/api/v3")
      .then((r) => r.json())
      .then((d) => setItems(d.notifications || []))
      .catch(() => {});
  }, []);

  const unread = items.filter((n) => !n.read).length;

  async function markAllRead() {
    await fetch("/api/v3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_notifications_read" }),
    });
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Notifications"
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-300"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="glass-card absolute right-0 top-12 z-50 w-80 rounded-2xl p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Notifications ({unread})
            </span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-cyan-300"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark read
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-500">All caught up!</p>
            ) : (
              items.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || "/community"}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl border p-3 text-xs transition ${
                    n.read
                      ? "border-white/5 bg-white/[0.02] text-slate-400"
                      : "border-cyan-400/30 bg-cyan-500/10 text-white"
                  }`}
                >
                  <div className="font-bold">{n.title}</div>
                  <div className="mt-0.5 text-[11px] opacity-85">{n.body}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
