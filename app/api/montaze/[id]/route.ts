import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { currentUser } from "@/lib/currentUser";

const updateMontazSchema = z.object({
  klientImie: z.string().min(1),
  klientNazwisko: z.string().min(1),
  montazystaId: z.number().optional(),
  status: z.enum(["NOWY", "W_TRAKCIE", "ZAKONCZONY"]).optional(),
  uwagi: z.string().optional(),
  // Nowe pola dla pomiarów
  czyKlientPotwierdza: z.boolean().optional(),
  czyZmiana: z.boolean().optional(),
  adres: z.string().optional(),
  notatkaPrimepodloga: z.string().optional(),
  pomiarM2: z.number().optional(),
  procentDocinki: z.number().min(5).max(20).optional(),
  terminMontazu: z.string().optional(),
  terminDostawy: z.string().optional(),
  dniPrzedMontazem: z.number().min(1).optional(),
  warunekWnoszenia: z.string().optional(),
  // Pola do śledzenia zmian
  czyZmianaAdresu: z.boolean().optional(),
  czyZmianaModelu: z.boolean().optional(),
  nowyModelPanela: z.string().optional(),
  historiaZmianModelu: z.string().optional(),
  notatkiMontazysty: z.string().optional(),
  // Pola potwierdzenia
  potwierdzaAdres: z.boolean().optional(),
  potwierdzaPanel: z.boolean().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const validated = updateMontazSchema.parse(body);

    // Sprawdź czy montaż istnieje i czy użytkownik ma uprawnienia
    const existingMontaz = await prisma.montaz.findUnique({
      where: { id },
    });

    if (!existingMontaz) {
      return NextResponse.json({ error: "Montaż not found" }, { status: 404 });
    }

    // ADMIN może edytować wszystko, MONTAZYSTA tylko swoje montaże
    if (user.role === "MONTAZYSTA" && existingMontaz.montazystaId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Przygotuj dane do aktualizacji
    const updateData: any = {
      klientImie: validated.klientImie,
      klientNazwisko: validated.klientNazwisko,
      uwagi: validated.uwagi,
      // Nowe pola
      czyKlientPotwierdza: validated.czyKlientPotwierdza,
      czyZmiana: validated.czyZmiana,
      adres: validated.adres,
      notatkaPrimepodloga: validated.notatkaPrimepodloga,
      pomiarM2: validated.pomiarM2,
      procentDocinki: validated.procentDocinki,
      terminMontazu: validated.terminMontazu ? new Date(validated.terminMontazu) : undefined,
      terminDostawy: validated.terminDostawy ? new Date(validated.terminDostawy) : undefined,
      dniPrzedMontazem: validated.dniPrzedMontazem,
      warunekWnoszenia: validated.warunekWnoszenia,
      // Pola do śledzenia zmian
      czyZmianaAdresu: validated.czyZmianaAdresu,
      czyZmianaModelu: validated.czyZmianaModelu,
      nowyModelPanela: validated.nowyModelPanela,
      historiaZmianModelu: validated.historiaZmianModelu,
      notatkiMontazysty: validated.notatkiMontazysty,
      // Pola potwierdzenia
      potwierdzaAdres: validated.potwierdzaAdres,
      potwierdzaPanel: validated.potwierdzaPanel,
    };

    // ADMIN może zmieniać montażystę i status
    if (user.role === "ADMIN") {
      if (validated.montazystaId) updateData.montazystaId = validated.montazystaId;
      if (validated.status) updateData.status = validated.status;
    }

    const updatedMontaz = await prisma.montaz.update({
      where: { id },
      data: updateData,
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

    if ((error as any)?.code === "P2025") {
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
    if ((error as any)?.code === "P2025") {
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