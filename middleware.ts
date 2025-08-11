import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/lib/auth/session';
import { getCsrfCookieName, shouldEnforceCsrf } from '@/lib/utils/csrf';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const cookieName = getAdminSessionCookieName();
    const raw = req.cookies.get(cookieName)?.value;
    const session = await verifyAdminSessionCookieValue(raw);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    // Set CSRF cookie on admin pages when enabled
    if (shouldEnforceCsrf()) {
      const res = NextResponse.next();
      const existing = req.cookies.get(getCsrfCookieName())?.value;
      const token = existing || cryptoRandomToken();
      if (!existing) res.cookies.set(getCsrfCookieName(), token, { path: '/', httpOnly: false, sameSite: 'lax' });
      return res;
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };

function cryptoRandomToken() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}
