import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { currentUser } from "@/lib/currentUser";

const updateMontazSchema = z.object({
  klientImie: z.string().min(1).optional(),
  klientNazwisko: z.string().min(1).optional(),
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
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

    // Przygotuj dane do aktualizacji - tylko pola które zostały przesłane
    const updateData: any = {};
    
    // Dodaj tylko pola które mają wartości (nie są undefined)
    if (validated.klientImie !== undefined) updateData.klientImie = validated.klientImie;
    if (validated.klientNazwisko !== undefined) updateData.klientNazwisko = validated.klientNazwisko;
    if (validated.uwagi !== undefined) updateData.uwagi = validated.uwagi;
    if (validated.czyKlientPotwierdza !== undefined) updateData.czyKlientPotwierdza = validated.czyKlientPotwierdza;
    if (validated.czyZmiana !== undefined) updateData.czyZmiana = validated.czyZmiana;
    if (validated.adres !== undefined) updateData.adres = validated.adres;
    if (validated.notatkaPrimepodloga !== undefined) updateData.notatkaPrimepodloga = validated.notatkaPrimepodloga;
    if (validated.pomiarM2 !== undefined) updateData.pomiarM2 = validated.pomiarM2;
    if (validated.procentDocinki !== undefined) updateData.procentDocinki = validated.procentDocinki;
    if (validated.terminMontazu !== undefined) updateData.terminMontazu = new Date(validated.terminMontazu);
    if (validated.terminDostawy !== undefined) updateData.terminDostawy = new Date(validated.terminDostawy);
    if (validated.dniPrzedMontazem !== undefined) updateData.dniPrzedMontazem = validated.dniPrzedMontazem;
    if (validated.warunekWnoszenia !== undefined) updateData.warunekWnoszenia = validated.warunekWnoszenia;
    if (validated.czyZmianaAdresu !== undefined) updateData.czyZmianaAdresu = validated.czyZmianaAdresu;
    if (validated.czyZmianaModelu !== undefined) updateData.czyZmianaModelu = validated.czyZmianaModelu;
    if (validated.nowyModelPanela !== undefined) updateData.nowyModelPanela = validated.nowyModelPanela;
    if (validated.historiaZmianModelu !== undefined) updateData.historiaZmianModelu = validated.historiaZmianModelu;
    if (validated.notatkiMontazysty !== undefined) updateData.notatkiMontazysty = validated.notatkiMontazysty;
    if (validated.potwierdzaAdres !== undefined) updateData.potwierdzaAdres = validated.potwierdzaAdres;
    if (validated.potwierdzaPanel !== undefined) updateData.potwierdzaPanel = validated.potwierdzaPanel;

    // ADMIN może zmieniać montażystę i status
    if (user.role === "ADMIN") {
      if (validated.montazystaId !== undefined) updateData.montazystaId = validated.montazystaId;
      if (validated.status !== undefined) updateData.status = validated.status;
    }
    
    // MONTAŻYSTA może zmieniać status tylko swojego montażu
    if (user.role === "MONTAZYSTA" && validated.status !== undefined) {
      updateData.status = validated.status;
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
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