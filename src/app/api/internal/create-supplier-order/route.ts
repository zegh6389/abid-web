import { getDb } from '@/lib/db/client';
import { SupplierRegistry } from '@/lib/suppliers';

export async function POST(req: Request) {
  const prisma = await getDb();
  if (!prisma) return new Response(JSON.stringify({ error: 'db' }), { status: 500 });
  const { orderId } = await req.json();
  if (!orderId) return new Response(JSON.stringify({ error: 'orderId required' }), { status: 400 });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });

  // Group items by supplierId
  const groups = new Map<string, typeof order.items>();
  for (const item of order.items) {
    const sid = (item as any).supplierId as string | null;
    if (!sid) continue; // items without supplier are ignored
    if (!groups.has(sid)) groups.set(sid, [] as any);
    (groups.get(sid) as any[]).push(item);
  }

  const results: any[] = [];
  for (const [supplierType, items] of groups.entries()) {
    const adapter = SupplierRegistry[supplierType as keyof typeof SupplierRegistry];
    if (!adapter) continue;
    const payload = {
      orderId: order.id,
      currency: order.currency,
      email: order.email ?? undefined,
      name: order.name ?? undefined,
      address: {
        line1: order.addressLine1 || '',
        line2: order.addressLine2 || undefined,
        city: order.city || '',
        state: order.state || undefined,
        postalCode: order.postalCode || undefined,
      },
  items: items.map((i: any) => ({
        supplierSku: (i as any).supplierSku as string,
        quantity: i.quantity,
        title: i.title,
      })),
    } as const;
    const placed = await adapter.placeOrder(payload as any);
    // Create Supplier + SupplierOrder records
    const supplier = await prisma.supplier.upsert({
      where: { name: supplierType },
      update: {},
      create: { name: supplierType, type: supplierType as any, authJson: {} },
    });
    await prisma.supplierOrder.create({
      data: {
        order: { connect: { id: order.id } },
        supplier: { connect: { id: supplier.id } },
        supplierOrderId: placed.supplierOrderId,
        status: placed.status as any,
      },
    });
    results.push({ supplierType, supplierOrderId: placed.supplierOrderId });
  }

  return new Response(JSON.stringify({ ok: true, results }), { headers: { 'content-type': 'application/json' } });
}
