import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { CjAdapter } from '../lib/suppliers/cj';

// Prefer .env.local if present, else fallback to .env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config();
}

async function main() {
  const clientId = process.env.CJ_CLIENT_ID || '';
  const secret = process.env.CJ_SECRET || '';
  if (!clientId || !secret) {
    console.error('CJ_CLIENT_ID or CJ_SECRET missing in env');
    process.exit(1);
  }
  const adapter = new CjAdapter(clientId, secret);
  try {
    const res = await adapter.listProducts('1');
    console.log(JSON.stringify({ ok: true, count: res.items.length, nextPageToken: res.nextPageToken }, null, 2));
  } catch (e: any) {
    console.error('CJ test error:', e?.message || e);
    process.exit(1);
  }
}

main();
