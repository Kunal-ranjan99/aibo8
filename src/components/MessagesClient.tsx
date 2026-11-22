"use client";

import { useState } from "react";
import { MessageSquare, Send, User } from "lucide-react";
import { MessageData, Role, UserSession } from "@/lib/types";

interface Contact {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export function MessagesClient({
  me,
  contacts,
  initialMessages,
}: {
  me: UserSession;
  contacts: Contact[];
  initialMessages: MessageData[];
}) {
  const otherContacts = contacts.filter((c) => c.id !== me.id);
  const [selected, setSelected] = useState<Contact | null>(otherContacts[0] || null);
  const [messages, setMessages] = useState<MessageData[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const thread = messages.filter(
    (m) =>
      selected &&
      ((m.senderId === me.id && m.receiverId === selected.id) ||
        (m.senderId === selected.id && m.receiverId === me.id))
  );

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !text.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selected.id,
          receiverName: selected.name,
          body: text,
        }),
      });
      if (res.ok) {
        const { message } = await res.json();
        setMessages((prev) => [...prev, message]);
        setText("");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="glass-card grid min-h-[540px] overflow-hidden rounded-2xl md:grid-cols-12">
      {/* Contacts */}
      <aside className="border-b border-white/10 bg-[#070B18]/60 md:col-span-4 md:border-b-0 md:border-r">
        <div className="border-b border-white/10 p-4 text-xs font-bold uppercase tracking-wider text-cyan-400">
          Instructors &amp; Students
        </div>
        <div className="divide-y divide-white/5">
          {otherContacts.map((c) => {
            const active = selected?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition ${
                  active ? "bg-cyan-500/15 border-l-2 border-cyan-400" : "hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 text-xs font-bold text-white">
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{c.name}</div>
                  <div className="text-[11px] font-semibold uppercase text-cyan-400">{c.role}</div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Chat Thread */}
      <div className="flex flex-col md:col-span-8">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
          <MessageSquare className="h-4 w-4 text-cyan-400" />
          <div>
            <div className="text-sm font-bold text-white">{selected?.name || "Select a contact"}</div>
            <div className="text-[11px] text-slate-400">{selected?.role}</div>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5 max-h-[380px]">
          {thread.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-xs text-slate-500 py-14">
              <User className="mb-2 h-6 w-6 text-slate-600" />
              No messages yet with {selected?.name}. Say hello or ask a hardware/course question!
            </div>
          ) : (
            thread.map((m) => {
              const mine = m.senderId === me.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      mine
                        ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white"
                        : "border border-white/10 bg-white/[0.05] text-slate-200"
                    }`}
                  >
                    <div className="mb-0.5 text-[10px] font-bold opacity-80">
                      {m.senderName} ({m.senderRole})
                    </div>
                    <div>{m.body}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 border-t border-white/10 p-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message ${selected?.name || ""}...`}
            className="flex-1 rounded-xl border border-white/10 bg-[#050814] px-4 py-2.5 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending}
            className="btn-cyber inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold text-white"
          >
            <Send className="h-4 w-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
