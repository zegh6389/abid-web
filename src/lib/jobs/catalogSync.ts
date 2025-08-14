import { SupplierRegistry } from '../suppliers';
import { getDb } from '../db/client';

export default async function runCatalogSync() {
  const prisma = await getDb();
  if (!prisma) throw new Error('DB not initialized');

  for (const [key, adapter] of Object.entries(SupplierRegistry)) {
    let pageToken: string | undefined = undefined;
    do {
      const { items, nextPageToken } = await adapter.listProducts(pageToken);
      for (const p of items) {
        await prisma.supplierProduct.upsert({
          where: {
            // for upsert unique, we need an id; use composite search with findFirst then update or create
            // using upsert via composite unique would be better; fallback:
            id: await (async () => {
              const existing = await prisma.supplierProduct.findFirst({
                where: { supplier: { type: key as any }, supplierSku: p.supplierSku },
                select: { id: true },
              });
              return existing?.id ?? 'new';
            })(),
          } as any,
          update: {
            quantity: p.quantity,
            lastSync: new Date(),
          },
          create: {
            supplier: {
              connectOrCreate: {
                where: { name: key },
                create: { name: key, type: key as any, authJson: {} },
              },
            },
            supplierSku: p.supplierSku,
            cost: (p.cost ?? p.price) as any,
            quantity: p.quantity,
            lastSync: new Date(),
          },
        } as any);
      }
      pageToken = nextPageToken ?? undefined;
    } while (pageToken);
  }
}

// Allow running directly as a script (node -r tsx)
if (require.main === module) {
  runCatalogSync().then(() => {
    // eslint-disable-next-line no-console
    console.log('Catalog sync completed');
    process.exit(0);
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Catalog sync failed', err);
    process.exit(1);
  });
}
