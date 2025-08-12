import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { cookies } from 'next/headers';
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/lib/auth/session';
import { CreateVariantSchema } from '@/lib/validation/product';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (String(session.role) !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  const body = await req.json();
  try {
    const parsed = CreateVariantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });
    }
    const v = parsed.data;
    const created = await db.variant.create({
      data: {
        productId: params.id,
        sku: v.sku || null,
        optionSize: v.optionSize || null,
        optionColor: v.optionColor || null,
        price: v.price ?? 0,
        compareAt: v.compareAt ?? null,
        salePrice: v.salePrice ?? null,
        saleStart: v.saleStart ?? null,
        saleEnd: v.saleEnd ?? null,
        inventory: v.stock != null ? { create: { stock: Number(v.stock) || 0 } } : undefined
      },
      include: { inventory: true }
    });
    return NextResponse.json({ variant: created });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 400 });
  }
}
