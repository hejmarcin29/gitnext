'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddUserDialogProps {
  onUserAdded: () => void;
}

export function AddUserDialog({ onUserAdded }: AddUserDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
      telefon: formData.get('telefon') || undefined,
      adres: formData.get('adres') || undefined,
      modelPanela: formData.get('modelPanela') || undefined,
      notatka: formData.get('notatka') || undefined,
    };

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Błąd podczas dodawania użytkownika');

      toast.success('Użytkownik dodany');
      onUserAdded();
      setOpen(false);
    } catch (error) {
      toast.error('Nie udało się dodać użytkownika');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 sm:h-8">Dodaj użytkownika</Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[425px] sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Dodaj nowego użytkownika</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input 
              required 
              id="email" 
              name="email" 
              type="email" 
              className="h-11 sm:h-10"
              placeholder="użytkownik@przykład.pl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Hasło</Label>
            <Input 
              required 
              id="password" 
              name="password" 
              type="password" 
              className="h-11 sm:h-10"
              placeholder="Wprowadź hasło"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefon" className="text-sm font-medium">Telefon</Label>
            <Input 
              id="telefon" 
              name="telefon" 
              type="tel" 
              className="h-11 sm:h-10"
              placeholder="np. +48 123 456 789"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adres" className="text-sm font-medium">Adres</Label>
            <Input 
              id="adres" 
              name="adres" 
              className="h-11 sm:h-10"
              placeholder="Ulica, miasto, kod pocztowy"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modelPanela" className="text-sm font-medium">Model panela</Label>
            <Input 
              id="modelPanela" 
              name="modelPanela" 
              className="h-11 sm:h-10"
              placeholder="np. Panel XYZ-123"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notatka" className="text-sm font-medium">Notatka od Primepodloga</Label>
            <Input 
              id="notatka" 
              name="notatka" 
              className="h-11 sm:h-10"
              placeholder="Dodatkowe informacje"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">Rola</Label>
            <Select name="role" defaultValue="MONTAZYSTA">
              <SelectTrigger className="h-11 sm:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrator</SelectItem>
                <SelectItem value="MONTAZYSTA">Montażysta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-11 sm:h-10"
          >
            {loading ? 'Dodawanie...' : 'Dodaj użytkownika'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}