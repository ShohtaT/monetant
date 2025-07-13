import { z } from 'zod';
import { AuthSignupRequest, AuthLoginRequest } from '../domains/user/entities/UserRequest';
import { CreatePaymentRequest } from '../domains/payment/entities/PaymentRequest';

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

export const createPaymentSchema: z.ZodType<CreatePaymentRequest> = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  amount: z.number().int().min(1, 'Amount must be greater than 0'),
  note: z.string().max(1000, 'Note must be less than 1000 characters').optional(),
  debtDetails: z
    .array(
      z.object({
        debtorId: z.number().int().min(1, 'Debtor ID must be valid'),
        splitAmount: z.number().int().min(1, 'Split amount must be greater than 0'),
      })
    )
    .min(1, 'At least one debt detail is required'),
});
