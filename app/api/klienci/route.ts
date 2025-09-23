import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/currentUser";
import { z } from "zod";
import { createKlientSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const klienci = await prisma.klient.findMany({
      select: {
        id: true,
        imie: true,
        nazwisko: true,
        telefon: true,
        miasto: true,
        adresFaktury: true,
        rodzajWspolpracy: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(klienci);
  } catch (error) {
    console.error("[GET] /api/klienci error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createKlientSchema.parse(body);

    const created = await prisma.klient.create({
      data: {
        imie: data.imie,
        nazwisko: data.nazwisko,
        telefon: data.telefon,
        miasto: data.miasto,
        adresFaktury: data.adresFaktury,
        rodzajWspolpracy: data.rodzajWspolpracy,
      },
      select: {
        id: true,
        imie: true,
        nazwisko: true,
        telefon: true,
        miasto: true,
        adresFaktury: true,
        rodzajWspolpracy: true,
        createdAt: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.format() },
        { status: 400 }
      );
    }
    console.error("[POST] /api/klienci error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}