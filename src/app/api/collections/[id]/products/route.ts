import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { cookies } from 'next/headers';
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/lib/auth/session';
import { AttachProductSchema, DetachProductSchema, ReorderProductSchema } from '@/lib/validation/collection';
import { verifyCsrf } from '@/lib/utils/csrf';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!verifyCsrf(req)) return NextResponse.json({ error: 'invalid_csrf' }, { status: 403 });
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = AttachProductSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  const { productId, position } = parsed.data;
  await db.collectionOnProduct.upsert({
    where: { productId_collectionId: { productId, collectionId: params.id } },
    update: { position: position ?? 0 },
    create: { productId, collectionId: params.id, position: position ?? 0 },
  });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!verifyCsrf(req)) return NextResponse.json({ error: 'invalid_csrf' }, { status: 403 });
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = ReorderProductSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  const { productId, position } = parsed.data;
  await db.collectionOnProduct.update({
    where: { productId_collectionId: { productId, collectionId: params.id } },
    data: { position },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!verifyCsrf(req)) return NextResponse.json({ error: 'invalid_csrf' }, { status: 403 });
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = DetachProductSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  const { productId } = parsed.data;
  await db.collectionOnProduct.delete({ where: { productId_collectionId: { productId, collectionId: params.id } } });
  return NextResponse.json({ ok: true });
}
