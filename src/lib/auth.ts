import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { UserSession } from "./types";

const COOKIE_NAME = "aibo8_session";
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aibo8-default-dev-secret-key-change-me"
);

export async function createSessionToken(user: UserSession): Promise<string> {
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function setSessionCookie(user: UserSession) {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: String(payload.id),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role as UserSession["role"],
    };
  } catch {
    return null;
  }
}
