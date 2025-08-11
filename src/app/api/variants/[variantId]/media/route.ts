import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { cookies } from 'next/headers';
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/lib/auth/session';
import { z } from 'zod';

const CreateMediaSchema = z.object({
  url: z.string().url('valid url required'),
  alt: z.string().trim().optional().nullable(),
  isPrimary: z.coerce.boolean().optional(),
  type: z.enum(['IMAGE', 'VIDEO', 'SPIN360']).optional(),
});

export async function POST(req: Request, { params }: { params: { variantId: string } }) {
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (String(session.role) !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  const body = await req.json();
  try {
    const parsed = CreateMediaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });
    }
    const m = parsed.data;
    const created = await db.media.create({
      data: {
        variantId: params.variantId,
        url: m.url,
        alt: m.alt || null,
        isPrimary: !!m.isPrimary,
        type: m.type || 'IMAGE'
      }
    });
    return NextResponse.json({ media: created });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 400 });
  }
}
