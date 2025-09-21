'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { User } from '@prisma/client';

interface AddMontazDialogProps {
  montazysci: User[];
  onMontazAdded: () => void;
}

export function AddMontazDialog({ montazysci, onMontazAdded }: AddMontazDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      klientImie: formData.get('klientImie'),
      klientNazwisko: formData.get('klientNazwisko'),
      montazystaId: Number(formData.get('montazystaId')),
      uwagi: formData.get('uwagi') || undefined,
    };

    try {
      const res = await fetch('/api/montaze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Błąd podczas dodawania montażu');

      toast.success('Montaż dodany');
      onMontazAdded();
      setOpen(false);
    } catch (error) {
      toast.error('Nie udało się dodać montażu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Dodaj montaż</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowy montaż</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="klientImie">Imię klienta</Label>
            <Input required id="klientImie" name="klientImie" />
          </div>
          <div>
            <Label htmlFor="klientNazwisko">Nazwisko klienta</Label>
            <Input required id="klientNazwisko" name="klientNazwisko" />
          </div>
          <div>
            <Label htmlFor="montazystaId">Montażysta</Label>
            <Select name="montazystaId" required>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz montażystę" />
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
            <Label htmlFor="uwagi">Uwagi (opcjonalne)</Label>
            <Textarea id="uwagi" name="uwagi" />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Dodawanie...' : 'Dodaj montaż'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}