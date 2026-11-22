import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getCertificateById } from "@/lib/store";
import { PrintCertButton } from "@/components/PrintCertButton";

export const dynamic = "force-dynamic";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cert = await getCertificateById(id);
  if (!cert) notFound();

  const formattedDate = new Date(cert.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href="/dashboard/student" className="text-sm font-semibold text-cyan-400 hover:underline">
          ← Back to Student Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="h-4 w-4" /> Official Verified Credential
          </span>
          <PrintCertButton />
        </div>
      </div>

      {/* Realistic Formal Diploma Certificate (Ivory Parchment + Deep Navy + Embossed Gold) */}
      <div className="relative mx-auto aspect-[1.414/1] w-full overflow-hidden rounded-lg bg-[#FDFBF7] p-4 text-[#0F172A] shadow-[0_25px_90px_rgba(0,0,0,0.55)] sm:p-7 print:shadow-none print:rounded-none">
        {/* Subtle parchment watermark pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "radial-gradient(#1e3a8a 1px, transparent 1px), radial-gradient(#b45309 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            backgroundPosition: "0 0, 14px 14px",
          }}
        />

        {/* Outer Navy Frame */}
        <div className="relative flex h-full w-full flex-col justify-between border-[6px] border-[#0F1E3D] p-2 sm:p-3">
          {/* Inner Double Gold Border */}
          <div className="relative flex h-full w-full flex-col justify-between border-2 border-[#C59B27] px-6 py-6 sm:px-14 sm:py-10">
            {/* Corner Ornamental Filigree */}
            <div className="pointer-events-none absolute left-2 top-2 h-8 w-8 border-l-4 border-t-4 border-[#C59B27]" />
            <div className="pointer-events-none absolute right-2 top-2 h-8 w-8 border-r-4 border-t-4 border-[#C59B27]" />
            <div className="pointer-events-none absolute bottom-2 left-2 h-8 w-8 border-b-4 border-l-4 border-[#C59B27]" />
            <div className="pointer-events-none absolute bottom-2 right-2 h-8 w-8 border-b-4 border-r-4 border-[#C59B27]" />

            {/* Top Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#C59B27] bg-[#0F1E3D] text-white shadow-sm">
                  <span className="font-display text-lg font-extrabold tracking-tight text-[#38BDF8]">
                    A8
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-display text-xl font-extrabold tracking-wide text-[#0F1E3D]">
                    AIBO8 ACADEMY
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9A7418]">
                    Institute of AI, Robotics & IoT Engineering
                  </div>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Credential ID
                </div>
                <div className="font-mono-code text-xs font-bold text-[#0F1E3D]">
                  {cert.verifyCode}
                </div>
              </div>
            </div>

            {/* Center Proclamation */}
            <div className="my-auto py-4 text-center">
              <div className="text-xs font-bold uppercase tracking-[0.35em] text-[#9A7418]">
                Certificate of Achievement
              </div>
              <div className="mx-auto mt-2 h-[2px] w-28 bg-gradient-to-r from-transparent via-[#C59B27] to-transparent" />

              <p className="mt-5 font-serif text-sm italic text-slate-600 sm:text-base">
                This is to officially certify that
              </p>

              <h1
                className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#0F1E3D] sm:text-5xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {cert.userName}
              </h1>
              <div className="mx-auto mt-3 h-[1px] w-64 bg-slate-300" />

              <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-slate-700 sm:text-sm">
                has successfully completed all required engineering coursework, hands-on hardware
                &amp; code laboratories, and objective checkpoint examinations for the program:
              </p>

              <h2 className="mt-3 font-display text-xl font-extrabold text-[#0F1E3D] sm:text-2xl">
                {cert.courseTitle}
              </h2>

              <p className="mt-2 text-xs font-medium text-slate-500">
                Awarded on <strong className="text-[#0F1E3D]">{formattedDate}</strong>
              </p>
            </div>

            {/* Bottom Signatures + Embossed Gold Seal */}
            <div className="grid grid-cols-3 items-end gap-4 pt-2">
              {/* Instructor Signature */}
              <div className="text-center">
                <svg viewBox="0 0 180 42" className="mx-auto h-9 w-36 text-[#0F1E3D]" fill="none">
                  <path
                    d="M12 30 C28 8, 42 36, 58 22 C74 10, 86 32, 108 18 C126 10, 146 26, 168 16"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="mx-auto h-[1px] w-40 bg-[#0F1E3D]/40" />
                <div className="mt-1.5 text-xs font-bold text-[#0F1E3D]">{cert.instructorName}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">
                  Lead Course Instructor
                </div>
              </div>

              {/* Official Embossed Gold Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-double border-[#9A7418] bg-gradient-to-br from-[#FDE68A] via-[#D4AF37] to-[#9A7418] shadow-md sm:h-24 sm:w-24">
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full border border-[#0F1E3D]/30 bg-[#0F1E3D] text-center sm:h-16 sm:w-16">
                    <span className="font-display text-sm font-extrabold text-[#FDE68A]">AIBO8</span>
                    <span className="text-[7px] font-bold uppercase tracking-widest text-cyan-300">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>

              {/* Director Signature */}
              <div className="text-center">
                <svg viewBox="0 0 180 42" className="mx-auto h-9 w-36 text-[#0F1E3D]" fill="none">
                  <path
                    d="M16 26 C36 6, 48 34, 72 16 C92 4, 108 32, 134 20 C148 14, 158 24, 168 18"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="mx-auto h-[1px] w-40 bg-[#0F1E3D]/40" />
                <div className="mt-1.5 text-xs font-bold text-[#0F1E3D]">Aarav Mehta</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">
                  Director, Aibo8 Academy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Footnote */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 print:hidden">
        <span>
          Verify online at <strong className="font-mono-code text-cyan-300">/certificates/{cert.verifyCode}</strong>
        </span>
        <span>Tip: Use landscape orientation in the print dialog for a full-bleed PDF diploma.</span>
      </div>
    </div>
  );
}
