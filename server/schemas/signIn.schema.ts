import z from 'zod';

export const signInValidation = z.object({
  email: z
    .string()
    .trim()
    .min(1)
    .email({ message: 'Invalid email address' })
    .max(30)
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  password: z
    .string()
    .min(8, { message: 'Password should be at least 8 characters' })
    .max(12, { message: 'Password should be at most 12 characters' }),
});
