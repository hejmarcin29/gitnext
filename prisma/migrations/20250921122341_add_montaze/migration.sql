-- CreateTable
CREATE TABLE "Montaz" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "klientImie" TEXT NOT NULL,
    "klientNazwisko" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOWY',
    "uwagi" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "montazystaId" INTEGER NOT NULL,
    CONSTRAINT "Montaz_montazystaId_fkey" FOREIGN KEY ("montazystaId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Montaz_montazystaId_idx" ON "Montaz"("montazystaId");

-- CreateIndex
CREATE INDEX "Montaz_status_idx" ON "Montaz"("status");
