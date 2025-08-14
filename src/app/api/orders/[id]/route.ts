import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { UpdateOrderStatusSchema } from '@/lib/validation/order-status';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  if (!db) return NextResponse.json({ order: null }, { status: 503 });
  const order = await db.order.findUnique({ where: { id: params.id }, include: { items: true, payments: true, supplierOrders: true } as any });
  if (!order) return NextResponse.json({ order: null }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  const body = await req.json();
  try {
    const parsed = UpdateOrderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });
    }
    const updated = await db.order.update({ where: { id: params.id }, data: parsed.data, include: { items: true, payments: true } });
    return NextResponse.json({ order: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 400 });
  }
}


