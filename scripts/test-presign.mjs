import crypto from 'node:crypto';
import dotenv from 'dotenv';

function loadEnv() {
  dotenv.config({ path: '.env.local', override: true });
  dotenv.config({ override: true });
}

function base64UrlEncode(input) {
  return Buffer.from(input, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'development-insecure-secret-change-me';
}

function nowEpochSeconds() { return Math.floor(Date.now() / 1000); }

function createAdminCookie({ userId = 'admin', role = 'admin', ttlSeconds = 60 * 60 * 4 } = {}) {
  const payload = { userId, role, exp: nowEpochSeconds() + ttlSeconds };
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const sigHex = crypto.createHmac('sha256', getSecret()).update(payloadB64, 'utf8').digest('hex');
  return `v1.${payloadB64}.${sigHex}`;
}

async function main() {
  loadEnv();
  const cookie = createAdminCookie({});
  const key = `healthcheck/presign-${Date.now()}.txt`;
  const contentType = 'text/plain';
  const port = process.env.PORT || '3000';
  const baseUrl = `http://127.0.0.1:${port}`;
  const res = await fetch(`${baseUrl}/api/uploads/presign`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'cookie': `admin_session=${cookie}`,
    },
    body: JSON.stringify({ key, contentType }),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error('Presign failed', res.status, txt);
    process.exit(1);
  }
  const data = await res.json();
  const { url, publicUrl } = data;
  if (!url) {
    console.error('Missing signed url from response:', data);
    process.exit(1);
  }
  const put = await fetch(url, { method: 'PUT', headers: { 'content-type': contentType }, body: 'hello-from-presign-test' });
  if (!put.ok) {
    const txt = await put.text().catch(() => '');
    console.error('PUT failed', put.status, txt);
    process.exit(1);
  }
  console.log('Presign PUT OK ->', publicUrl || '(no publicUrl)');
}

main().catch((e) => { console.error(e); process.exit(1); });
