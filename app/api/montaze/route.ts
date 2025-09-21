import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { currentUser } from "@/lib/currentUser";

// Walidacja payloadu
const createMontazSchema = z.object({
  klientImie: z.string().min(1),
  klientNazwisko: z.string().min(1),
  montazystaId: z.number(),
  uwagi: z.string().optional(),
});

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ADMIN widzi wszystkie montaże, MONTAZYSTA tylko swoje
    const montaze = await prisma.montaz.findMany({
      where: user.role === "MONTAZYSTA" ? { montazystaId: user.id } : undefined,
      include: {
        montazysta: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(montaze);
  } catch (error) {
    console.error("[GET] /api/montaze error:", error);
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
    const validated = createMontazSchema.parse(body);

    const newMontaz = await prisma.montaz.create({
      data: {
        klientImie: validated.klientImie,
        klientNazwisko: validated.klientNazwisko,
        montazystaId: validated.montazystaId,
        uwagi: validated.uwagi,
      },
      include: {
        montazysta: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(newMontaz, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.format() },
        { status: 400 }
      );
    }

    console.error("[POST] /api/montaze error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}