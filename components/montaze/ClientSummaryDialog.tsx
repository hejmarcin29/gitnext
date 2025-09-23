// @ts-nocheck
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Montaz, MontazStatus } from '@prisma/client';

interface MontazWithMontazysta extends Montaz {
  montazysta: {
    id: number;
    email: string;
  };
}

interface ClientSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  montaz: MontazWithMontazysta;
  onUpdate?: () => void;
}

export function ClientSummaryDialog({ open, onOpenChange, montaz, onUpdate }: ClientSummaryDialogProps) {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState<MontazStatus>(montaz.status);
  const [notatkiMontazysty, setNotatkiMontazysty] = React.useState((montaz as any).notatkiMontazysty || '');

  // Funkcja do aktualizacji statusu
  async function updateStatus() {
    if (newStatus === montaz.status) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/montaze/${montaz.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Błąd aktualizacji');
      
      toast.success('Status zaktualizowany');
      onUpdate?.();
    } catch (error) {
      toast.error('Nie udało się zaktualizować statusu');
      setNewStatus(montaz.status);
    } finally {
      setIsUpdating(false);
    }
  }

  // Funkcja do aktualizacji notatek
  async function updateNotes() {
    if (notatkiMontazysty === ((montaz as any).notatkiMontazysty || '')) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/montaze/${montaz.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notatkiMontazysty }),
      });

      if (!response.ok) throw new Error('Błąd aktualizacji');
      
      toast.success('Notatki zaktualizowane');
      onUpdate?.();
    } catch (error) {
      toast.error('Nie udało się zaktualizować notatek');
      setNotatkiMontazysty((montaz as any).notatkiMontazysty || '');
    } finally {
      setIsUpdating(false);
    }
  }

  // Formatowanie daty
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Nie ustawiono';
    const d = new Date(date);
    return d.toLocaleDateString('pl-PL');
  };

  // Status badge color
  const getStatusBadge = (status: MontazStatus) => {
    switch (status) {
      case 'NOWY': return <Badge variant="secondary">Nowy</Badge>;
      case 'W_TRAKCIE': return <Badge variant="default">W trakcie</Badge>;
      case 'ZAKONCZONY': return <Badge variant="outline" className="border-green-500 text-green-600">Zakończony</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Progress bar
  const getProgress = (status: MontazStatus) => {
    switch (status) {
      case 'NOWY': return 25;
      case 'W_TRAKCIE': return 75;
      case 'ZAKONCZONY': return 100;
      default: return 0;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            {montaz.klientImie} {montaz.klientNazwisko}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dane klienta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                👤 Dane klienta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Imię i nazwisko:</span>
                  <p className="text-lg font-semibold">{montaz.klientImie} {montaz.klientNazwisko}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Data zlecenia:</span>
                  <p>{formatDate(montaz.createdAt)}</p>
                </div>
              </div>
              
              {montaz.adres && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Adres montażu:</span>
                  <p>{montaz.adres}</p>
                  {(montaz as any).czyZmianaAdresu && (
                    <Badge variant="outline" className="mt-1">Zmieniony przez montażystę</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status montażu */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                📊 Status montażu
                {getStatusBadge(montaz.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Postęp:</span>
                  <span>{getProgress(montaz.status)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgress(montaz.status)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Nowy</span>
                  <span>W trakcie</span>
                  <span>Zakończony</span>
                </div>
              </div>

              {/* Zmiana statusu */}
              <div className="flex items-center gap-2">
                <Select value={newStatus} onValueChange={(value: MontazStatus) => setNewStatus(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NOWY">Nowy</SelectItem>
                    <SelectItem value="W_TRAKCIE">W trakcie</SelectItem>
                    <SelectItem value="ZAKONCZONY">Zakończony</SelectItem>
                  </SelectContent>
                </Select>
                {newStatus !== montaz.status && (
                  <Button onClick={updateStatus} disabled={isUpdating} size="sm">
                    {isUpdating ? 'Zapisuję...' : 'Zapisz status'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Szczegóły techniczne */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                🔧 Szczegóły techniczne
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {montaz.pomiarM2 && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Pomiar:</span>
                    <p>{montaz.pomiarM2} m² 
                      {montaz.procentDocinki && ` (+${montaz.procentDocinki}% docinki)`}
                    </p>
                  </div>
                )}
                
                {montaz.terminMontazu && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Termin montażu:</span>
                    <p>{formatDate(montaz.terminMontazu)}</p>
                  </div>
                )}
                
                {(montaz.terminDostawy || montaz.dniPrzedMontazem) && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Dostawa:</span>
                    <p>
                      {montaz.terminDostawy 
                        ? formatDate(montaz.terminDostawy)
                        : `${montaz.dniPrzedMontazem} dni przed montażem`
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Model panela */}
              {(montaz as any).nowyModelPanela && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Model panela:</span>
                  <p>{(montaz as any).nowyModelPanela}</p>
                  {(montaz as any).czyZmianaModelu && (
                    <div className="mt-2">
                      <Badge variant="outline">Zmieniony przez montażystę</Badge>
                      {(montaz as any).historiaZmianModelu && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-muted-foreground">
                            Historia zmian
                          </summary>
                          <p className="text-sm mt-1 p-2 bg-muted rounded">{(montaz as any).historiaZmianModelu}</p>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              )}

              {montaz.warunekWnoszenia && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Warunki wnoszenia:</span>
                  <p>{montaz.warunekWnoszenia}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Potwierdzenia */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                ✅ Potwierdzenia klienta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Adres:</span>
                  {(montaz as any).potwierdzaAdres ? (
                    <Badge variant="outline" className="border-green-500 text-green-600">✓ Potwierdzone</Badge>
                  ) : (
                    <Badge variant="secondary">Nie potwierdzone</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Model panela:</span>
                  {(montaz as any).potwierdzaPanel ? (
                    <Badge variant="outline" className="border-green-500 text-green-600">✓ Potwierdzone</Badge>
                  ) : (
                    <Badge variant="secondary">Nie potwierdzone</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notatki */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                📝 Notatki
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {montaz.notatkaPrimepodloga && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Notatki Primepodloga:</span>
                  <p className="text-sm p-2 bg-muted rounded mt-1">{montaz.notatkaPrimepodloga}</p>
                </div>
              )}
              
              <div>
                <span className="text-sm font-medium text-muted-foreground">Notatki Montażysty:</span>
                <Textarea
                  value={notatkiMontazysty}
                  onChange={(e) => setNotatkiMontazysty(e.target.value)}
                  placeholder="Dodaj notatki montażysty..."
                  className="mt-1"
                  rows={3}
                />
                {notatkiMontazysty !== ((montaz as any).notatkiMontazysty || '') && (
                  <Button 
                    onClick={updateNotes} 
                    disabled={isUpdating} 
                    size="sm" 
                    className="mt-2"
                  >
                    {isUpdating ? 'Zapisuję...' : 'Zapisz notatki'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Przyciski akcji */}
          <div className="flex flex-wrap gap-2">
            <Button variant="default" onClick={() => onOpenChange(false)}>
              Zamknij
            </Button>
            <Button variant="outline" disabled>
              📝 Edytuj pomiar
            </Button>
            <Button variant="outline" disabled>
              📄 Eksportuj PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}