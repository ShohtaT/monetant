import { Payment } from '../entities/Payment';
import { DebtRelation } from '../entities/DebtRelation';
import { CreatePaymentRequest } from '../entities/PaymentRequest';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { DebtRelationRepository } from '../repositories/DebtRelationRepository';
import { UserRepository } from '../../user/repositories/UserRepository';
import { DomainError } from '../../../utils/errors';
import { prisma } from '../../../../lib/prisma';

export async function createPayment(
  input: CreatePaymentRequest,
  creatorId: number,
  paymentRepository: PaymentRepository,
  debtRelationRepository: DebtRelationRepository,
  userRepository: UserRepository
): Promise<{
  payment: Payment;
  debtRelations: DebtRelation[];
}> {
  // Validation
  if (!input.debtDetails || input.debtDetails.length === 0) {
    throw new DomainError('At least one debt detail is required', 'DEBT_DETAILS_REQUIRED');
  }

  // Validate split amount total equals payment amount
  const totalSplitAmount = input.debtDetails.reduce((sum, detail) => sum + detail.splitAmount, 0);
  if (totalSplitAmount !== input.amount) {
    throw new DomainError(
      `Total split amount (${totalSplitAmount}) must equal payment amount (${input.amount})`,
      'SPLIT_AMOUNT_MISMATCH'
    );
  }

  // Validate all debtors exist
  const debtorIds = input.debtDetails.map((detail) => detail.debtorId);
  const uniqueDebtorIds = [...new Set(debtorIds)];

  for (const debtorId of uniqueDebtorIds) {
    const debtor = await userRepository.findById(debtorId);
    if (!debtor) {
      throw new DomainError(`Debtor with ID ${debtorId} not found`, 'DEBTOR_NOT_FOUND');
    }
  }

  // Validate creator exists
  const creator = await userRepository.findById(creatorId);
  if (!creator) {
    throw new DomainError('Creator not found', 'CREATOR_NOT_FOUND');
  }

  // Use transaction to ensure consistency
  return prisma.$transaction(async () => {
    // Create payment
    const paymentInput = {
      title: input.title,
      amount: input.amount,
      note: input.note,
      creatorId,
    };

    const payment = await paymentRepository.save(paymentInput);

    // Create debt relations
    const debtRelationInputs = input.debtDetails.map((detail) => ({
      splitAmount: detail.splitAmount,
      paymentId: payment.id,
      debtorId: detail.debtorId,
    }));

    const debtRelations = await debtRelationRepository.saveMany(debtRelationInputs);

    return { payment, debtRelations };
  });
}
