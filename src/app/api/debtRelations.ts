import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { getCurrentUserUuid } from '@/lib/authHelper';
import { DebtRelations } from '@/types/debtRelations';

export async function createDebtRelation(
  paymentId: number,
  payerId: string,
  payeeId: string,
  splitAmount: number
) {
  const currentUserUuid = await getCurrentUserUuid();
  if (currentUserUuid === null) return;

  await insertDebtRelationAtSupabase({
    payment_id: paymentId,
    payer_id: payerId,
    payee_id: payeeId,
    status: 'awaiting',
    split_amount: splitAmount,
  } as DebtRelations);
}

export async function getDebtRelations(paymentId: number): Promise<DebtRelations[]> {
  const currentUserUuid = await getCurrentUserUuid();
  if (currentUserUuid === null) return [];

  const debtRelations = await getDebtRelationsAtSupabase(paymentId);
  if (debtRelations === null) return [];

  return debtRelations;
}

// Calling Supabase privately

/**
 * Insert a new DebtRelation
 * @param params
 * @return data of DebtRelations
 */
async function insertDebtRelationAtSupabase(params: DebtRelations) {
  const { data, error } = await supabaseClient.from('DebtRelations').insert([params]);
  if (error) throw error;
  return data;
}

/**
 * Retrieve DebtRelation
 * @param paymentId
 * @return data of DebtRelations[]
 */
async function getDebtRelationsAtSupabase(paymentId: number) {
  const { data, error } = await supabaseClient
    .from('DebtRelations')
    .select()
    .eq('payment_id', paymentId);
  if (error) throw error;
  return data;
}
