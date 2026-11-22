"use client";

import { Printer } from "lucide-react";

export function PrintCertButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-cyber inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white print:hidden"
    >
      <Printer className="h-4 w-4" />
      Print / Save as PDF
    </button>
  );
}
