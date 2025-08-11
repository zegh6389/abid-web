import { z } from 'zod';

export const PresignSchema = z.object({
  key: z.string().trim().min(1).refine((v) => v.startsWith('variants/'), {
    message: 'key must start with variants/',
  }),
  contentType: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || /^(image\/|video\/|application\/octet-stream)/.test(v),
      { message: 'unsupported contentType' }
    ),
});

export type PresignInput = z.infer<typeof PresignSchema>;
