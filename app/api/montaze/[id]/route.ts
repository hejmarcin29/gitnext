import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { currentUser } from "@/lib/currentUser";

const updateMontazSchema = z.object({
  klientImie: z.string().min(1),
  klientNazwisko: z.string().min(1),
  montazystaId: z.number(),
  status: z.enum(["NOWY", "W_TRAKCIE", "ZAKONCZONY"]),
  uwagi: z.string().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const validated = updateMontazSchema.parse(body);

    const updatedMontaz = await prisma.montaz.update({
      where: { id },
      data: {
        klientImie: validated.klientImie,
        klientNazwisko: validated.klientNazwisko,
        montazystaId: validated.montazystaId,
        status: validated.status,
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

    return NextResponse.json(updatedMontaz);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.format() },
        { status: 400 }
      );
    }

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Montaż not found" },
        { status: 404 }
      );
    }

    console.error("[PUT] /api/montaze/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.montaz.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Montaż not found" },
        { status: 404 }
      );
    }

    console.error("[DELETE] /api/montaze/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}