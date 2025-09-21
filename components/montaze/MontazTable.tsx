'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Montaz, User } from '@prisma/client';

type MontazWithMontazysta = Montaz & {
  montazysta: User;
};

interface MontazTableProps {
  montaze: MontazWithMontazysta[];
  onEdit: (montaz: MontazWithMontazysta) => void;
  onDelete: (montaz: MontazWithMontazysta) => void;
}

const statusVariant = {
  NOWY: 'default',
  W_TRAKCIE: 'secondary',
  ZAKONCZONY: 'outline',
} as const;

export function MontazTable({ montaze, onEdit, onDelete }: MontazTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Klient</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Montażysta</TableHead>
            <TableHead>Data utworzenia</TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {montaze.map((montaz) => (
            <TableRow key={montaz.id}>
              <TableCell>{montaz.klientImie} {montaz.klientNazwisko}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[montaz.status]}>
                  {montaz.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>{montaz.montazysta.email}</TableCell>
              <TableCell>{new Date(montaz.createdAt).toLocaleDateString('pl')}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(montaz)}
                >
                  Edytuj
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(montaz)}
                >
                  Usuń
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}