import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { cookies } from 'next/headers';
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/lib/auth/session';
import { UpdateProductSchema } from '@/lib/validation/product';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  if (!db) return NextResponse.json({ product: null }, { status: 503 });
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { variants: { include: { inventory: true, media: true } }, attributes: true, reviews: true }
  });
  if (!product) return NextResponse.json({ product: null }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  try {
    const parsed = UpdateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });
    }
    const data: any = { ...parsed.data };
    if (Array.isArray(data.tags)) data.tags = data.tags.filter(Boolean);
    const updated = await db.product.update({ where: { id: params.id }, data });
    return NextResponse.json({ product: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (String(session.role) !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  try {
  await db.$transaction(async (tx: any) => {
      // Delete attributes, reviews, collection links, media, inventory, variants then product
      await tx.attribute.deleteMany({ where: { productId: params.id } });
      await tx.review.deleteMany({ where: { productId: params.id } });
      await tx.collectionOnProduct.deleteMany({ where: { productId: params.id } });
  const variants: Array<{ id: string }> = await tx.variant.findMany({ where: { productId: params.id }, select: { id: true } });
  const variantIds = variants.map((v: { id: string }) => v.id);
      if (variantIds.length) {
        await tx.media.deleteMany({ where: { variantId: { in: variantIds } } });
        await tx.inventory.deleteMany({ where: { variantId: { in: variantIds } } });
        await tx.variant.deleteMany({ where: { id: { in: variantIds } } });
      }
      await tx.product.delete({ where: { id: params.id } });
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 400 });
  }
}
