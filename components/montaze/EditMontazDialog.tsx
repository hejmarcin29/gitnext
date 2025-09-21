'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Montaz, User } from '@prisma/client';

type MontazWithMontazysta = Montaz & {
  montazysta: User;
};

interface EditMontazDialogProps {
  montaz: MontazWithMontazysta;
  montazysci: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMontazUpdated: () => void;
}

const statusOptions = [
  { value: 'NOWY', label: 'Nowy' },
  { value: 'W_TRAKCIE', label: 'W trakcie' },
  { value: 'ZAKONCZONY', label: 'Zakończony' },
] as const;

export function EditMontazDialog({ 
  montaz, 
  montazysci, 
  open, 
  onOpenChange, 
  onMontazUpdated 
}: EditMontazDialogProps) {
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      klientImie: formData.get('klientImie'),
      klientNazwisko: formData.get('klientNazwisko'),
      montazystaId: Number(formData.get('montazystaId')),
      status: formData.get('status'),
      uwagi: formData.get('uwagi') || undefined,
    };

    try {
      const res = await fetch(`/api/montaze/${montaz.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Błąd podczas aktualizacji montażu');

      toast.success('Montaż zaktualizowany');
      onMontazUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error('Nie udało się zaktualizować montażu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj montaż</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="klientImie">Imię klienta</Label>
            <Input 
              required 
              id="klientImie" 
              name="klientImie"
              defaultValue={montaz.klientImie}
            />
          </div>
          <div>
            <Label htmlFor="klientNazwisko">Nazwisko klienta</Label>
            <Input 
              required 
              id="klientNazwisko" 
              name="klientNazwisko"
              defaultValue={montaz.klientNazwisko}
            />
          </div>
          <div>
            <Label htmlFor="montazystaId">Montażysta</Label>
            <Select name="montazystaId" defaultValue={montaz.montazystaId.toString()}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {montazysci.map((montazysta) => (
                  <SelectItem key={montazysta.id} value={montazysta.id.toString()}>
                    {montazysta.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={montaz.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="uwagi">Uwagi (opcjonalne)</Label>
            <Textarea 
              id="uwagi" 
              name="uwagi"
              defaultValue={montaz.uwagi || ''}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}