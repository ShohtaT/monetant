import { Payment, CreatePaymentInput } from '../entities/Payment';

export interface PaymentRepository {
  save(payment: CreatePaymentInput): Promise<Payment>;
  findById(id: number): Promise<Payment | null>;
}
