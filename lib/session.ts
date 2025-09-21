import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "session";
const SESSION_DAYS = 30;

export function generateToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString("base64url");
}
export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Tworzy sesję i USTAWIA cookie (dozwolone, bo będzie wywołane w Route Handlerze / Server Action).
 */
export async function createSession(userId: number) {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({ data: { userId, tokenHash, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return { token, expiresAt };
}

/**
 * Czyści cookie + usuwa sesję — UŻYWAJ tylko w Route Handlerach / Server Actions.
 */
export async function deleteSessionFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } }).catch(() => {});
  }
  cookieStore.set({ name: COOKIE_NAME, value: "", path: "/", expires: new Date(0) });
}

/**
 * Odczyt aktualnej sesji podczas renderu (Server Component) — BEZ modyfikowania cookies.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const s = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!s || s.expiresAt < new Date() || !s.user.isActive) {
    // UWAGA: nie modyfikuj cookie w trakcie renderu. Po prostu zwróć null.
    return null;
  }
  return s;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
