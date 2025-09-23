'// @ts-nocheck'
'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddPomiarDialog } from '@/components/pomiary/AddPomiarDialog';
import { ClientSummaryDialog } from '@/components/montaze/ClientSummaryDialog';
import type { Montaz } from '@prisma/client';

interface MontazeListProps {
  initialMontaze: Montaz[];
}

const statusLabel = {
  NOWY: 'Nowy',
  W_TRAKCIE: 'W trakcie',
  ZAKONCZONY: 'Zakończony',
} as const;

const statusVariant = {
  NOWY: 'default',
  W_TRAKCIE: 'secondary',
  ZAKONCZONY: 'outline',
} as const;

export function MontazeList({ initialMontaze }: MontazeListProps) {
  const [montaze, setMontaze] = useState(initialMontaze);
  const [selectedMontaz, setSelectedMontaz] = useState<Montaz | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Odświeżaj listę co 30 sekund
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/montaze')
        .then((res) => res.json())
        .then(setMontaze)
        .catch(console.error);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Funkcja do odświeżania listy po dodaniu pomiaru
  const handlePomiarAdded = () => {
    fetch('/api/montaze')
      .then((res) => res.json())
      .then(setMontaze)
      .catch(console.error);
  };

  // Funkcja do otwierania podsumowania klienta
  const handleClientClick = (montaz: Montaz) => {
    setSelectedMontaz(montaz);
    setSummaryOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        <h2 className="text-lg font-semibold">Moje montaże</h2>
        {montaze.map((montaz) => (
          <Card 
            key={montaz.id} 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => handleClientClick(montaz)}
            title="Kliknij aby zobaczyć szczegóły klienta"
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-sm">
                      {montaz.klientImie} {montaz.klientNazwisko}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(montaz.createdAt).toLocaleDateString('pl')}
                    </p>
                  </div>
                  <Badge variant={statusVariant[montaz.status]} className="text-xs">
                    {statusLabel[montaz.status]}
                  </Badge>
                </div>
                <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                  <AddPomiarDialog 
                    montaz={montaz}
                    onPomiarAdded={handlePomiarAdded} 
                  />
                </div>
                {((montaz as any).notatkiMontazysty || montaz.uwagi) && (
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Notatki Montażysty:</p>
                    <p className="text-sm">{(montaz as any).notatkiMontazysty || montaz.uwagi}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {montaze.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Brak przypisanych montaży</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Klient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Notatki Montażysty</TableHead>
                    <TableHead>Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {montaze.map((montaz) => (
                    <TableRow 
                      key={montaz.id} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleClientClick(montaz)}
                      title="Kliknij aby zobaczyć szczegóły klienta"
                    >
                      <TableCell>
                        <span className="font-medium">
                          {montaz.klientImie} {montaz.klientNazwisko}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[montaz.status]}>
                          {statusLabel[montaz.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(montaz.createdAt).toLocaleDateString('pl')}
                      </TableCell>
                      <TableCell>
                        {(montaz as any).notatkiMontazysty || montaz.uwagi || '-'}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <AddPomiarDialog 
                          montaz={montaz}
                          onPomiarAdded={handlePomiarAdded} 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {montaze.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Brak przypisanych montaży
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Client Summary Dialog */}
      {selectedMontaz && (
        <ClientSummaryDialog
          open={summaryOpen}
          onOpenChange={setSummaryOpen}
          montaz={selectedMontaz as any} // Cast because of extended interface
          onUpdate={handlePomiarAdded}
        />
      )}
    </div>
  );
}