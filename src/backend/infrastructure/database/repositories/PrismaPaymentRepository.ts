import { Payment, CreatePaymentInput } from '@/backend/domains/payment/entities/Payment';
import { PaymentRepository } from '@/backend/domains/payment/repositories/PaymentRepository';
import { DatabaseError } from '../../../utils/errors';
import { prisma } from '../../../../lib/prisma';

export class PrismaPaymentRepository implements PaymentRepository {
  /**
   * Saves a new payment in the database.
   * @param payment
   */
  async save(payment: CreatePaymentInput): Promise<Payment> {
    try {
      const result = await prisma.payment.create({
        data: {
          title: payment.title,
          amount: payment.amount,
          note: payment.note,
          status: payment.status || 'AWAITING',
          creator_id: payment.creatorId,
          paid_at: payment.paidAt || new Date(),
        },
      });

      return Payment.fromDatabase(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Foreign key constraint')) {
        throw new DatabaseError('Creator not found');
      }
      throw new DatabaseError('Failed to save payment');
    }
  }

  /**
   * Finds a payment by its ID.
   * @param id
   */
  async findById(id: number): Promise<Payment | null> {
    try {
      const result = await prisma.payment.findUnique({
        where: { id },
      });

      if (!result) {
        return null;
      }

      return Payment.fromDatabase(result);
    } catch {
      throw new DatabaseError('Failed to find payment by ID');
    }
  }
}
