import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>404 - Nie znaleziono</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Przepraszamy, ale strona której szukasz nie istnieje.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button>Wróć do strony głównej</Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}