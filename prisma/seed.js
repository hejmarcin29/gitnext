// Seed script to ensure persistent admin account.
const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@primepodloga.pl';
  const defaultPassword = 'admin123'; // dev default; not overwritten if admin exists

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log('Seed: created admin user', adminEmail);
  } else {
    // Ensure role=ADMIN and isActive=true; do NOT change password
    if (existing.role !== 'ADMIN' || existing.isActive === false) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: 'ADMIN', isActive: true },
      });
      console.log('Seed: ensured admin privileges/active for', adminEmail);
    } else {
      console.log('Seed: admin already present and active');
    }
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
