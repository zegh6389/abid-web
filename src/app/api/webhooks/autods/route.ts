import { getDb } from '@/lib/db/client';
import { verifyHmacSha256 } from '@/lib/utils/webhook';

export async function POST(req: Request) {
  const prisma = await getDb();
  if (!prisma) return new Response(JSON.stringify({ error: 'db' }), { status: 500 });
  const raw = await req.text();
  const ok = verifyHmacSha256(raw, (req.headers.get('x-signature') || req.headers.get('x-hub-signature-256') || undefined) as any, process.env.AUTODS_WEBHOOK_SECRET);
  if (!ok) return new Response('unauthorized', { status: 401 });
  const body = JSON.parse(raw || '{}');
  const { supplierOrderId, tracking_number, status, carrier } = body || {};
  if (!supplierOrderId) return new Response(JSON.stringify({ ok: false }), { status: 400 });
  await prisma.supplierOrder.updateMany({
    where: { supplierOrderId },
    data: {
      status: (status || 'SHIPPED') as any,
      trackingNumber: tracking_number ?? undefined,
      carrier: carrier ?? undefined,
      lastSync: new Date(),
    },
  });
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
}
