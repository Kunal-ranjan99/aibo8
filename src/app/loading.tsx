import { Bot, Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4 px-4">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 p-[1px] shadow-[0_0_32px_rgba(0,240,255,0.45)]">
        <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#070B18]">
          <Bot className="h-7 w-7 text-cyan-300 animate-pulse" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading Aibo8 Workspace...
      </div>
    </div>
  );
}
