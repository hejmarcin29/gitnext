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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Moje montaże</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Klient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Uwagi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {montaze.map((montaz) => (
                  <TableRow key={montaz.id}>
                    <TableCell>
                      {montaz.klientImie} {montaz.klientNazwisko}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[montaz.status]}>
                        {statusLabel[montaz.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(montaz.createdAt).toLocaleDateString('pl')}
                    </TableCell>
                    <TableCell>{montaz.uwagi || '-'}</TableCell>
                  </TableRow>
                ))}
                {montaze.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
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
  );
}