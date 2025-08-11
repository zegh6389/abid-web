'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db/client';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import { createAdminSessionCookieValue, getAdminSessionCookieName, getAdminSessionCookieOptions } from '@/lib/auth/session';

export async function login(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const db = await getDb();
  if (!db) redirect(`/admin/login?error=${encodeURIComponent('Database unavailable')}`);
  const user = await db.user.findUnique({ where: { email } });
  if (!user) redirect(`/admin/login?error=${encodeURIComponent('Invalid credentials')}`);
  let ok = await verifyPassword(user.password, password);
  if (!ok) {
    const looksHashed = user.password.startsWith('$');
    if (!looksHashed && user.password === password) {
      const newHash = await hashPassword(password);
      await db.user.update({ where: { id: user.id }, data: { password: newHash } });
      ok = true;
    }
  }
  if (!ok) redirect(`/admin/login?error=${encodeURIComponent('Invalid credentials')}`);
  const cookieValue = await createAdminSessionCookieValue(user.id, String(user.role));
  cookies().set(getAdminSessionCookieName(), cookieValue, getAdminSessionCookieOptions());
  redirect('/admin/products');
}


