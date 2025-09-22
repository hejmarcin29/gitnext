'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { User } from '@prisma/client';

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export function EditUserDialog({ user, open, onOpenChange, onUserUpdated }: EditUserDialogProps) {
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password') || undefined, // optional
      role: formData.get('role'),
    };

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Błąd podczas aktualizacji użytkownika');

      toast.success('Użytkownik zaktualizowany');
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error('Nie udało się zaktualizować użytkownika');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Edytuj użytkownika</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input 
              required 
              id="email" 
              name="email" 
              type="email"
              defaultValue={user.email}
              className="h-11 sm:h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Nowe hasło (opcjonalne)</Label>
            <Input 
              id="password" 
              name="password" 
              type="password"
              placeholder="Pozostaw puste aby nie zmieniać"
              className="h-11 sm:h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">Rola</Label>
            <Select name="role" defaultValue={user.role}>
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
            {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}