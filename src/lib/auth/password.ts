import bcrypt from 'bcryptjs';

/**
 * Hash a plaintext password using Argon2id with safe defaults.
 */
export async function hashPassword(plain: string): Promise<string> {
  if (!plain) throw new Error('Password required');
  return bcrypt.hash(plain, 10);
}

/**
 * Verify a plaintext password against an Argon2 hash.
 */
export async function verifyPassword(hashStr: string, plain: string): Promise<boolean> {
  if (!hashStr || !plain) return false;
  try {
  return await bcrypt.compare(plain, hashStr);
  } catch {
    return false;
  }
}
