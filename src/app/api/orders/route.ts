import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { CreateOrderSchema } from '@/lib/validation/order';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(100, Number(searchParams.get('limit') || 50));
  const db = await getDb();
  if (!db) return NextResponse.json({ orders: [] });
  const orders = await db.order.findMany({ orderBy: { createdAt: 'desc' }, take: limit, include: { items: true, payments: true } });
  return NextResponse.json({ orders });
}

// Create order with items and a pending payment record
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parse = CreateOrderSchema.safeParse(json);
    if (!parse.success) {
      return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parse.error.flatten() }, { status: 400 });
    }
    const { items, total, currency, email, name, address, provider } = parse.data;
    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
    const order = await db.order.create({
      data: {
        total,
        currency,
        email: email || null,
        name: name || null,
        addressLine1: address?.line1 || null,
        addressLine2: address?.line2 || null,
        city: address?.city || null,
        state: address?.state || null,
        postalCode: address?.postalCode || null,
        items: {
          create: items.map((it: any) => ({
            productId: it.productId || null,
            variantId: it.variantId || null,
            title: it.title,
            quantity: Number(it.quantity) || 1,
            price: Number(it.price) || 0,
            image: it.image || null,
          })),
        },
        payments: {
          create: {
            provider: provider || 'card',
            status: 'REQUIRES_CONFIRMATION',
            amount: Number(total) || 0,
            currency,
          },
        },
      },
      include: { items: true, payments: true },
    });
    return NextResponse.json({ ok: true, order });
  } catch (e: any) {
    return NextResponse.json({ ok: false, code: 'ERROR', error: e?.message ?? 'Error' }, { status: 400 });
  }
}


