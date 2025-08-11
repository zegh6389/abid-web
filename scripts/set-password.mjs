import prismaPkg from '@prisma/client';
import bcrypt from 'bcryptjs';

const { PrismaClient } = prismaPkg;

const prisma = new PrismaClient();

async function main() {
  // Support env vars or CLI args: node scripts/set-password.mjs <email> <password>
  const argEmail = process.argv[2];
  const argPassword = process.argv[3];
  const email = process.env.EMAIL || argEmail;
  const password = process.env.PASSWORD || argPassword;
  if (!email || !password) {
    console.error('Usage: EMAIL=.. PASSWORD=.. node scripts/set-password.mjs OR node scripts/set-password.mjs <email> <password>');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, role: 'ADMIN', name: 'Admin' },
    create: { email, password: hash, role: 'ADMIN', name: 'Admin' }
  });
  console.log('Password set for:', user.email);
}

main().catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
