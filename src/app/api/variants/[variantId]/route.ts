import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { cookies } from 'next/headers';
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/lib/auth/session';
import { UpdateVariantSchema } from '@/lib/validation/product';

export async function PATCH(req: Request, { params }: { params: { variantId: string } }) {
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (String(session.role) !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  const body = await req.json();
  try {
    const parsed = UpdateVariantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });
    }
    const updated = await db.variant.update({ where: { id: params.variantId }, data: parsed.data });
    if ('stock' in parsed.data) {
      await db.inventory.upsert({
        where: { variantId: params.variantId },
        update: { stock: Number(parsed.data.stock) || 0 },
        create: { variantId: params.variantId, stock: Number(parsed.data.stock) || 0 }
      });
    }
    return NextResponse.json({ variant: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { variantId: string } }) {
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (String(session.role) !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  try {
    await db.$transaction(async (tx: any) => {
      await tx.media.deleteMany({ where: { variantId: params.variantId } });
      await tx.inventory.deleteMany({ where: { variantId: params.variantId } });
      await tx.variant.delete({ where: { id: params.variantId } });
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 400 });
  }
}
