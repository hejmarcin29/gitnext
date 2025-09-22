import { NextResponse } from 'next/server';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Schema dla tworzenia użytkowników z nowymi polami
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "MONTAZYSTA"]),
  telefon: z.string().optional(),
  adres: z.string().optional(),
  modelPanela: z.string().optional(),
  notatka: z.string().optional(),
});

// Schema dla tworzenia pomiarów/montaży z nowymi polami
export const createPomiarSchema = z.object({
  klientImie: z.string().min(1),
  klientNazwisko: z.string().min(1),
  montazystaId: z.number(),
  czyKlientPotwierdza: z.boolean().optional(),
  czyZmiana: z.boolean().optional(),
  adres: z.string().optional(),
  notatkaPrimepodloga: z.string().optional(),
  pomiarM2: z.number().positive().optional(),
  procentDocinki: z.number().min(5).max(20).optional(),
  terminMontazu: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  terminDostawy: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  dniPrzedMontazem: z.number().positive().optional(),
  warunekWnoszenia: z.string().optional(),
  uwagi: z.string().optional(),
});

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation error', details: error.format() },
      { status: 400 }
    );
  }
  
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: 'Server error' },
    { status: 500 }
  );
}