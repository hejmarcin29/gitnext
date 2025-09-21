import { NextResponse } from "next/server";
import { deleteSessionFromCookie } from "@/lib/session";

export async function POST() {
  await deleteSessionFromCookie();
  return NextResponse.json({ ok: true });
}
