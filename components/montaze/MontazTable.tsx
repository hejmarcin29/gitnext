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
  montazysta: Pick<User, 'id' | 'email'>;
};

interface MontazTableProps {
  montaze: MontazWithMontazysta[];
  onEdit: (montaz: MontazWithMontazysta) => void;
  onDelete: (montaz: MontazWithMontazysta) => void;
  onEditPomiary?: (montaz: MontazWithMontazysta) => void; // callback dla admina
  onClientClick?: (montaz: MontazWithMontazysta) => void; // callback dla kliknięcia w klienta
}

const statusVariant = {
  NOWY: 'default',
  W_TRAKCIE: 'secondary',
  ZAKONCZONY: 'outline',
} as const;

export function MontazTable({ montaze, onEdit, onDelete, onEditPomiary, onClientClick }: MontazTableProps) {
  return (
    <>
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {montaze.map((montaz) => (
          <div key={montaz.id} className="border rounded-lg p-4 space-y-3 bg-card">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 
                  className={`font-medium text-sm ${onClientClick ? "cursor-pointer hover:text-primary" : ""}`}
                  onClick={() => onClientClick?.(montaz)}
                >
                  {montaz.klientImie} {montaz.klientNazwisko}
                </h3>
                <Badge variant={statusVariant[montaz.status]} className="text-xs">
                  {montaz.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Montażysta: {montaz.montazysta.email}</p>
                <p>Data: {new Date(montaz.createdAt).toLocaleDateString('pl')}</p>
                {montaz.uwagi && (
                  <p className="text-xs">Uwagi: {montaz.uwagi}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(montaz)}
                className="flex-1 h-9"
              >
                Edytuj
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(montaz)}
                className="flex-1 h-9"
              >
                Usuń
              </Button>
            </div>
          </div>
        ))}
        {montaze.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Brak montaży
          </div>
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block rounded-md border">
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
                <TableCell 
                  className={onClientClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => onClientClick?.(montaz)}
                >
                  {montaz.klientImie} {montaz.klientNazwisko}
                </TableCell>
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
            {montaze.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Brak montaży
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}