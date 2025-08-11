import { z } from 'zod';

export const CreateCollectionSchema = z.object({
  slug: z.string().trim().min(1, 'slug is required'),
  title: z.string().trim().min(1, 'title is required'),
  desc: z.string().trim().optional().nullable(),
});

export const UpdateCollectionSchema = z.object({
  slug: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1).optional(),
  desc: z.string().trim().optional().nullable(),
});

export const AttachProductSchema = z.object({
  productId: z.string().trim().min(1, 'productId required'),
  position: z.coerce.number().int().nonnegative().optional(),
});

export const DetachProductSchema = z.object({
  productId: z.string().trim().min(1, 'productId required'),
});

export const ReorderProductSchema = z.object({
  productId: z.string().trim().min(1, 'productId required'),
  position: z.coerce.number().int().nonnegative(),
});

export type CreateCollectionInput = z.infer<typeof CreateCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof UpdateCollectionSchema>;
export type AttachProductInput = z.infer<typeof AttachProductSchema>;
export type DetachProductInput = z.infer<typeof DetachProductSchema>;
export type ReorderProductInput = z.infer<typeof ReorderProductSchema>;
