import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { cookies } from 'next/headers';
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/lib/auth/session';
import { UpdateCollectionSchema } from '@/lib/validation/collection';
import { verifyCsrf } from '@/lib/utils/csrf';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  if (!db) return NextResponse.json({ collection: null }, { status: 503 });
  const collection = await db.collection.findUnique({
    where: { id: params.id },
    include: { products: { include: { product: true } } },
  });
  if (!collection) return NextResponse.json({ collection: null }, { status: 404 });
  return NextResponse.json({ collection });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!verifyCsrf(req)) return NextResponse.json({ error: 'invalid_csrf' }, { status: 403 });
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = UpdateCollectionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  const updated = await db.collection.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ collection: updated });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (typeof window === 'undefined') {
    // No request to verify; rely on middleware-set cookie header in Next runtime
  }
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (String(session.role) !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });

  await db.collectionOnProduct.deleteMany({ where: { collectionId: params.id } });
  await db.collection.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
