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
import type { User } from '@prisma/client';

interface UserTableProps {
  users: (User & { _count?: { montaze: number } })[];
  onEdit: (user: User) => void;
  onToggleActive: (user: User) => void;
}

export function UserTable({ users, onEdit, onToggleActive }: UserTableProps) {
  return (
    <>
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div key={user.id} className="border rounded-lg p-4 space-y-3 bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <p className="font-medium text-sm break-all">{user.email}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                    {user.role}
                  </Badge>
                  <Badge variant={user.isActive ? 'default' : 'destructive'} className="text-xs">
                    {user.isActive ? 'Aktywny' : 'Nieaktywny'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Montaże: {user._count?.montaze || 0}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(user)}
                className="flex-1 h-9"
              >
                Edytuj
              </Button>
              <Button
                variant={user.isActive ? 'destructive' : 'default'}
                size="sm"
                onClick={() => onToggleActive(user)}
                className="flex-1 h-9"
              >
                {user.isActive ? 'Dezaktywuj' : 'Aktywuj'}
              </Button>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Brak użytkowników
          </div>
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Rola</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Montaże</TableHead>
              <TableHead className="text-right">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'default' : 'destructive'}>
                    {user.isActive ? 'Aktywny' : 'Nieaktywny'}
                  </Badge>
                </TableCell>
                <TableCell>{user._count?.montaze || 0}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(user)}
                  >
                    Edytuj
                  </Button>
                  <Button
                    variant={user.isActive ? 'destructive' : 'default'}
                    size="sm"
                    onClick={() => onToggleActive(user)}
                  >
                    {user.isActive ? 'Dezaktywuj' : 'Aktywuj'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Brak użytkowników
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}