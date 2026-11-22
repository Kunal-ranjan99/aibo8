import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserWishlist, toggleUserWishlist } from "@/lib/lms-extras";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ wishlist: [] });
  return NextResponse.json({ wishlist: getUserWishlist(user.id) });
}

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Sign in to save wishlist." }, { status: 401 });
  const { courseId } = await req.json();
  const wishlist = toggleUserWishlist(user.id, courseId);
  return NextResponse.json({ wishlist });
}
