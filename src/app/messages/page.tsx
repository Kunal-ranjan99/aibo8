import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllUsersForAdmin } from "@/lib/store";
import { getUserMessages } from "@/lib/lms-extras";
import { MessagesClient } from "@/components/MessagesClient";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const user = await getSession();
  if (!user) redirect("/auth/login");

  const contacts = getAllUsersForAdmin();
  const messages = getUserMessages(user.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Direct Mentor Inbox
        </span>
        <h1 className="mt-1 font-display text-3xl font-bold text-white">
          Student ↔ Instructor Messaging
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Ask doubts about wiring, ROS2 errors, ESP32 kits, or project assignments directly.
        </p>
      </div>

      <MessagesClient me={user} contacts={contacts} initialMessages={messages} />
    </div>
  );
}
