// @ts-nocheck
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
      <DialogContent className="w-[95vw] max-w-[500px] sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Dodaj nowy montaż</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="klientImie" className="text-sm font-medium">Imię klienta</Label>
              <Input 
                required 
                id="klientImie" 
                name="klientImie" 
                className="h-11 sm:h-10"
                placeholder="Jan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="klientNazwisko" className="text-sm font-medium">Nazwisko klienta</Label>
              <Input 
                required 
                id="klientNazwisko" 
                name="klientNazwisko" 
                className="h-11 sm:h-10"
                placeholder="Kowalski"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="montazystaId" className="text-sm font-medium">Montażysta</Label>
            <Select name="montazystaId" required>
              <SelectTrigger className="h-11 sm:h-10">
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
          <div className="space-y-2">
            <Label htmlFor="uwagi" className="text-sm font-medium">Uwagi (opcjonalne)</Label>
            <Textarea 
              id="uwagi" 
              name="uwagi" 
              className="min-h-[80px] resize-none"
              placeholder="Dodatkowe informacje o montażu..."
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-11 sm:h-10"
          >
            {loading ? 'Dodawanie...' : 'Dodaj montaż'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}