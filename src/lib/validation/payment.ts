import { z } from 'zod';

export const CheckoutSchema = z.object({
  amount: z.coerce.number().positive(),
  currency: z.string().trim().min(1).default('PKR'),
  method: z.string().trim().min(1),
  cart: z.any().optional(),
  orderId: z.string().trim().optional(),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;

export const WebhookMockSchema = z.object({
  orderId: z.string().trim().min(1, 'orderId required'),
  sessionId: z.string().trim().optional(),
  success: z.boolean().optional(),
});

export type WebhookMockInput = z.infer<typeof WebhookMockSchema>;
