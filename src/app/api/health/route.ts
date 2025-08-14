import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';

// Liveness: always 200. Deep check (DB) only when ?db=1 is passed.
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const doDbCheck = url.searchParams.get('db') === '1';

    if (!doDbCheck) {
      return NextResponse.json({ ok: true, db: 'skipped' });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ ok: false, prisma: false, db: false, error: 'Prisma client not generated' }, { status: 500 });
    }

    // Try a trivial query; on Postgres this should succeed if reachable.
    await (db as any).$queryRaw`SELECT 1`;

    return NextResponse.json({ ok: true, db: true });
  } catch (err: any) {
    const code = err?.code ?? err?.name ?? 'UNKNOWN_ERROR';
    const message = err?.message ?? String(err);
    return NextResponse.json({ ok: false, error: { code, message } }, { status: 500 });
  }
}
