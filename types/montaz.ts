import type { Montaz, User } from '@prisma/client';

// Typ dla widoku table - tylko podstawowe dane montażysty
export type MontazWithMontazystaBasic = Montaz & {
  montazysta: Pick<User, 'id' | 'email'>;
};

// Typ dla edycji - pełne dane montażysty
export type MontazWithMontazystaFull = Montaz & {
  montazysta: User;
};