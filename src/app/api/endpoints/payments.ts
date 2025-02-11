import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { getCurrentUser } from '@/app/api/helper/authHelper';
import { ExpandedPayment, Payment, PaymentList } from '@/types/payment';
import { getUser } from '@/app/api/endpoints/user';

export async function createPayment(title: string, amount: number) {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return;

  const { data, error } = await supabaseClient
    .from('Payments')
    .insert([{ title: title, amount: amount, creator_id: currentUser.id }]);

  if (error) throw error;
  return data;
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

/**
 * 指定したステータスの Payment を `ExpandedPayment[]` に変換
 */
const expandPayments = async (payments: Payment[], status: string): Promise<ExpandedPayment[]> => {
  return await Promise.all(
    payments
      .filter((payment) => payment.status === status)
      .map(async (payment) => {
        const creator_name = await getUserNickname(payment.creator_id);
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
