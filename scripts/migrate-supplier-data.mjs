#!/usr/bin/env node
// Placeholder script to migrate/link existing products with suppliers by SKU
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Scanning products to link with SupplierProduct...');
  const sps = await prisma.supplierProduct.findMany({ take: 50 });
  for (const sp of sps) {
    // Implement your matching logic here (by SKU, title, etc.)
    console.log('SupplierProduct', sp.id, sp.supplierSku);
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
