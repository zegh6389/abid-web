// Cross-runtime admin session signing and verification.
// Works in both Node (route handlers) and Edge (middleware) by switching between
// Web Crypto (crypto.subtle) and Node's crypto as available.

export type AdminSessionPayload = {
  userId: string;
  role: string;
  exp: number; // epoch seconds
};

const SESSION_COOKIE_NAME = 'admin_session';
const DEFAULT_TTL_SECONDS = 60 * 60 * 4; // 4 hours

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    // Fallback for local dev; strongly recommend setting ADMIN_SESSION_SECRET in env
    return 'development-insecure-secret-change-me';
  }
  return secret;
}

function base64UrlEncode(input: string): string {
  // Prefer Buffer when available (Node), else use btoa for edge/web.
  // The input here is ASCII JSON; safe for btoa
  // Convert to base64 then make URL-safe
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(input, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }
  // @ts-ignore - btoa may exist in edge runtime
  const b64 = btoa(input);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecodeToString(b64url: string): string {
  const withPad = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (withPad.length % 4)) % 4;
  const padded = withPad + '='.repeat(padLen);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(padded, 'base64').toString('utf8');
  }
  // @ts-ignore - atob may exist in edge runtime
  return atob(padded);
}

function toHex(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let out = '';
  for (let i = 0; i < view.length; i += 1) {
    const h = view[i].toString(16).padStart(2, '0');
    out += h;
  }
  return out;
}

async function hmacSha256Hex(key: string, data: string): Promise<string> {
  // Use Web Crypto when available (edge/middleware), fall back to Node crypto
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (globalThis.crypto && globalThis.crypto.subtle) {
    const enc = new TextEncoder();
    const cryptoKey = await globalThis.crypto.subtle.importKey(
      'raw',
      enc.encode(key),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await globalThis.crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data));
    return toHex(sig);
  }
  // Node path
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const nodeCrypto: typeof import('node:crypto') = await import('node:crypto');
  return nodeCrypto.createHmac('sha256', key).update(data, 'utf8').digest('hex');
}

function nowEpochSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export function getAdminSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export async function createAdminSessionCookieValue(
  userId: string,
  role: string,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<string> {
  const payload: AdminSessionPayload = {
    userId,
    role,
    exp: nowEpochSeconds() + Math.max(60, Math.floor(ttlSeconds)),
  };
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(payloadStr);
  const secret = getSessionSecret();
  const sigHex = await hmacSha256Hex(secret, payloadB64);
  return `v1.${payloadB64}.${sigHex}`;
}

export async function verifyAdminSessionCookieValue(value: string | undefined | null): Promise<AdminSessionPayload | null> {
  if (!value) return null;
  if (!value.startsWith('v1.')) return null;
  const parts = value.split('.');
  if (parts.length !== 3) return null;
  const payloadB64 = parts[1];
  const sigHex = parts[2];
  const expectedSig = await hmacSha256Hex(getSessionSecret(), payloadB64);
  if (sigHex !== expectedSig) return null;
  try {
    const payloadStr = base64UrlDecodeToString(payloadB64);
    const payload = JSON.parse(payloadStr) as AdminSessionPayload;
    if (!payload?.userId || !payload?.role || !payload?.exp) return null;
    if (payload.exp < nowEpochSeconds()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getAdminSessionCookieOptions(): {
  httpOnly: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  secure: boolean;
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DEFAULT_TTL_SECONDS,
  };
}


