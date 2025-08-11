import { z } from 'zod';

export const OrderItemSchema = z.object({
  productId: z.string().trim().min(1).optional().nullable(),
  variantId: z.string().trim().min(1).optional().nullable(),
  title: z.string().trim().min(1, 'title is required'),
  quantity: z.coerce.number().int().positive().default(1),
  price: z.coerce.number().nonnegative().default(0),
  image: z.string().url().optional().nullable(),
});

export const AddressSchema = z
  .object({
    line1: z.string().trim().optional(),
    line2: z.string().trim().optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    postalCode: z.string().trim().optional(),
  })
  .optional();

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, 'at least one item is required'),
  total: z.coerce.number().positive('total must be > 0'),
  currency: z.string().trim().min(1).default('PKR'),
  email: z.string().email().optional(),
  name: z.string().trim().optional(),
  address: AddressSchema,
  provider: z.string().trim().optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type OrderItemInput = z.infer<typeof OrderItemSchema>;
