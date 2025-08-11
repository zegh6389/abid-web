import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { verifyPassword } from '@/lib/auth/password';
import { hashPassword } from '@/lib/auth/password';
import { createAdminSessionCookieValue, getAdminSessionCookieName, getAdminSessionCookieOptions } from '@/lib/auth/session';
import { LoginSchema } from '@/lib/validation/auth';
import { rateLimit } from '@/lib/utils/rateLimit';

export async function POST(req: Request) {
  // Simple per-IP rate limit 10 requests / 5 minutes
  const ip = (req.headers as any).get?.('x-forwarded-for') || '';
  const key = `login:${Array.isArray(ip) ? ip[0] : ip || 'local'}`;
  const rl = rateLimit(key, 10, 5 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, code: 'RATE_LIMITED', error: 'Too many attempts, please wait.' }, { status: 429 });
  }

  const body = await req.json();
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });
  const { email, password } = parsed.data;
  const db = await getDb();
  if (!db) return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 500 });
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
  // Verify hashed passwords (bcrypt). If not a recognizable hash, allow one-time upgrade from plaintext.
  let ok = await verifyPassword(user.password, password);
  if (!ok) {
    const looksHashed = user.password.startsWith('$'); // bcrypt/argon style hashes start with '$'
    if (!looksHashed && user.password === password) {
      const newHash = await hashPassword(password);
      await db.user.update({ where: { id: user.id }, data: { password: newHash } });
      ok = true;
    }
  }
  if (!ok) return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });

  const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  const cookieValue = await createAdminSessionCookieValue(user.id, String(user.role));
  res.cookies.set(getAdminSessionCookieName(), cookieValue, getAdminSessionCookieOptions());
  return res;
}
