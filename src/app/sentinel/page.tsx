import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export default async function SentinelPage() {
  const appCwd = process.cwd();
  const target = path.join(appCwd, '..', 'testsprite_tests', 'tmp', 'DB_OFF');
  const exists = fs.existsSync(target);
  return (
    <pre>
      {JSON.stringify({ ok: true, exists, path: target }, null, 2)}
    </pre>
  );
}
