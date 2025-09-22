import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { currentUser } from "@/lib/currentUser";
import { createPomiarSchema } from "@/lib/validation";

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
            modelPanela: true,
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
    
    // Dla pomiarów - montażysta może dodawać własne
    // Dla montaży (przez admina) - tylko admin
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = createPomiarSchema.parse(body);

    // Jeśli montażysta dodaje pomiar - automatycznie przypisz do siebie
    const montazystaId = user.role === "MONTAZYSTA" ? user.id : validated.montazystaId;

    const newMontaz = await prisma.montaz.create({
      data: {
        klientImie: validated.klientImie,
        klientNazwisko: validated.klientNazwisko,
        montazystaId: montazystaId,
        czyKlientPotwierdza: validated.czyKlientPotwierdza,
        czyZmiana: validated.czyZmiana,
        adres: validated.adres,
        notatkaPrimepodloga: validated.notatkaPrimepodloga,
        pomiarM2: validated.pomiarM2,
        procentDocinki: validated.procentDocinki,
        terminMontazu: validated.terminMontazu,
        terminDostawy: validated.terminDostawy,
        dniPrzedMontazem: validated.dniPrzedMontazem,
        warunekWnoszenia: validated.warunekWnoszenia,
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