import {
  DebtRelation,
  CreateDebtRelationInput,
} from '../../../domains/payment/entities/DebtRelation';
import { DebtRelationRepository } from '../../../domains/payment/repositories/DebtRelationRepository';
import { DatabaseError } from '../../../utils/errors';
import { prisma } from '../../../../lib/prisma';

export class PrismaDebtRelationRepository implements DebtRelationRepository {
  /**
   * Saves multiple debt relations in the database.
   * @param debtRelations
   */
  async saveMany(debtRelations: CreateDebtRelationInput[]): Promise<DebtRelation[]> {
    try {
      if (debtRelations.length === 0) return [];

      // Use transaction to ensure all debt relations are created atomically
      const createdDebts = await prisma.$transaction(async (tx) => {
        const createPromises = debtRelations.map((debt) =>
          tx.debtRelation.create({
            data: {
              split_amount: debt.splitAmount,
              status: debt.status || 'AWAITING',
              payment_id: debt.paymentId,
              debtor_id: debt.debtorId,
            },
          })
        );
        return Promise.all(createPromises);
      });

      return createdDebts.map((debt) => DebtRelation.fromDatabase(debt));
    } catch (error) {
      if (error instanceof Error && error.message.includes('Foreign key constraint')) {
        throw new DatabaseError('Payment or debtor not found');
      }
      throw new DatabaseError('Failed to save debt relations');
    }
  }

  /**
   * Fetches all debt relations associated with a specific payment ID.
   * @param paymentId
   */
  async fetchByPaymentId(paymentId: number): Promise<DebtRelation[]> {
    try {
      const results = await prisma.debtRelation.findMany({
        where: { payment_id: paymentId },
        orderBy: { created_at: 'asc' },
      });

      return results.map((debt) => DebtRelation.fromDatabase(debt));
    } catch {
      throw new DatabaseError('Failed to fetch debt relations by payment ID');
    }
  }
}
