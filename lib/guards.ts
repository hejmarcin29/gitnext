import { redirect } from 'next/navigation';
import { currentUser } from './currentUser';

export async function requireAdmin() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  if (user.role !== 'ADMIN') {
    // Wybrałem redirect zamiast 403, bo lepsze UX:
    // - użytkownik od razu trafia gdzie powinien
    // - nie pokazujemy zbędnego błędu
    // - logika spójna z requireAuth()
    redirect('/panel-montazysty');
  }
  
  return user;
}