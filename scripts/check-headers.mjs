import http from 'node:http';

const endpoints = ['/', '/kids', '/api/products', '/api/admin/login'];
const required = {
  'x-frame-options': 'SAMEORIGIN',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()'
};

function check(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const headers = Object.fromEntries(Object.entries(res.headers).map(([k, v]) => [k.toLowerCase(), Array.isArray(v) ? v.join(', ') : String(v)]));
      const results = [];
      for (const [k, v] of Object.entries(required)) {
        const ok = headers[k] === v;
        results.push({ header: k, expected: v, actual: headers[k] ?? null, ok });
      }
      resolve({ url, status: res.statusCode, results });
    }).on('error', reject);
  });
}

const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
const all = await Promise.all(endpoints.map((p) => check(base + p)));
let pass = true;
for (const item of all) {
  for (const r of item.results) {
    if (!r.ok) pass = false;
  }
}
console.log(JSON.stringify({ base, pass, checks: all }, null, 2));
process.exit(pass ? 0 : 1);
