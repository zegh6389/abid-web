import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export default async function ToggleDbOffPage() {
  const appCwd = process.cwd();
  const target = path.join(appCwd, '..', 'testsprite_tests', 'tmp', 'DB_OFF');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, '');
  return (
    <pre>
      {JSON.stringify({ ok: true, path: target }, null, 2)}
    </pre>
  );
}
