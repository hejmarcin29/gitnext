'use client';

import { useEffect, useState } from 'react';
import { AddKlientDialog } from '@/components/klienci/AddKlientDialog';
import { KlienciTable } from '@/components/klienci/KlienciTable';

export type KlientRow = {
  id: number;
  imie: string;
  nazwisko: string;
  telefon: string;
  miasto: string;
  adresFaktury: string;
  rodzajWspolpracy: 'DOSTAWA' | 'MONTAZ';
  createdAt: string;
};

export function ClientsTab() {
  const [klienci, setKlienci] = useState<KlientRow[]>([]);

  const reload = async () => {
    const res = await fetch('/api/klienci');
    if (res.ok) {
      const data = await res.json();
      setKlienci(data);
    }
  };

  useEffect(() => {
    reload().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Lista klientów</h2>
        <AddKlientDialog onAdded={reload} />
      </div>
      <KlienciTable rows={klienci} />
    </div>
  );
}
