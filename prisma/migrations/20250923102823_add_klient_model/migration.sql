-- AlterTable
ALTER TABLE "Montaz" ADD COLUMN "czyZmianaAdresu" BOOLEAN;
ALTER TABLE "Montaz" ADD COLUMN "czyZmianaModelu" BOOLEAN;
ALTER TABLE "Montaz" ADD COLUMN "historiaZmianModelu" TEXT;
ALTER TABLE "Montaz" ADD COLUMN "modelPanela" TEXT;
ALTER TABLE "Montaz" ADD COLUMN "notatkiMontazysty" TEXT;
ALTER TABLE "Montaz" ADD COLUMN "nowyModelPanela" TEXT;
ALTER TABLE "Montaz" ADD COLUMN "potwierdzaAdres" BOOLEAN;
ALTER TABLE "Montaz" ADD COLUMN "potwierdzaPanel" BOOLEAN;

-- CreateTable
CREATE TABLE "Klient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imie" TEXT NOT NULL,
    "nazwisko" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "miasto" TEXT NOT NULL,
    "adresFaktury" TEXT NOT NULL,
    "rodzajWspolpracy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
