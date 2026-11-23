"use client";

import { useEffect, useState } from "react";
import { Bot, Calendar, CheckCircle2, Cpu, ExternalLink, Package, Send, Sparkles, Video } from "lucide-react";
import { HardwareBomItem, LiveClassItem } from "@/lib/v3-features";

export function CourseExtrasTabs({
  courseId,
  courseTitle,
  isLoggedIn,
}: {
  courseId: string;
  courseTitle: string;
  isLoggedIn: boolean;
}) {
  const [subTab, setSubTab] = useState<"ai" | "bom" | "live">("ai");
  const [bom, setBom] = useState<HardwareBomItem[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClassItem[]>([]);

  // Kit Order State
  const [address, setAddress] = useState("");
  const [kitOrdered, setKitOrdered] = useState(false);

  // AI Study Buddy State
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiChat, setAiChat] = useState<{ role: "user" | "bot"; text: string }[]>([
    {
      role: "bot",
      text: `Hi! I'm your Aibo8 AI Study Buddy for "${courseTitle}". Ask me to explain any concept, debug Arduino/ESP32/Python/ROS2 errors, or check your wiring!`,
    },
  ]);

  useEffect(() => {
    fetch(`/api/v3?courseId=${encodeURIComponent(courseId)}`)
      .then((r) => r.json())
      .then((d) => {
        setBom(d.hardwareBom || []);
        setLiveClasses(d.liveClasses || []);
      })
      .catch(() => {});
  }, [courseId]);

  const totalKitInr = bom.reduce((a, x) => a + x.estPriceInr, 0);

  async function askAi(e: React.FormEvent) {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const prompt = aiInput.trim();
    setAiChat((prev) => [...prev, { role: "user", text: prompt }]);
    setAiInput("");
    setAiLoading(true);
    try {
      const res = await fetch("/api/v3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ai_tutor", prompt, courseTitle }),
      });
      const data = await res.json();
      setAiChat((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "Try breaking the problem into smaller hardware/code checks." },
      ]);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleKitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim() || !isLoggedIn) return;
    const res = await fetch("/api/v3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "order_kit",
        courseId,
        courseTitle,
        totalInr: totalKitInr,
        address,
      }),
    });
    if (res.ok) {
      setKitOrdered(true);
      setAddress("");
    }
  }

  return (
    <div className="glass-card rounded-2xl p-6 space-y-5">
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setSubTab("ai")}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
            subTab === "ai"
              ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white"
              : "bg-white/5 text-slate-300 hover:text-white"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" /> AI Study Buddy
        </button>
        <button
          onClick={() => setSubTab("bom")}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
            subTab === "bom"
              ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white"
              : "bg-white/5 text-slate-300 hover:text-white"
          }`}
        >
          <Cpu className="h-3.5 w-3.5" /> Hardware Kit / BOM ({bom.length})
        </button>
        <button
          onClick={() => setSubTab("live")}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
            subTab === "live"
              ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white"
              : "bg-white/5 text-slate-300 hover:text-white"
          }`}
        >
          <Video className="h-3.5 w-3.5" /> Live Classes ({liveClasses.length})
        </button>
      </div>

      {/* AI STUDY BUDDY */}
      {subTab === "ai" && (
        <div className="space-y-3">
          <div className="max-h-60 space-y-2.5 overflow-y-auto rounded-xl border border-white/10 bg-[#050814]/80 p-4">
            {aiChat.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-cyan-500/20 text-cyan-100 border border-cyan-400/30"
                      : "bg-white/[0.05] text-slate-200 border border-white/10"
                  }`}
                >
                  {m.role === "bot" && <Bot className="mb-1 h-3.5 w-3.5 text-cyan-400" />}
                  {m.text}
                </div>
              </div>
            ))}
            {aiLoading && <div className="text-xs text-cyan-300 animate-pulse">Thinking...</div>}
          </div>
          <form onSubmit={askAi} className="flex gap-2">
            <input
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask AI Buddy: e.g., Why is my ESP32 Wi-Fi or ROS2 /scan not working?"
              className="flex-1 rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
            />
            <button type="submit" disabled={aiLoading} className="btn-cyber inline-flex items-center gap-1 rounded-xl px-4 py-2 text-xs font-semibold text-white">
              <Send className="h-3.5 w-3.5" /> Ask
            </button>
          </form>
        </div>
      )}

      {/* HARDWARE KIT / BOM */}
      {subTab === "bom" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/[0.03] uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-2.5">Component</th>
                  <th className="px-4 py-2.5">Qty</th>
                  <th className="px-4 py-2.5">Notes</th>
                  <th className="px-4 py-2.5 text-right">Est. Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bom.map((item) => (
                  <tr key={item.name}>
                    <td className="px-4 py-2.5 font-semibold text-white">{item.name}</td>
                    <td className="px-4 py-2.5 text-cyan-300">{item.qty}</td>
                    <td className="px-4 py-2.5 text-slate-400">{item.note}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-emerald-400">
                      ₹{item.estPriceInr.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {kitOrdered ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/15 p-3.5 text-xs font-semibold text-emerald-300">
              <CheckCircle2 className="h-4 w-4" /> Aibo8 Hardware Kit order requested! Our team will contact you for dispatch.
            </div>
          ) : (
            <form onSubmit={handleKitOrder} className="flex flex-wrap items-center gap-2">
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter shipping address / phone to request Aibo8 Hardware Kit..."
                className="flex-1 min-w-[220px] rounded-xl border border-white/10 bg-[#050814] px-3.5 py-2 text-xs text-white"
              />
              <button
                type="submit"
                disabled={!isLoggedIn}
                className="btn-cyber inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                <Package className="h-3.5 w-3.5" /> Order Full Kit (₹{totalKitInr.toLocaleString("en-IN")})
              </button>
            </form>
          )}
        </div>
      )}

      {/* LIVE CLASSES */}
      {subTab === "live" && (
        <div className="space-y-3">
          {liveClasses.length === 0 ? (
            <p className="text-xs text-slate-400">
              No live workshops scheduled for this course yet. Check the Community Hub for all upcoming sessions!
            </p>
          ) : (
            liveClasses.map((lc) => (
              <div key={lc.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <div className="text-xs font-bold text-cyan-300">{lc.platform} • {lc.durationMin}m</div>
                  <div className="font-display font-bold text-white">{lc.title}</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {new Date(lc.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </div>
                </div>
                <a
                  href={lc.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-cyber inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white"
                >
                  Join Live <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
