import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { currentUser } from "@/lib/currentUser";
import { createUserSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { montaze: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[GET] /api/users error:", error);
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
    const validated = createUserSchema.parse(body);

    // Zwykłe hasło bez hasha
    const passwordHash = validated.password;

    const newUser = await prisma.user.create({
      data: {
        email: validated.email,
        passwordHash,
        role: validated.role,
        telefon: validated.telefon,
        adres: validated.adres,
        modelPanela: validated.modelPanela,
        notatka: validated.notatka,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        telefon: true,
        adres: true,
        modelPanela: true,
        notatka: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.format() },
        { status: 400 }
      );
    }

    // Obsługa duplikatu email
    if ((error as any)?.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    console.error("[POST] /api/users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}