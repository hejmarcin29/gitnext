'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddKlientDialogProps {
  onAdded: () => void;
}

export function AddKlientDialog({ onAdded }: AddKlientDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      imie: String(fd.get('imie') || ''),
      nazwisko: String(fd.get('nazwisko') || ''),
      telefon: String(fd.get('telefon') || ''),
      miasto: String(fd.get('miasto') || ''),
      adresFaktury: String(fd.get('adresFaktury') || ''),
      rodzajWspolpracy: String(fd.get('rodzajWspolpracy') || 'DOSTAWA'),
    } as const;

    try {
      const res = await fetch('/api/klienci', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Błąd podczas dodawania klienta');
      }
      toast.success('Klient dodany');
      setOpen(false);
      onAdded();
    } catch (e) {
      console.error(e);
      toast.error('Nie udało się dodać klienta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 sm:h-8">Dodaj klienta</Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[480px] sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Dodaj nowego klienta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="imie">Imię</Label>
              <Input id="imie" name="imie" required className="h-10" />
            </div>
            <div>
              <Label htmlFor="nazwisko">Nazwisko</Label>
              <Input id="nazwisko" name="nazwisko" required className="h-10" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="telefon">Telefon</Label>
              <Input id="telefon" name="telefon" type="tel" required className="h-10" />
            </div>
            <div>
              <Label htmlFor="miasto">Miasto</Label>
              <Input id="miasto" name="miasto" required className="h-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="adresFaktury">Adres faktury</Label>
            <Input id="adresFaktury" name="adresFaktury" required className="h-10" />
          </div>
          <div>
            <Label>Rodzaj współpracy</Label>
            <Select name="rodzajWspolpracy" defaultValue="DOSTAWA">
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DOSTAWA">Dostawa</SelectItem>
                <SelectItem value="MONTAZ">Z montażem</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="w-full h-10">
            {loading ? 'Dodawanie...' : 'Dodaj klienta'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
