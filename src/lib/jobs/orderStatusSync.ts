import { SupplierRegistry } from '../suppliers';
import { getDb } from '../db/client';

export default async function runOrderStatusSync() {
  const prisma = await getDb();
  if (!prisma) throw new Error('DB not initialized');

  const pending = await prisma.supplierOrder.findMany({
    where: { status: { in: ['PLACED', 'ACCEPTED'] as any } },
    take: 200,
  });

  for (const so of pending) {
    const supplier = await prisma.supplier.findUnique({ where: { id: so.supplierId } });
    if (!supplier) continue;
    const adapter = SupplierRegistry[supplier.type as keyof typeof SupplierRegistry];
    if (!adapter) continue;
    const status = await adapter.getOrderStatus(so.supplierOrderId);
    await prisma.supplierOrder.update({
      where: { id: so.id },
      data: {
        status: status.status as any,
        trackingNumber: status.trackingNumber,
        carrier: status.carrier,
        lastSync: new Date(),
      },
    });
  }
}
