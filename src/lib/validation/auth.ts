import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('valid email required'),
  password: z.string().min(1, 'password required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
