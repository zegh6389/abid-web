import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db/client';
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/lib/auth/session';

export async function GET() {
  const cookieStore = cookies();
  const raw = cookieStore.get(getAdminSessionCookieName())?.value;
  const payload = await verifyAdminSessionCookieValue(raw);
  if (!payload) return NextResponse.json({ ok: false, user: null }, { status: 401 });

  const now = Math.floor(Date.now() / 1000);
  const ttl = Math.max(0, payload.exp - now);

  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ ok: true, user: { id: payload.userId, role: payload.role, email: null }, ttl });
    }
    const user = await db.user.findUnique({ where: { id: payload.userId }, select: { id: true, email: true, role: true, name: true } });
    if (!user) return NextResponse.json({ ok: true, user: { id: payload.userId, role: payload.role, email: null }, ttl });
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: String(user.role), name: user.name ?? null }, ttl });
  } catch {
    return NextResponse.json({ ok: true, user: { id: payload.userId, role: payload.role, email: null }, ttl });
  }
}
