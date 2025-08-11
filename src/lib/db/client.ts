// Lazy Prisma client to avoid build errors before `prisma generate` runs
let _db: any;

export async function getDb() {
  if (_db) return _db;
  try {
    const { PrismaClient } = await import('@prisma/client');
    const g = global as any;
    _db = g.prisma || new PrismaClient();
    if (process.env.NODE_ENV !== 'production') g.prisma = _db;
    return _db as InstanceType<typeof PrismaClient>;
  } catch {
    return null as any;
  }
}
