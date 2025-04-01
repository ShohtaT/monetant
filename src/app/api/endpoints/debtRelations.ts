import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { getCurrentUser } from '@/app/api/helper/authHelper';
import { DebtRelation, DebtRelationsResponse } from '@/types/debtRelation';

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
    .select(
      `
        *,
        DebtRelations (
          *,
          payee:Users!DebtRelations_payee_id_fkey(*)
        )
      `
    )
    .eq('id', paymentId)
    .limit(1);

  if (error) {
    console.error('Error fetching debt relations:', error);
    throw error;
  }

  const payment = data?.[0];
  const debtRelations: DebtRelation[] = payment?.DebtRelations ?? [];

  return {
    payment: payment,
    debt_relations:
      debtRelations.map((debtRelation) => {
        return {
          payee: debtRelation.payee,
          ...debtRelation,
        };
      }) ?? [],
  };
}

/**
 * Update DebtRelation
 *
 * @param id number
 * @param params Partial<DebtRelation>
 */
export async function updateDebtRelations(id: number, params: Partial<DebtRelation>) {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return null;

  const { error } = await supabaseClient
    .from('DebtRelations')
    .update({ ...params, updated_at: new Date() })
    .eq('id', id);

  if (error) {
    console.error('Error updating debt relation:', error);
    throw error;
  }
}

/**
 * Retrieve DebtRelations that the current user needs to pay
 *
 * @return Promise<DebtRelation[]>
 */
export async function getMyAwaitingDebtRelations(): Promise<DebtRelation[]> {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return [];

  const { data, error } = await supabaseClient
    .from('DebtRelations')
    .select(
      `
      *,
      payment:Payments(
        *,
        creator:Users!Payments_creator_id_fkey(*)
      ),
      payee:Users!DebtRelations_payee_id_fkey(*)
    `
    )
    .eq('payee_id', currentUser.id)
    .eq('status', 'awaiting')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching my debt relations:', error);
    throw error;
  }

  return data ?? [];
}

/**
 * Retrieve DebtRelations that current user needs to pay to others
 *
 * @return Promise<DebtRelation[]>
 */
export async function getMyAwaitingDebtRelationsToOthers(): Promise<DebtRelation[]> {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return [];

  const { data, error } = await supabaseClient
    .from('DebtRelations')
    .select(
      `
      *,
      payment:Payments(*),
      payee:Users!DebtRelations_payee_id_fkey(*)
    `
    )
    .eq('payment->payee_id', currentUser.id)
    .eq('status', 'awaiting')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching my debt relations to others:', error);
    throw error;
  }

  return data ?? [];
}

/**
 * Retrieve DebtRelations that others need to pay to the current user
 *
 * @return Promise<DebtRelation[]>
 */
export async function getOthersAwaitingDebtRelations(): Promise<DebtRelation[]> {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return [];

  const { data, error } = await supabaseClient
    .from('Payments')
    .select(
      `
      DebtRelations!inner(
        *,
        payee:Users!DebtRelations_payee_id_fkey(*)
      )
    `
    )
    .eq('creator_id', currentUser.id)
    .eq('DebtRelations.status', 'awaiting');

  if (error) {
    console.error('Error fetching others debt relations:', error);
    throw error;
  }

  // Flatten the nested structure and add payment information
  return (
    data
      ?.flatMap((payment) =>
        payment.DebtRelations.map((dr) => ({
          ...dr,
          payment: {
            ...payment,
            DebtRelations: undefined, // Remove circular reference
          },
        }))
      )
      .sort(
        (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      ) ?? []
  );
}
