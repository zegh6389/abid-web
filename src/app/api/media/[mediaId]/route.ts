import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { cookies } from 'next/headers';
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/lib/auth/session';
import { UpdateMediaSchema } from '@/lib/validation/product';

export async function PATCH(req: Request, { params }: { params: { mediaId: string } }) {
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (String(session.role) !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  const body = await req.json();
  try {
    const media = await db.media.findUnique({ where: { id: params.mediaId } });
    if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const parsed = UpdateMediaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });
    }
    const data: any = { ...parsed.data };

    if (data.isPrimary === true) {
      await db.$transaction([
        db.media.updateMany({ where: { variantId: media.variantId || undefined }, data: { isPrimary: false } }),
        db.media.update({ where: { id: params.mediaId }, data: { ...data, isPrimary: true } }),
      ] as any);
      const updated = await db.media.findUnique({ where: { id: params.mediaId } });
      return NextResponse.json({ media: updated });
    }

  const updated = await db.media.update({ where: { id: params.mediaId }, data });
    return NextResponse.json({ media: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { mediaId: string } }) {
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionCookieValue(raw);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (String(session.role) !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  try {
    await db.media.delete({ where: { id: params.mediaId } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 400 });
  }
}


