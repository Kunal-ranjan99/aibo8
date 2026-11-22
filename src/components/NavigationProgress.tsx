"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Stop loader whenever route changes
  useEffect(() => {
    setLoading(false);
    setProgress(100);
    const t = setTimeout(() => setProgress(0), 220);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  // Listen to internal link clicks for immediate feedback
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank"
      ) {
        return;
      }
      try {
        const nextUrl = new URL(href, window.location.origin);
        if (nextUrl.origin !== window.location.origin) return;
        if (nextUrl.pathname === window.location.pathname && nextUrl.search === window.location.search) {
          return;
        }
        setLoading(true);
        setProgress(35);
      } catch {
        // ignore invalid URL
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  // Smooth incremental progress while waiting
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 90 ? 90 : p + Math.max(2, (90 - p) * 0.15)));
    }, 180);
    const safety = setTimeout(() => setLoading(false), 8000);
    return () => {
      clearInterval(interval);
      clearTimeout(safety);
    };
  }, [loading]);

  if (!loading && progress === 0) return null;

  return (
    <>
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-[3px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 shadow-[0_0_12px_rgba(0,240,255,0.85)] transition-all duration-200"
          style={{ width: `${progress}%`, opacity: loading ? 1 : 0 }}
        />
      </div>
      {loading && (
        <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-full border border-cyan-400/40 bg-[#070B18]/90 px-4 py-2 text-xs font-semibold text-cyan-300 shadow-xl backdrop-blur-md">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
          Loading...
        </div>
      )}
    </>
  );
}
