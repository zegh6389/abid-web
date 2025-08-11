import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export async function GET() {
  const appCwd = process.cwd();
  const target = path.join(appCwd, '..', 'testsprite_tests', 'tmp', 'DB_OFF');
  const exists = fs.existsSync(target);
  return NextResponse.json({ ok: true, exists, path: target });
}

export const dynamic = 'force-dynamic';
