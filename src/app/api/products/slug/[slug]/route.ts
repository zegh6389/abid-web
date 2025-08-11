import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const db = await getDb();
  if (!db) return NextResponse.json({ product: null }, { status: 503 });
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: {
      variants: { include: { inventory: true, media: true } },
      attributes: true,
      reviews: true,
    },
  });
  if (!product) return NextResponse.json({ product: null }, { status: 404 });
  return NextResponse.json({ product });
}


