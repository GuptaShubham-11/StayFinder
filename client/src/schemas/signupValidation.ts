import { z } from 'zod';

export const signupValidation = z.object({
    email: z
        .string({
            required_error: 'Email is required',
        })
        .email('Invalid email format'),

    password: z
        .string({
            required_error: 'Password is required',
        })
        .min(8, 'Password must be at least 8 characters'),

    role: z.enum(['user', 'host'], {
        required_error: 'Role is required',
        invalid_type_error: 'Role must be either user or host',
    }),
});

export type SignupInput = z.infer<typeof signupValidation>;
