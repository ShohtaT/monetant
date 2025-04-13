import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { DebtRelation, DebtRelationCreate } from '@/types/debtRelation';

export class DebtRelationRepository {
  supabaseClient = supabaseClient;
  async createDebtRelation(debtRelation: DebtRelationCreate) {
    const { error } = await supabaseClient.from('DebtRelations').insert([debtRelation]);
    if (error) throw error;
  }

  async getMyAwaitingDebtRelations(userId: number) {
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
      .eq('payee_id', userId)
      .eq('status', 'awaiting')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async getOthersAwaitingDebtRelations(userId: number) {
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
      .eq('creator_id', userId)
      .eq('DebtRelations.status', 'awaiting');

    if (error) throw error;
    return data;
  }

  async updateDebtRelation(id: number, params: Partial<DebtRelation>) {
    const { error } = await supabaseClient
      .from('DebtRelations')
      .update({ ...params, updated_at: new Date() })
      .eq('id', id);

    if (error) throw error;
  }
}
