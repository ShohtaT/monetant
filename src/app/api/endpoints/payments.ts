import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { getCurrentUser } from '@/app/api/helper/authHelper';
import { Billing, ExpandedPayment, Payment, PaymentCreate, PaymentList } from '@/types/payment';
import { getUser } from '@/app/api/endpoints/user';
import { DebtRelation, DebtRelationCreate } from '@/types/debtRelation';

export async function createPayment(
  title: string,
  paymentDate: string,
  amount: number,
  billings: Billing[],
  note?: string
): Promise<Payment | undefined> {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return undefined;

  // Payment を作成
  const newPayment = await createPaymentToSupabase({
    title,
    amount,
    note,
    status: 'awaiting',
    creator_id: currentUser.id,
    payment_at: paymentDate,
  });
  if (!newPayment) return undefined;

  // DebtRelation を作成
  for (const billing of billings) {
    if (billing.user === null) continue;
    await createDebtRelationToSupabase({
      payment_id: newPayment.id,
      payer_id: currentUser.id.toString(),
      payee_id: billing.user?.id.toString(),
      status: 'awaiting',
      split_amount: billing.splitAmount,
    } as DebtRelation);
  }
}

/**
 * @return data of PaymentList
 */
export async function getPayments(): Promise<PaymentList | null> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const { data, error } = await supabaseClient
    .from('Payments')
    .select()
    .eq('creator_id', currentUser.id);

  if (error) throw error;

  // `awaitingPayments` と `completedPayments` をまとめて処理
  return {
    awaiting_payments: await expandPayments(data, 'awaiting'),
    completed_payments: await expandPayments(data, 'completed'),
  };
}

// PRIVATE FUNCTIONS

/**
 * 指定したステータスの Payment を `ExpandedPayment[]` に変換
 */
const expandPayments = async (payments: Payment[], status: string): Promise<ExpandedPayment[]> => {
  return await Promise.all(
    payments
      .filter((payment) => payment.status === status)
      .map(async (payment) => {
        const creator_name = await getUserNickname(payment.creator_id); // FIXME: dataの数だけリクエストを送っている
        return { ...payment, creator_name } as ExpandedPayment;
      })
  );
};

/**
 * ユーザーのニックネームを取得
 */
const getUserNickname = async (userId: number): Promise<string> => {
  const user = await getUser(userId);
  return user?.nickname || 'Unknown';
};

/**
 * Supabase に Payment を作成
 * @param payment as PaymentCreate
 */
const createPaymentToSupabase = async (payment: PaymentCreate): Promise<Payment | null> => {
  const { data, error } = await supabaseClient.from('Payments').insert([payment]);
  if (error) throw error;
  return data ? data[0] : null;
};

/**
 * Supabase に DebtRelation を作成
 * @param debtRelation as DebtRelation
 */
const createDebtRelationToSupabase = async (
  debtRelation: DebtRelationCreate
): Promise<DebtRelation | null> => {
  const { data, error } = await supabaseClient.from('DebtRelation').insert([debtRelation]);
  if (error) throw error;
  return data ? data[0] : null;
};
