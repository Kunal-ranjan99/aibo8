"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("aibo8_theme") as "dark" | "light") || "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("light", saved === "light");
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("aibo8_theme", next);
    document.documentElement.classList.toggle("light", next === "light");
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} theme`}
      aria-label="Toggle Dark or Light Theme"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-300"
    >
      {theme === "dark" ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-indigo-600" />}
    </button>
  );
}
