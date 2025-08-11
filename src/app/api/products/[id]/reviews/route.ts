import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { CreateReviewSchema } from '@/lib/validation/review';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  if (!db) return NextResponse.json({ reviews: [] }, { status: 200 });
  const reviews = await db.review.findMany({ where: { productId: params.id }, orderBy: { createdAt: 'desc' }, take: 50 });
  return NextResponse.json({ reviews });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const parsed = CreateReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });
    }
    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
    const { rating, title, body: text } = parsed.data;
    const review = await db.review.create({ data: { productId: params.id, rating, title: title || null, body: text || null } });
    return NextResponse.json({ ok: true, review });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Error' }, { status: 400 });
  }
}
