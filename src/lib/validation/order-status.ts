import { z } from 'zod';

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'CANCELED']),
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
