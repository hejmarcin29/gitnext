import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { ApiError, handleApiError, loginSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    // Walidacja payloadu
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Poprawne porównanie haseł z użyciem bcrypt
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new ApiError(401, "Invalid credentials");
    }

    await createSession(user.id);

    const to = user.role === "ADMIN" ? "/panel-admin" : "/panel-montazysty";
    return NextResponse.json({ ok: true, to });
  } catch (error) {
    return handleApiError(error);
  }
}
