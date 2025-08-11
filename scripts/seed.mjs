import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcryptjs';

async function main() {
  // Seed an initial admin user if not exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hash = await bcrypt.hash(adminPass, 10);
    await prisma.user.create({ data: { email: adminEmail, password: hash, role: 'ADMIN', name: 'Admin' } });
    console.log('Seeded admin user:', adminEmail);
  }
  // Upsert a sample product with one variant
  const p = await prisma.product.upsert({
    where: { slug: 'sample-tee' },
    update: {},
    create: {
      slug: 'sample-tee',
      title: 'Sample Tee',
      description: 'Soft cotton tee',
      variants: {
        create: {
          sku: 'SKU-SAMPLE-TEE',
          price: 19.99,
          inventory: { create: { stock: 25 } },
        },
      },
    },
    include: { variants: { include: { inventory: true } } },
  });
  console.log('Seeded:', p.slug);
}

main().catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
