import { z } from 'zod';

export const CreateProductSchema = z.object({
  slug: z.string().trim().min(1, 'slug is required'),
  title: z.string().trim().min(1, 'title is required'),
  subtitle: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
});

export const UpdateProductSchema = z
  .object({
    slug: z.string().trim().min(1).optional(),
    title: z.string().trim().min(1).optional(),
    subtitle: z.string().trim().optional().nullable(),
    description: z.string().trim().optional().nullable(),
    brand: z.string().trim().optional().nullable(),
    care: z.string().trim().optional().nullable(),
    sizeGuide: z.string().trim().optional().nullable(),
    seoTitle: z.string().trim().optional().nullable(),
    seoDesc: z.string().trim().optional().nullable(),
    canonical: z.string().trim().optional().nullable(),
    tags: z.array(z.string().trim()).optional().nullable(),
    badges: z.array(z.string().trim()).optional().nullable(),
  })
  .partial();

export const CreateVariantSchema = z.object({
  sku: z.string().trim().optional().nullable(),
  optionSize: z.string().trim().optional().nullable(),
  optionColor: z.string().trim().optional().nullable(),
  price: z.coerce.number().nonnegative().default(0),
  compareAt: z.coerce.number().nonnegative().optional().nullable(),
  salePrice: z.coerce.number().nonnegative().optional().nullable(),
  stock: z.coerce.number().int().nonnegative().optional(),
});

export const UpdateVariantSchema = z.object({
  sku: z.string().trim().optional().nullable(),
  optionSize: z.string().trim().optional().nullable(),
  optionColor: z.string().trim().optional().nullable(),
  material: z.string().trim().optional().nullable(),
  fit: z.string().trim().optional().nullable(),
  season: z.string().trim().optional().nullable(),
  price: z.coerce.number().nonnegative().optional(),
  compareAt: z.coerce.number().nonnegative().optional().nullable(),
  salePrice: z.coerce.number().nonnegative().optional().nullable(),
  cost: z.coerce.number().nonnegative().optional().nullable(),
  msrp: z.coerce.number().nonnegative().optional().nullable(),
  stock: z.coerce.number().int().nonnegative().optional(),
});

export const UpdateMediaSchema = z.object({
  alt: z.string().trim().optional().nullable(),
  isPrimary: z.coerce.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type CreateVariantInput = z.infer<typeof CreateVariantSchema>;
export type UpdateVariantInput = z.infer<typeof UpdateVariantSchema>;
export type UpdateMediaInput = z.infer<typeof UpdateMediaSchema>;
