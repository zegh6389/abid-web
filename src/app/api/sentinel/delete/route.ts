import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

function deleteSentinel() {
  const appCwd = process.cwd();
  const target = path.join(appCwd, '..', 'testsprite_tests', 'tmp', 'DB_OFF');
  if (fs.existsSync(target)) fs.unlinkSync(target);
  return NextResponse.json({ ok: true, path: target });
}

export async function GET() {
  return deleteSentinel();
}

export async function POST() {
  return deleteSentinel();
}

export const dynamic = 'force-dynamic';
