// 支払い詳細取得ユースケース
import { paymentRepository } from '../infra/PaymentRepositorySupabase';
import { DebtRelationRepositorySupabase } from '../infra/DebtRelationRepositorySupabase';
// import { Payment } from '@/shared/types/payment';
// import { DebtRelation, DebtRelationsResponse } from '@/shared/types/debtRelation';

export async function getPaymentDetailUseCase(
  paymentId: number
): Promise<DebtRelationsResponse | null> {
  // 支払い本体
  const payment = await paymentRepository.getPaymentWithDebtRelations(paymentId);
  if (!payment) return null;

  // 支払いに紐づくdebtRelations
  const debtRelationRepository = new DebtRelationRepositorySupabase();
  const debtRelations = await debtRelationRepository.getDebtRelationsByPaymentId(paymentId);

  return {
    payment,
    debt_relations: debtRelations,
  };
}
