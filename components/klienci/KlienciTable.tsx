'use client';

import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { KlientRow } from '@/app/panel-admin/tabs/ClientsTab';

interface Props {
  rows: KlientRow[];
}

export function KlienciTable({ rows }: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imię i nazwisko</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Miasto</TableHead>
            <TableHead>Adres faktury</TableHead>
            <TableHead>Współpraca</TableHead>
            <TableHead>Dodano</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.imie} {r.nazwisko}</TableCell>
              <TableCell>{r.telefon}</TableCell>
              <TableCell>{r.miasto}</TableCell>
              <TableCell className="max-w-[320px] truncate" title={r.adresFaktury}>{r.adresFaktury}</TableCell>
              <TableCell>{r.rodzajWspolpracy === 'MONTAZ' ? 'Z montażem' : 'Dostawa'}</TableCell>
              <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">Brak klientów</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
