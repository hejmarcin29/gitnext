'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MontazTable } from '@/components/montaze/MontazTable';
import { AddMontazDialog } from '@/components/montaze/AddMontazDialog';
import { EditMontazDialog } from '@/components/montaze/EditMontazDialog';
import type { Montaz, User } from '@prisma/client';
import { toast } from 'sonner';

type MontazWithMontazysta = Montaz & {
  montazysta: Pick<User, 'id' | 'email'>;
};

export function MontazeTab() {
  const router = useRouter();
  const [montaze, setMontaze] = useState<MontazWithMontazysta[]>([]);
  const [montazysci, setMontazysci] = useState<User[]>([]);
  const [editingMontaz, setEditingMontaz] = useState<MontazWithMontazysta | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Pobierz montaże i montażystów przy pierwszym renderowaniu
  useEffect(() => {
    Promise.all([
      fetch('/api/montaze').then((r) => r.json()),
      fetch('/api/users').then((r) => r.json()),
    ])
      .then(([montazeData, usersData]) => {
        setMontaze(montazeData);
        setMontazysci(usersData.filter((u: User) => u.role === 'MONTAZYSTA' && u.isActive));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        toast.error('Błąd podczas ładowania danych');
      });
  }, []);

  // Funkcje do zarządzania montażami
  const handleMontazAdded = () => {
    fetch('/api/montaze')
      .then((res) => res.json())
      .then(setMontaze)
      .catch((error) => {
        console.error('Error refreshing montaze:', error);
        toast.error('Błąd podczas odświeżania listy');
      });
  };

  const handleEdit = (montaz: MontazWithMontazysta) => {
    setEditingMontaz(montaz);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (montaz: MontazWithMontazysta) => {
    if (!confirm('Czy na pewno chcesz usunąć ten montaż?')) return;

    try {
      const res = await fetch(`/api/montaze/${montaz.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete montaz');

      toast.success('Montaż usunięty');
      handleMontazAdded(); // odśwież listę
    } catch (error) {
      console.error('Error deleting montaz:', error);
      toast.error('Błąd podczas usuwania montażu');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Lista montaży</h2>
        <AddMontazDialog
          montazysci={montazysci}
          onMontazAdded={handleMontazAdded}
        />
      </div>

      <MontazTable
        montaze={montaze}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingMontaz && (
        <EditMontazDialog
          montaz={editingMontaz}
          montazysci={montazysci}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onMontazUpdated={handleMontazAdded}
        />
      )}
    </div>
  );
}