import { NextResponse } from 'next/server';
import { getAdminSessionCookieName } from '@/lib/auth/session';

function clearCookieResponse() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getAdminSessionCookieName(), '', { httpOnly: true, sameSite: 'strict', maxAge: 0, path: '/' });
  return res;
}

export async function POST() {
  // Idempotent logout
  return clearCookieResponse();
}

export async function GET() {
  // Support GET for clients/tests that call logout via GET
  return clearCookieResponse();
}
