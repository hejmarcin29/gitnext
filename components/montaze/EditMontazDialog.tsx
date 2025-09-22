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
      <DialogContent className="w-[95vw] max-w-[500px] sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Edytuj montaż</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="klientImie" className="text-sm font-medium">Imię klienta</Label>
              <Input 
                required 
                id="klientImie" 
                name="klientImie"
                defaultValue={montaz.klientImie}
                className="h-11 sm:h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="klientNazwisko" className="text-sm font-medium">Nazwisko klienta</Label>
              <Input 
                required 
                id="klientNazwisko" 
                name="klientNazwisko"
                defaultValue={montaz.klientNazwisko}
                className="h-11 sm:h-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="montazystaId" className="text-sm font-medium">Montażysta</Label>
            <Select name="montazystaId" defaultValue={montaz.montazystaId.toString()}>
              <SelectTrigger className="h-11 sm:h-10">
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
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">Status</Label>
            <Select name="status" defaultValue={montaz.status}>
              <SelectTrigger className="h-11 sm:h-10">
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
          <div className="space-y-2">
            <Label htmlFor="uwagi" className="text-sm font-medium">Uwagi (opcjonalne)</Label>
            <Textarea 
              id="uwagi" 
              name="uwagi"
              defaultValue={montaz.uwagi || ''}
              className="min-h-[80px] resize-none"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-11 sm:h-10"
          >
            {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}