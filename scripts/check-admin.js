const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({ where: { email: 'admin@primepodloga.pl' } });
    console.log('Admin user:', user ? { id: user.id, email: user.email, role: user.role, isActive: user.isActive } : null);
  } catch (e) {
    console.error('Error checking admin:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
