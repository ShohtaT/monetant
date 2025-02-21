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
  await createPaymentToSupabase({
    title,
    amount,
    note,
    status: 'awaiting',
    creator_id: currentUser.id,
    payment_at: paymentDate,
  });
  const newPayment = await getPaymentLastOne();
  if (!newPayment) return undefined;

  // DebtRelation を作成
  for (const billing of billings) {
    if (billing.user === null) continue;
    await createDebtRelationToSupabase({
      payment_id: newPayment.id,
      payee_id: billing.user?.id,
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

  // currentUser が Payment.creator_id または DebtRelation.payee_id に含まれる Payment を取得
  const myPayments = await getMyPayments(currentUser.id);
  const payeeDebtRelations = await getDebtRelationsToSupabase('payee_id', currentUser.id);
  const myPaymentIds = Array.from(
    new Set([
      ...myPayments.map((payment) => payment.id),
      ...payeeDebtRelations.map((debtRelation) => debtRelation.payment_id),
    ])
  );

  const { data, error } = await supabaseClient.from('Payments').select().in('id', myPaymentIds);

  if (error) throw error;

  // `awaitingPayments` と `completedPayments` をまとめて処理
  return {
    awaiting_payments: await expandPayments(data, 'awaiting'),
    completed_payments: await expandPayments(data, 'completed'),
  };
}

// PRIVATE FUNCTIONS =======================

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
 *
 * @param payment as PaymentCreate
 * @return Promise<void>
 */
const createPaymentToSupabase = async (payment: PaymentCreate) => {
  const { error } = await supabaseClient.from('Payments').insert([payment]);
  if (error) throw error;
};

/**
 * Supabase から最新の Payment を取得
 *
 * @return Promise<Payment | undefined>
 */
const getPaymentLastOne = async () => {
  const { data, error } = await supabaseClient
    .from('Payments')
    .select()
    .order('id', { ascending: false })
    .limit(1);
  if (error) throw error;
  return data?.[0];
};

/**
 * Supabase から creatorId が紐づく Payment を取得
 *
 * @return data of Payment[]
 */
const getMyPayments = async (creatorId: number) => {
  const { data, error } = await supabaseClient
    .from('Payments')
    .select()
    .eq('creator_id', creatorId);
  if (error) throw error;
  return data;
};

/**
 * Supabase に DebtRelation を作成
 *
 * @param debtRelation as DebtRelation
 * @return Promise<void>
 */
const createDebtRelationToSupabase = async (debtRelation: DebtRelationCreate) => {
  const { error } = await supabaseClient.from('DebtRelations').insert([debtRelation]);
  if (error) throw error;
};

/**
 * Retrieve DebtRelation based on a given column and value
 *
 * @param column - The column to filter by (e.g., 'payer_id', 'payee_id', 'payment_id')
 * @param value - The value to filter for
 * @return data of DebtRelations[]
 */
const getDebtRelationsToSupabase = async (
  column: 'payer_id' | 'payee_id' | 'payment_id',
  value: number
): Promise<DebtRelation[]> => {
  const { data, error } = await supabaseClient.from('DebtRelations').select().eq(column, value);

  if (error) throw error;
  return data ?? [];
};
