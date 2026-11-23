import { NextResponse } from "next/server";
import { getCertificateById } from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") || "").trim();
  if (!code) return NextResponse.json({ error: "Enter a credential code." }, { status: 400 });
  const cert = await getCertificateById(code);
  if (!cert) return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
  return NextResponse.json({ certificate: cert });
}
