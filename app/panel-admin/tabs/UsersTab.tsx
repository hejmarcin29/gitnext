'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserTable } from '@/components/users/UserTable';
import { AddUserDialog } from '@/components/users/AddUserDialog';
import { EditUserDialog } from '@/components/users/EditUserDialog';
import type { User } from '@prisma/client';

export function UsersTab() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Pobierz użytkowników przy pierwszym renderowaniu
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  // Funkcje do zarządzania użytkownikami
  const handleUserAdded = () => {
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleToggleActive = async (user: User) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
      });

      if (!res.ok) throw new Error('Failed to toggle user status');

      // Odśwież listę
      const updatedUsers = await fetch('/api/users').then((r) => r.json());
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Lista użytkowników</h2>
        <AddUserDialog onUserAdded={handleUserAdded} />
      </div>

      <UserTable
        users={users}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
      />

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUserUpdated={handleUserAdded}
        />
      )}
    </div>
  );
}