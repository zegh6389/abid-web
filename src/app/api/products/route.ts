import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { CreateProductSchema } from '@/lib/validation/product';
import fs from 'node:fs';
import path from 'node:path';
import { cookies } from 'next/headers';
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/lib/auth/session';

export async function GET(req: Request) {
  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }

  // Parse filters, pagination, and sort
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const fBrand = searchParams.getAll('f_brand');
  const fSize = searchParams.getAll('f_size');
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 24)));
  const skip = (page - 1) * limit;
  const sort = (searchParams.get('sort') || 'createdAt:desc').toLowerCase();

  // Build where clause (brand simple filter; size via variant attribute if available)
  const where: any = {};
  if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }];
  if (fBrand.length) where.brand = { in: fBrand };
  if (fSize.length) {
    where.variants = {
      some: {
        optionSize: { in: fSize }
      }
    };
  }

  const orderBy = (() => {
    const [field, dir] = sort.split(':');
    if (field === 'title') return { title: dir === 'asc' ? 'asc' : 'desc' } as any;
    if (field === 'createdat' || field === 'created_at') return { createdAt: dir === 'asc' ? 'asc' : 'desc' } as any;
    return { createdAt: 'desc' } as any;
  })();

  const [items, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { variants: { include: { media: true, inventory: true } }, collections: true },
    }),
    db.product.count({ where }),
  ]);

  // Simple facets (brand) and size (approximate from variants.optionSize)
  const facetWhere: any = {};
  if (q) facetWhere.OR = [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }];
  if (fBrand.length) facetWhere.brand = { in: fBrand };
  if (fSize.length) {
    where.variants = {
      some: {
        optionSize: { in: fSize }
      }
    };
  }

  const allForFacets = await db.product.findMany({
    where: facetWhere,
    select: { brand: true, variants: { select: { optionSize: true } } },
  });
  const brandCounts = new Map<string, number>();
  const sizeCounts = new Map<string, number>();
  for (const p of allForFacets) {
    if (p.brand) brandCounts.set(p.brand, (brandCounts.get(p.brand) || 0) + 1);
    for (const v of p.variants) {
      if (v.optionSize) sizeCounts.set(v.optionSize, (sizeCounts.get(v.optionSize) || 0) + 1);
    }
  }
  const facets = {
    brand: [...brandCounts.entries()].map(([value, count]) => ({ value, count })),
    size: [...sizeCounts.entries()].map(([value, count]) => ({ value, count })),
  };

  return NextResponse.json({ items, total, page, limit, facets }, { status: 200 });
}

export async function POST(req: Request) {
  // Require admin session
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (String(session.role) !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = await req.json();
  const parsed = CreateProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });
  }
  try {
  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  const { slug, title, subtitle, description } = parsed.data;
  const created = await db.product.create({ data: { slug, title, subtitle, description } });
    return NextResponse.json({ product: created });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 400 });
  }
}
