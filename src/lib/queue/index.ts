type PlaceOrderJob = {
  supplierType: string;
  payload: any;
};

let _queue: any;

function getQueue() {
  if (_queue) return _queue;
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;
  // Lazy require to avoid issues if not installed in environments without queue
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Queue } = require('bullmq');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const IORedis = require('ioredis');
  const connection = new IORedis(redisUrl);
  _queue = new Queue('supplier', { connection });
  return _queue;
}

export async function enqueuePlaceOrder(job: PlaceOrderJob) {
  const q = getQueue();
  if (!q) throw new Error('Queue not configured (REDIS_URL)');
  await q.add('placeOrder', job, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
}
