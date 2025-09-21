'use client';

import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Wystąpił błąd</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Przepraszamy, wystąpił nieoczekiwany błąd podczas przetwarzania żądania.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={reset}>Spróbuj ponownie</Button>
        </CardFooter>
      </Card>
    </main>
  );
}