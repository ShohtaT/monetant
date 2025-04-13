import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { Payment, PaymentCreate } from '@/types/payment';

export class PaymentRepository {
  async createPayment(payment: PaymentCreate) {
    const { data, error } = await supabaseClient.from('Payments').insert([payment]);
    if (error) throw error;
    return data;
  }

  async getPaymentsByCreatorId(creatorId: number) {
    const { data, error } = await supabaseClient
      .from('Payments')
      .select()
      .eq('creator_id', creatorId);

    if (error) throw error;
    return data;
  }

  async getLastPayment() {
    const { data, error } = await supabaseClient
      .from('Payments')
      .select()
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data?.[0];
  }

  async deletePayment(paymentId: number) {
    const { error } = await supabaseClient.from('Payments').delete().eq('id', paymentId);
    if (error) throw error;
  }

  async updatePayment(id: number, params: Partial<Payment>) {
    const { error } = await supabaseClient
      .from('Payments')
      .update({ ...params, updated_at: new Date() })
      .eq('id', id);

    if (error) throw error;
  }

  async getPaymentWithDebtRelations(paymentId: number) {
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

    if (error) throw error;
    return data?.[0];
  }
}
