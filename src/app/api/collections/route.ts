import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { cookies } from 'next/headers';
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/lib/auth/session';
import { CreateCollectionSchema } from '@/lib/validation/collection';
import { verifyCsrf } from '@/lib/utils/csrf';

export async function GET() {
  const db = await getDb();
  if (!db) return NextResponse.json({ collections: [] });
  const collections = await db.collection.findMany({ orderBy: { title: 'asc' } });
  return NextResponse.json({ collections });
}

export async function POST(req: Request) {
  if (!verifyCsrf(req)) return NextResponse.json({ error: 'invalid_csrf' }, { status: 403 });
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (String(session.role) !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const body = await req.json();
  const parsed = CreateCollectionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  const { slug, title, desc } = parsed.data;
  const created = await db.collection.create({ data: { slug, title, desc } });
  return NextResponse.json({ collection: created });
}
