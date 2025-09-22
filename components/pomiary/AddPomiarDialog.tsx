'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { Montaz } from '@prisma/client';

interface AddPomiarDialogProps {
  onPomiarAdded: () => void;
  montaz?: Montaz;
}

export function AddPomiarDialog({ onPomiarAdded, montaz }: AddPomiarDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [procentDocinki, setProcentDocinki] = React.useState((montaz as any)?.procentDocinki || 10);
  const [innyAdres, setInnyAdres] = React.useState(false);
  const [innyModel, setInnyModel] = React.useState(false);
  const [typTerminu, setTypTerminu] = React.useState<'data' | 'dni'>('data');
  const [potwierdzaAdres, setPotwierdzaAdres] = React.useState(false);
  const [potwierdzaPanel, setPotwierdzaPanel] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const data = {
      klientImie: formData.get('klientImie'),
      klientNazwisko: formData.get('klientNazwisko'),
      montazystaId: montaz?.montazystaId || 0, // Będzie nadpisane w API dla montażysty
      adres: formData.get('adres') || undefined,
      notatkaPrimepodloga: formData.get('notatkaPrimepodloga') || undefined,
      pomiarM2: formData.get('pomiarM2') ? parseFloat(formData.get('pomiarM2') as string) : undefined,
      procentDocinki: parseInt(formData.get('procentDocinki') as string),
      terminMontazu: formData.get('terminMontazu') || undefined,
      terminDostawy: formData.get('terminDostawy') || undefined,
      dniPrzedMontazem: formData.get('dniPrzedMontazem') ? parseInt(formData.get('dniPrzedMontazem') as string) : undefined,
      warunekWnoszenia: formData.get('warunekWnoszenia') || undefined,
      uwagi: formData.get('uwagi') || undefined,
      // Nowe pola
      czyZmianaAdresu: formData.get('czyZmianaAdresu') === 'true',
      czyZmianaModelu: formData.get('czyZmianaModelu') === 'true',
      nowyModelPanela: formData.get('nowyModelPanela') || undefined,
      notatkiMontazysty: formData.get('notatkiMontazysty') || undefined,
      // Pola potwierdzenia
      potwierdzaAdres: formData.get('potwierdzaAdres') === 'true',
      potwierdzaPanel: formData.get('potwierdzaPanel') === 'true',
    };

    try {
      // Jeśli mamy montaz, aktualizuj istniejący; jeśli nie, utwórz nowy
      const url = montaz ? `/api/montaze/${montaz.id}` : '/api/montaze';
      const method = montaz ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Błąd podczas zapisywania pomiaru');

      toast.success(montaz ? 'Pomiar zaktualizowany' : 'Pomiar dodany');
      onPomiarAdded();
      setOpen(false);
      (e.target as HTMLFormElement).reset();
      setProcentDocinki((montaz as any)?.procentDocinki || 10);
    } catch (error) {
      console.error('Error saving pomiar:', error);
      toast.error('Błąd podczas zapisywania pomiaru');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 sm:h-8">Dodaj pomiar</Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[600px] sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {montaz ? 'Edytuj pomiar' : 'Dodaj nowy pomiar'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Dane klienta */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Dane klienta</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="klientImie" className="text-sm font-medium">Imię klienta</Label>
                  <svg className="h-3 w-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input 
                  id="klientImie" 
                  name="klientImie" 
                  value={montaz?.klientImie || ''}
                  readOnly
                  className="h-11 sm:h-10 bg-muted cursor-not-allowed"
                  title="Dane klienta nie mogą być zmieniane"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="klientNazwisko" className="text-sm font-medium">Nazwisko klienta</Label>
                  <svg className="h-3 w-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input 
                  id="klientNazwisko" 
                  name="klientNazwisko" 
                  value={montaz?.klientNazwisko || ''}
                  readOnly
                  className="h-11 sm:h-10 bg-muted cursor-not-allowed"
                  title="Dane klienta nie mogą być zmieniane"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="adres" className="text-sm font-medium">Adres montażu</Label>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={innyAdres}
                    onChange={(e) => setInnyAdres(e.target.checked)}
                    className="h-3 w-3"
                  />
                  Inny?
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={potwierdzaAdres}
                    onChange={(e) => setPotwierdzaAdres(e.target.checked)}
                    className="h-3 w-3"
                  />
                  Potwierdza?
                </label>
              </div>
              <Input 
                id="adres" 
                name="adres" 
                defaultValue={(montaz as any)?.adres || ''}
                readOnly={!innyAdres}
                className={`h-11 sm:h-10 ${!innyAdres ? 'bg-muted' : ''}`}
                placeholder="Ulica, miasto, kod pocztowy"
              />
              <input type="hidden" name="czyZmianaAdresu" value={innyAdres ? 'true' : 'false'} />
              <input type="hidden" name="potwierdzaAdres" value={potwierdzaAdres ? 'true' : 'false'} />
            </div>
            {montaz && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="modelPanela" className="text-sm font-medium">Model panela</Label>
                  <label className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={innyModel}
                      onChange={(e) => setInnyModel(e.target.checked)}
                      className="h-3 w-3"
                    />
                    Inny panel?
                  </label>
                  <label className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={potwierdzaPanel}
                      onChange={(e) => setPotwierdzaPanel(e.target.checked)}
                      className="h-3 w-3"
                    />
                    Potwierdza?
                  </label>
                </div>
                <Input 
                  id="modelPanela" 
                  name={innyModel ? "nowyModelPanela" : "modelPanela"}
                  defaultValue={innyModel ? "" : ((montaz as any)?.modelPanela || "Brak danych")}
                  readOnly={!innyModel}
                  className={`h-11 sm:h-10 ${!innyModel ? 'bg-muted' : ''}`}
                  placeholder={innyModel ? "Wprowadź nowy model panela" : "Brak danych"}
                />
                <input type="hidden" name="czyZmianaModelu" value={innyModel ? 'true' : 'false'} />
                <input type="hidden" name="potwierdzaPanel" value={potwierdzaPanel ? 'true' : 'false'} />
              </div>
            )}
          </div>

          <Separator />

          {/* Notatki Primepodloga */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Notatki Primepodloga</h3>
            <div className="space-y-2">
              <Label htmlFor="notatkaPrimepodloga" className="text-sm font-medium">
                Notatki Primepodloga
              </Label>
              <Textarea 
                id="notatkaPrimepodloga" 
                name="notatkaPrimepodloga"
                defaultValue={(montaz as any)?.notatkaPrimepodloga || ''}
                className="min-h-[60px]"
                placeholder="Dodatkowe informacje od Primepodloga"
              />
            </div>
          </div>

          <Separator />

          {/* Panel i potwierdzenia - ukryj gdy zmieniony model */}
          {!innyModel && (
            <>
          <Separator />
            </>
          )}

          {/* Pomiary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Pomiary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pomiarM2" className="text-sm font-medium">Pomiar m²</Label>
                <Input 
                  id="pomiarM2" 
                  name="pomiarM2" 
                  type="number" 
                  step="0.01"
                  min="0"
                  defaultValue={(montaz as any)?.pomiarM2 || ''}
                  className="h-11 sm:h-10"
                  placeholder="np. 25.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="procentDocinki" className="text-sm font-medium">
                  Procent na docinki: {procentDocinki}%
                </Label>
                <input
                  type="range"
                  id="procentDocinki"
                  name="procentDocinki"
                  min="5"
                  max="20"
                  value={procentDocinki}
                  onChange={(e) => setProcentDocinki(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Terminy */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Terminy</h3>
            <div className="space-y-2">
              <Label htmlFor="terminMontazu" className="text-sm font-medium">Termin montażu</Label>
              <Input 
                id="terminMontazu" 
                name="terminMontazu" 
                type="date"
                defaultValue={(montaz as any)?.terminMontazu ? new Date((montaz as any).terminMontazu).toISOString().split('T')[0] : ''}
                className="h-11 sm:h-10"
              />
            </div>
            
            {/* Wybór typu terminu dostawy */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Termin dostawy</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="typTerminu"
                    value="data"
                    checked={typTerminu === 'data'}
                    onChange={(e) => setTypTerminu(e.target.value as 'data' | 'dni')}
                    className="h-3 w-3"
                  />
                  <span className="text-sm">Konkretna data</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="typTerminu"
                    value="dni"
                    checked={typTerminu === 'dni'}
                    onChange={(e) => setTypTerminu(e.target.value as 'data' | 'dni')}
                    className="h-3 w-3"
                  />
                  <span className="text-sm">Dni przed montażem</span>
                </label>
              </div>
              
              {typTerminu === 'data' ? (
                <Input 
                  id="terminDostawy" 
                  name="terminDostawy" 
                  type="date"
                  defaultValue={(montaz as any)?.terminDostawy ? new Date((montaz as any).terminDostawy).toISOString().split('T')[0] : ''}
                  className="h-11 sm:h-10"
                />
              ) : (
                <Input 
                  id="dniPrzedMontazem" 
                  name="dniPrzedMontazem" 
                  type="number"
                  min="1"
                  defaultValue={(montaz as any)?.dniPrzedMontazem || ''}
                  className="h-11 sm:h-10"
                  placeholder="np. 3"
                />
              )}
            </div>
          </div>

          <Separator />

          {/* Warunki i notatki */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Warunki i notatki</h3>
            <div className="space-y-2">
              <Label htmlFor="warunekWnoszenia" className="text-sm font-medium">
                Warunki wnoszenia
              </Label>
              <Textarea 
                id="warunekWnoszenia" 
                name="warunekWnoszenia"
                defaultValue={(montaz as any)?.warunekWnoszenia || ''}
                placeholder="np. Dalej niż z podjazdu pod dach, winda, które piętro..."
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notatkiMontazysty" className="text-sm font-medium">Notatki Montażysty</Label>
              <Textarea 
                id="notatkiMontazysty" 
                name="notatkiMontazysty"
                defaultValue={(montaz as any)?.notatkiMontazysty || montaz?.uwagi || ''}
                placeholder="Notatki montażysty..."
                className="min-h-[60px]"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-11 sm:h-10"
          >
            {loading 
              ? (montaz ? 'Aktualizowanie...' : 'Dodawanie...') 
              : (montaz ? 'Aktualizuj pomiar' : 'Dodaj pomiar')
            }
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}