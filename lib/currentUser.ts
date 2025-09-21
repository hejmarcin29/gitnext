import { getSession } from './session';
import type { User } from '@prisma/client';

export async function currentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user || null;
}