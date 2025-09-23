// @ts-nocheck
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Montaz, User } from '@prisma/client';

type MontazWithMontazysta = Montaz & {
  montazysta: Pick<User, 'id' | 'email'>;
};

interface AdminEditPomiarDialogProps {
  montaz: MontazWithMontazysta;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMontazUpdated: () => void;
}

const statusOptions = [
  { value: 'NOWY', label: 'Nowy' },
  { value: 'W_TRAKCIE', label: 'W trakcie' },
  { value: 'ZAKONCZONY', label: 'Zakończony' },
] as const;

export function AdminEditPomiarDialog({ 
  montaz, 
  open, 
  onOpenChange, 
  onMontazUpdated 
}: AdminEditPomiarDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Zbierz wszystkie pola z formularza
    const data: any = {};
    
    // Podstawowe pola
    const klientImie = formData.get('klientImie') as string;
    const klientNazwisko = formData.get('klientNazwisko') as string;
    const adres = formData.get('adres') as string;
    const status = formData.get('status') as string;
    
    if (klientImie) data.klientImie = klientImie;
    if (klientNazwisko) data.klientNazwisko = klientNazwisko;
    if (adres) data.adres = adres;
    if (status) data.status = status;

    // Pomiary
    const pomiarM2 = formData.get('pomiarM2') as string;
    const procentDocinki = formData.get('procentDocinki') as string;
    const terminMontazu = formData.get('terminMontazu') as string;
    const terminDostawy = formData.get('terminDostawy') as string;
    const dniPrzedMontazem = formData.get('dniPrzedMontazem') as string;
    const warunekWnoszenia = formData.get('warunekWnoszenia') as string;
    
    if (pomiarM2) data.pomiarM2 = parseFloat(pomiarM2);
    if (procentDocinki) data.procentDocinki = parseInt(procentDocinki);
    if (terminMontazu) data.terminMontazu = terminMontazu;
    if (terminDostawy) data.terminDostawy = terminDostawy;
    if (dniPrzedMontazem) data.dniPrzedMontazem = parseInt(dniPrzedMontazem);
    if (warunekWnoszenia) data.warunekWnoszenia = warunekWnoszenia;

    // Potwierdzenia
    const czyKlientPotwierdza = formData.get('czyKlientPotwierdza') as string;
    const potwierdzaAdres = formData.get('potwierdzaAdres') as string;
    const potwierdzaPanel = formData.get('potwierdzaPanel') as string;
    
    if (czyKlientPotwierdza) data.czyKlientPotwierdza = czyKlientPotwierdza === 'true';
    if (potwierdzaAdres) data.potwierdzaAdres = potwierdzaAdres === 'true';
    if (potwierdzaPanel) data.potwierdzaPanel = potwierdzaPanel === 'true';

    // Notatki
    const notatkaPrimepodloga = formData.get('notatkaPrimepodloga') as string;
    const notatkiMontazysty = formData.get('notatkiMontazysty') as string;
    
    if (notatkaPrimepodloga) data.notatkaPrimepodloga = notatkaPrimepodloga;
    if (notatkiMontazysty) data.notatkiMontazysty = notatkiMontazysty;

    // Dodaj timestamp edycji przez admina do historii
    const currentHistory = montaz.historiaZmianModelu || '';
    const timestamp = new Date().toLocaleString('pl');
    const editRecord = `[${timestamp}] ADMIN: edycja pomiarów`;
    data.historiaZmianModelu = currentHistory ? `${currentHistory}\n${editRecord}` : editRecord;

    try {
      const res = await fetch(`/api/montaze/${montaz.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update montaz');
      }

      toast.success('Pomiary zaktualizowane');
      onMontazUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating montaz:', error);
      toast.error(error instanceof Error ? error.message : 'Błąd podczas aktualizacji');
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Edytuj pomiary (ADMIN)</span>
            <Badge variant="outline" className="text-xs">
              Montażysta: {montaz.montazysta.email}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Klient - readonly dla admina */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="col-span-full font-semibold text-base mb-2">Dane klienta</h3>
            <div className="space-y-2">
              <Label htmlFor="klientImie">Imię klienta</Label>
              <Input
                id="klientImie"
                name="klientImie"
                defaultValue={montaz.klientImie}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="klientNazwisko">Nazwisko klienta</Label>
              <Input
                id="klientNazwisko"
                name="klientNazwisko"
                defaultValue={montaz.klientNazwisko}
                required
              />
            </div>
            <div className="col-span-full space-y-2">
              <Label htmlFor="adres">Adres montażu</Label>
              <Input
                id="adres"
                name="adres"
                defaultValue={montaz.adres || ''}
                placeholder="Wprowadź adres montażu"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status montażu</Label>
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

          {/* Pomiary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="col-span-full font-semibold text-base">Pomiary</h3>
            
            <div className="space-y-2">
              <Label htmlFor="pomiarM2">Pomiar (m²)</Label>
              <Input
                id="pomiarM2"
                name="pomiarM2"
                type="number"
                step="0.01"
                min="0"
                defaultValue={montaz.pomiarM2 || ''}
                placeholder="np. 25.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="procentDocinki">Procent na docinki (%)</Label>
              <Input
                id="procentDocinki"
                name="procentDocinki"
                type="number"
                min="5"
                max="20"
                defaultValue={montaz.procentDocinki || ''}
                placeholder="5-20%"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terminMontazu">Termin montażu</Label>
              <Input
                id="terminMontazu"
                name="terminMontazu"
                type="date"
                defaultValue={formatDate(montaz.terminMontazu)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terminDostawy">Termin dostawy</Label>
              <Input
                id="terminDostawy"
                name="terminDostawy"
                type="date"
                defaultValue={formatDate(montaz.terminDostawy)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dniPrzedMontazem">Dni przed montażem</Label>
              <Input
                id="dniPrzedMontazem"
                name="dniPrzedMontazem"
                type="number"
                min="1"
                max="30"
                defaultValue={montaz.dniPrzedMontazem || ''}
                placeholder="np. 3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warunekWnoszenia">Warunki wnoszenia</Label>
              <Input
                id="warunekWnoszenia"
                name="warunekWnoszenia"
                defaultValue={montaz.warunekWnoszenia || ''}
                placeholder="np. winda, piętro 3"
              />
            </div>
          </div>

          {/* Potwierdzenia */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
            <h3 className="col-span-full font-semibold text-base">Potwierdzenia</h3>
            
            <div className="space-y-2">
              <Label htmlFor="czyKlientPotwierdza">Klient potwierdza</Label>
              <Select name="czyKlientPotwierdza" defaultValue={montaz.czyKlientPotwierdza?.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Tak</SelectItem>
                  <SelectItem value="false">Nie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="potwierdzaAdres">Potwierdza adres</Label>
              <Select name="potwierdzaAdres" defaultValue={montaz.potwierdzaAdres?.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Tak</SelectItem>
                  <SelectItem value="false">Nie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="potwierdzaPanel">Potwierdza panel</Label>
              <Select name="potwierdzaPanel" defaultValue={montaz.potwierdzaPanel?.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Tak</SelectItem>
                  <SelectItem value="false">Nie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notatki */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notatkaPrimepodloga">Notatka Primepodloga</Label>
              <Input
                id="notatkaPrimepodloga"
                name="notatkaPrimepodloga"
                defaultValue={montaz.notatkaPrimepodloga || ''}
                placeholder="Krótka notatka"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notatkiMontazysty">Notatki montażysty</Label>
              <Textarea
                id="notatkiMontazysty"
                name="notatkiMontazysty"
                defaultValue={montaz.notatkiMontazysty || ''}
                placeholder="Szczegółowe uwagi montażysty"
                rows={3}
              />
            </div>
          </div>

          {/* Historia zmian */}
          {montaz.historiaZmianModelu && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Historia zmian</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? 'Ukryj' : 'Pokaż'}
                </Button>
              </div>
              {showHistory && (
                <div className="p-3 bg-muted rounded text-sm whitespace-pre-wrap">
                  {montaz.historiaZmianModelu}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Zapisywanie...' : 'Zapisz zmiany (ADMIN)'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}