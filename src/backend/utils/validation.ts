import { z } from 'zod';
import { AuthSignupRequest, AuthLoginRequest } from '../domains/user/entities/UserRequest';

export const authSignupSchema: z.ZodType<AuthSignupRequest> = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  nickname: z
    .string()
    .min(1, 'Nickname is required')
    .max(50, 'Nickname must be less than 50 characters'),
});

export const authLoginSchema: z.ZodType<AuthLoginRequest> = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type AuthSignupInput = z.infer<typeof authSignupSchema>;
export type AuthLoginInput = z.infer<typeof authLoginSchema>;
