// 支払い一覧取得ユースケース
import { paymentRepository } from '../infra/PaymentRepositorySupabase';
import { ExpandedPayment, PaymentList } from '@/shared/types/payment';

export async function getPaymentsUseCase(currentUserId: number): Promise<PaymentList> {
  // Get all payments associated with current user
  const myPayments = await paymentRepository.getPaymentsByCreatorId(currentUserId);
  // TODO: debtRelationRepositoryの移行と利用
  // const debtRelations = await debtRelationRepository.getMyAwaitingDebtRelations(currentUserId);

  // const myPaymentIds = [...new Set([...myPayments.map((p) => p.id), ...debtRelations.map((dr) => dr.payment_id)])];
  // const allPayments = await Promise.all(myPaymentIds.map((id) => paymentRepository.getPaymentWithDebtRelations(id)));
  // return {
  //   awaiting_payments: expandPayments(allPayments.filter(Boolean), 'awaiting'),
  //   completed_payments: expandPayments(allPayments.filter(Boolean), 'completed'),
  // };

  // 簡易実装: 自分が作成した支払いのみ返す
  const awaiting_payments: ExpandedPayment[] = myPayments
    .filter((p: any) => p.status === 'awaiting')
    .map((p: any) => ({ ...p, creator_name: 'Unknown' }));
  const completed_payments: ExpandedPayment[] = myPayments
    .filter((p: any) => p.status === 'completed')
    .map((p: any) => ({ ...p, creator_name: 'Unknown' }));
  return { awaiting_payments, completed_payments };
}
