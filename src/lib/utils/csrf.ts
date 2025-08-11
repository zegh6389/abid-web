import { cookies } from 'next/headers';

export function getCsrfCookieName() {
  return 'csrfToken';
}

export function shouldEnforceCsrf() {
  return process.env.ENABLE_CSRF === '1';
}

export function verifyCsrf(req: Request) {
  if (!shouldEnforceCsrf()) return true;
  try {
    const headerToken = req.headers.get('x-csrf-token') || req.headers.get('X-CSRF-Token');
    if (!headerToken) return false;
    const cookieToken = cookies().get(getCsrfCookieName())?.value;
    if (!cookieToken) return false;
    return headerToken === cookieToken;
  } catch {
    return false;
  }
}
