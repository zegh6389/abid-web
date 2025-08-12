import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

async function main() {
  // Load .env.local first if present, then .env
  const cwd = process.cwd();
  const envLocalPath = path.join(cwd, '.env.local');
  if (fs.existsSync(envLocalPath)) dotenv.config({ path: envLocalPath });
  dotenv.config();

  let url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }
  // If DBNAME placeholder is present, test against the default postgres db
  let usedFallbackDb = false;
  if (url.includes('/DBNAME')) {
    url = url.replace('/DBNAME', '/postgres');
    process.env.DATABASE_URL = url;
    usedFallbackDb = true;
  }
  const prisma = new PrismaClient();
  try {
    // Run a trivial query
    const now = await prisma.$queryRaw`select now()`;
    console.log(`DB connection OK${usedFallbackDb ? ' (using fallback database "postgres")' : ''}:`, now);
  } catch (err) {
    console.error('DB connection failed:', err?.message || err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
