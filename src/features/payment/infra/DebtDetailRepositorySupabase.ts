import { supabaseClient } from '@/shared/lib/supabaseClient';
import { DebtDetail } from '../domain/DebtDetail';

export const debtDetailRepository = {
  async getDebtDetailsByPayeeId(currentUserId: number): Promise<{ awaiting_payments: DebtDetail[]; completed_payments: DebtDetail[] }> {
    const { data: myDebtRelations, error: errorMyDebtRelations } = await supabaseClient
      .from('DebtRelations')
      .select()
      .eq('payee_id', currentUserId);
    if (errorMyDebtRelations) throw errorMyDebtRelations;

    const { data: myPayments, error: errorMyPayments } = await supabaseClient
      .from('Payments')
      .select()
      .in('id', myDebtRelations.map(relation => relation.payment_id));
    if (errorMyPayments) throw errorMyPayments;

    const { data: users, error: errorUsers } = await supabaseClient
      .from('Users')
      .select('id, nickname')
      .in('id', myPayments.map(payment => payment.creator_id));
    if (errorUsers) throw errorUsers;

    const userMap = new Map<number, string>(
      users.map(user => [user.id, user.nickname])
    );

    const addCreatorName = (payment: any): DebtDetail => ({
      title: payment.title,
      payment_at: payment.payment_at,
      amount: myDebtRelations.find(relation => relation.payment_id === payment.id)?.split_amount,
      payer_nickname: userMap.get(payment.creator_id) || 'Unknown',
    });

    const awaiting_payments = myPayments
      .filter((p: any) => p.status === 'awaiting')
      .map((p: any) => addCreatorName(p));

    const completed_payments = myPayments
      .filter((p: any) => p.status === 'completed')
      .map((p: any) => addCreatorName(p));

    return { awaiting_payments, completed_payments };
  },
};
