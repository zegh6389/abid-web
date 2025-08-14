// BullMQ worker that processes supplier jobs
// Run with: npm run queue:worker
import { SupplierRegistry } from '../suppliers';
import { getDb } from '../db/client';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Worker } = require('bullmq');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const IORedis = require('ioredis');

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  // eslint-disable-next-line no-console
  console.error('REDIS_URL not set; worker will not start');
} else {
  const connection = new IORedis(redisUrl);
  // eslint-disable-next-line no-new
  new Worker('supplier', async (job: any) => {
    const prisma = await getDb();
    if (!prisma) throw new Error('DB not initialized');
    if (job.name === 'placeOrder') {
      const { supplierType, payload } = job.data as { supplierType: string; payload: any };
      const adapter = SupplierRegistry[supplierType as keyof typeof SupplierRegistry];
      if (!adapter) throw new Error(`No adapter for ${supplierType}`);
      const placed = await adapter.placeOrder(payload);
      const supplier = await prisma.supplier.upsert({
        where: { name: supplierType },
        update: {},
        create: { name: supplierType, type: supplierType as any, authJson: {} },
      });
      await prisma.supplierOrder.upsert({
        where: { orderId: payload.orderId },
        update: {
          supplierOrderId: placed.supplierOrderId,
          status: placed.status as any,
          lastSync: new Date(),
        },
        create: {
          order: { connect: { id: payload.orderId } },
          supplier: { connect: { id: supplier.id } },
          supplierOrderId: placed.supplierOrderId,
          status: placed.status as any,
        },
      });
      return placed;
    }
    return null;
  }, { connection });
}
