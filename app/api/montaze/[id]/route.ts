import { NextResponse } from "next/server";

// Tymczasowo wyłączone do czasu przebudowy modułu Montaży
export async function PUT() {
  return NextResponse.json({ error: "Montaże wyłączone (w przebudowie)" }, { status: 501 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Montaże wyłączone (w przebudowie)" }, { status: 501 });
}