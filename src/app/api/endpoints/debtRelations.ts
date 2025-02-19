import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { getCurrentUser } from '@/app/api/helper/authHelper';
import {DebtRelation, DebtRelationsResponse} from '@/types/debtRelation';

/**
 * Retrieve DebtRelation
 *
 * @param paymentId
 */
export async function getDebtRelations(paymentId: number): Promise<DebtRelationsResponse | null> {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return null;

  // paymentId が紐づく Payment を取得。その中に紐づく DebtRelations, Users も結合して取得する。
  const { data, error } = await supabaseClient
    .from('Payments')
    .select(`
        *,
        DebtRelations (
          *,
          payer:Users!DebtRelations_payer_id_fkey(*),
          payee:Users!DebtRelations_payee_id_fkey(*)
        )
      `)
    .eq('id', paymentId).limit(1);
  if (error) throw error;

  const payment = data?.[0];
  const debtRelations: DebtRelation[] = payment?.DebtRelations ?? [];

  return {
    payment: payment,
    debt_relations: debtRelations.map((debtRelation) => {
      return {
        payer: debtRelation.payer,
        payee: debtRelation.payee,
        ...debtRelation
      }
    }) ?? []
  }
}
