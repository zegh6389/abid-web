// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto: any = require('crypto');

export function verifyHmacSha256(rawBody: string, signature: string | undefined, secret: string | undefined) {
  if (!rawBody || !signature || !secret) return false;
  const h = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
  const a = (globalThis as any).Buffer.from(h);
  const b = (globalThis as any).Buffer.from(signature.replace(/^sha256=/, ''), 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
