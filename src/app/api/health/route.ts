import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';

// Simple health check to verify Prisma client loads and DB is reachable.
export async function GET() {
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ ok: false, prisma: false, db: false, error: 'Prisma client not generated' }, { status: 500 });
    }

    // Try a trivial query; on Postgres this should succeed if reachable.
    await (db as any).$queryRaw`SELECT 1`;

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const code = err?.code ?? err?.name ?? 'UNKNOWN_ERROR';
    const message = err?.message ?? String(err);
    return NextResponse.json({ ok: false, error: { code, message } }, { status: 500 });
  }
}
