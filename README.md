## PrimePodłoga — B2B panel

Stack: Next.js 15 (App Router), Tailwind v4, shadcn/ui, Prisma + SQLite.

### Uruchomienie

```bash
npm run dev
```

### Logowanie (seed)
- Admin: `admin@primepodloga.pl` / `NoweHaslo123!`

### Moduł Montaży — wyłączony
- Panel montażysty oraz API Montaży są trwale wyłączone. Próby wywołań API `/api/montaze` zwracają 501 Not Implemented.
- Przekierowania prowadzą admina do `/panel-admin`, a użytkowników nie-admin do `/login`.

### Zasady
- Prisma tylko w Node.js runtime. Edge wyłącznie w middleware.ts bez DB i bez cookies.
- W API zawsze explicit `select` i nigdy nie zwracamy `passwordHash`.
