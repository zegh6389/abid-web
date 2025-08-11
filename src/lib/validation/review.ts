import { z } from 'zod';

export const CreateReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().optional().nullable(),
  body: z.string().trim().optional().nullable(),
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
