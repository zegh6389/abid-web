import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

function writeSentinel() {
  const appCwd = process.cwd();
  const target = path.join(appCwd, '..', 'testsprite_tests', 'tmp', 'DB_OFF');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, '');
  return NextResponse.json({ ok: true, path: target });
}

export async function POST() {
  return writeSentinel();
}

export async function GET() {
  return writeSentinel();
}

export const dynamic = 'force-dynamic';
