import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { getCurrentUser } from '@/app/api/helper/authHelper';
import { DebtRelation } from '@/types/debtRelation';

/**
 * Insert a new DebtRelation
 *
 * @param paymentId
 * @param payerId
 * @param payeeId
 * @param splitAmount
 * @return data of DebtRelations
 */
export async function createDebtRelation(
  paymentId: number,
  payerId: string,
  payeeId: string,
  splitAmount: number
) {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return;

  const { data, error } = await supabaseClient.from('DebtRelations').insert({
    payment_id: paymentId,
    payer_id: payerId,
    payee_id: payeeId,
    status: 'awaiting',
    split_amount: splitAmount,
  } as DebtRelation);
  if (error) throw error;
  return data;
}

/**
 * Retrieve DebtRelation
 *
 * @param paymentId
 * @return data of DebtRelations[]
 */
export async function getDebtRelations(paymentId: number): Promise<DebtRelation[]> {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return [];

  const { data, error } = await supabaseClient
    .from('DebtRelations')
    .select()
    .eq('payment_id', paymentId);
  if (error) throw error;
  return data ? data : [];
}
