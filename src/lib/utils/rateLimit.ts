// Simple in-memory rate limiter (per-process). Suitable for dev/tests.
// For production, replace with Redis/Upstash.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    const resetAt = now + windowMs;
    const bucket: Bucket = { count: 1, resetAt };
    buckets.set(key, bucket);
    return { allowed: true, remaining: Math.max(0, limit - 1), resetAt };
  }
  if (b.count < limit) {
    b.count += 1;
    return { allowed: true, remaining: Math.max(0, limit - b.count), resetAt: b.resetAt };
  }
  return { allowed: false, remaining: 0, resetAt: b.resetAt };
}
