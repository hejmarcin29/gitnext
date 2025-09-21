'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Wylogowanie nie powiodło się');
      }

      router.replace('/login');
    } catch (error) {
      toast.error('Błąd wylogowania');
      console.error('Logout error:', error);
    }
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
    >
      Wyloguj
    </Button>
  );
}