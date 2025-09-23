import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/currentUser';

export default async function Page() {
  const user = await currentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }
  redirect('/panel-admin?tab=clients');
}
