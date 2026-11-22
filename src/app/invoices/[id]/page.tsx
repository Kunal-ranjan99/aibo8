import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, FileText } from "lucide-react";
import { getInvoiceById } from "@/lib/lms-extras";
import { PrintCertButton } from "@/components/PrintCertButton";

export const dynamic = "force-dynamic";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inv = getInvoiceById(id);
  if (!inv) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href="/dashboard/student" className="text-sm font-semibold text-cyan-400 hover:underline">
          ← Go to My Courses
        </Link>
        <PrintCertButton />
      </div>

      {/* Printable Formal Invoice */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-900 shadow-2xl sm:p-12 print:shadow-none print:border-none">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="font-display text-2xl font-extrabold text-[#0F1E3D]">AIBO8 ACADEMY</div>
            <div className="text-xs text-slate-500">AI, Robotics &amp; IoT Education Platform</div>
            <div className="mt-1 text-xs text-slate-500">billing@aibo8.ai • GSTIN: 29AIBO80000A1Z5</div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> PAID RECEIPT
            </div>
            <div className="mt-2 font-mono-code text-sm font-bold text-slate-800">
              #{inv.invoiceNumber}
            </div>
            <div className="text-xs text-slate-500">
              {new Date(inv.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Billed To</div>
            <div className="mt-1 font-bold text-slate-900">{inv.userName}</div>
            <div className="text-xs text-slate-600">{inv.userEmail}</div>
          </div>
          <div className="sm:text-right">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Details</div>
            <div className="mt-1 font-semibold text-slate-900">Gateway: {inv.gateway}</div>
            <div className="font-mono-code text-xs text-slate-600">Txn ID: {inv.transactionId}</div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-4 py-4 font-semibold text-slate-900">{inv.itemTitle}</td>
                <td className="px-4 py-4 text-xs font-semibold text-slate-500">{inv.itemType}</td>
                <td className="px-4 py-4 text-right font-semibold text-slate-900">
                  {inv.currencySymbol}
                  {inv.subtotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>
                {inv.currencySymbol}
                {inv.subtotal.toFixed(2)}
              </span>
            </div>
            {inv.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Coupon Discount</span>
                <span>
                  -{inv.currencySymbol}
                  {inv.discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>GST / Tax (18%)</span>
              <span>
                {inv.currencySymbol}
                {inv.taxAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-extrabold text-slate-900">
              <span>Total Paid</span>
              <span>
                {inv.currencySymbol}
                {inv.totalPaid.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500">
          <FileText className="h-4 w-4 text-slate-400" />
          <span>Computer-generated receipt. Thank you for learning with Aibo8 Academy!</span>
        </div>
      </div>
    </div>
  );
}
