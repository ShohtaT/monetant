import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { getCurrentUser } from '@/app/api/helper/authHelper';
import {DebtRelation, DebtRelationCreate} from '@/types/debtRelation';

/**
 * Insert a new DebtRelation
 *
 * @param debtRelation
 * @return data of DebtRelations
 */
export async function createDebtRelation(debtRelation: DebtRelationCreate) {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return;

  const { data, error } = await supabaseClient.from('DebtRelations').insert([debtRelation]);
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
