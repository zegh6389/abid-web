import { getDb } from '@/lib/db/client';

export async function POST(req: Request) {
  const prisma = await getDb();
  if (!prisma) return new Response(JSON.stringify({ error: 'db' }), { status: 500 });

  // In a real impl, verify HMAC using SPOCKET_WEBHOOK_SECRET
  const body = await req.json();
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
