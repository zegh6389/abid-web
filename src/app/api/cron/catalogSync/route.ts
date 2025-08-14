import runCatalogSync from '@/lib/jobs/catalogSync';

export async function GET() {
  await runCatalogSync();
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
}
