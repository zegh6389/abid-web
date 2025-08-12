import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

function loadEnv() {
  const cwd = process.cwd();
  const envLocalPath = path.join(cwd, '.env.local');
  if (fs.existsSync(envLocalPath)) dotenv.config({ path: envLocalPath });
  dotenv.config();
}

function toUrlParts(urlString) {
  const u = new URL(urlString);
  return {
    protocol: u.protocol,
    username: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    host: u.hostname,
    port: u.port || '5432',
    db: u.pathname.replace(/^\//, '') || 'postgres',
    search: u.search || ''
  };
}

function makeUrl({ protocol, username, password, host, port, db, search }) {
  const auth = `${encodeURIComponent(username)}:${encodeURIComponent(password)}`;
  return `${protocol}//${auth}@${host}:${port}/${db}${search}`;
}

async function main() {
  loadEnv();
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }
  const parts = toUrlParts(raw);
  const targetDb = (parts.db === 'DBNAME' || parts.db === '' || parts.db === 'postgres') ? 'shop' : parts.db;
  const urlPostgres = makeUrl({ ...parts, db: 'postgres' });
  const prisma = new PrismaClient({ datasources: { db: { url: urlPostgres } } });
  try {
    const rows = await prisma.$queryRaw`SELECT 1 FROM pg_database WHERE datname = ${targetDb}`;
    const exists = Array.isArray(rows) && rows.length > 0;
    if (exists) {
      console.log(`Database "${targetDb}" already exists.`);
    } else {
      // Use pg client to run CREATE DATABASE outside a transaction
      const urlObj = new URL(urlPostgres);
      const client = new pg.Client({
        host: urlObj.hostname,
        port: Number(urlObj.port || '5432'),
        user: decodeURIComponent(urlObj.username),
        password: decodeURIComponent(urlObj.password),
        database: 'postgres',
        ssl: { rejectUnauthorized: false }
      });
      await client.connect();
      try {
        await client.query(`CREATE DATABASE "${targetDb}" WITH TEMPLATE=template0 ENCODING 'UTF8'`);
        console.log(`Database "${targetDb}" created.`);
      } finally {
        await client.end();
      }
    }
  } catch (err) {
    console.error('Create DB failed:', err?.message || err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
