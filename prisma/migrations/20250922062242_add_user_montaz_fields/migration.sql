-- AlterTable
ALTER TABLE "Montaz" ADD COLUMN "adres" TEXT;
ALTER TABLE "Montaz" ADD COLUMN "czyKlientPotwierdza" BOOLEAN;
ALTER TABLE "Montaz" ADD COLUMN "czyZmiana" BOOLEAN;
ALTER TABLE "Montaz" ADD COLUMN "dniPrzedMontazem" INTEGER;
ALTER TABLE "Montaz" ADD COLUMN "notatkaPrimepodloga" TEXT;
ALTER TABLE "Montaz" ADD COLUMN "pomiarM2" REAL;
ALTER TABLE "Montaz" ADD COLUMN "procentDocinki" INTEGER;
ALTER TABLE "Montaz" ADD COLUMN "terminDostawy" DATETIME;
ALTER TABLE "Montaz" ADD COLUMN "terminMontazu" DATETIME;
ALTER TABLE "Montaz" ADD COLUMN "warunekWnoszenia" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "adres" TEXT;
ALTER TABLE "User" ADD COLUMN "modelPanela" TEXT;
ALTER TABLE "User" ADD COLUMN "notatka" TEXT;
ALTER TABLE "User" ADD COLUMN "telefon" TEXT;
