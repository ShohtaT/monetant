import {supabaseClient} from "@/shared/lib/supabaseClient";

type CreatePayment = {
  title: string;
  amount: number;
  note?: string;
  status: 'awaiting' | 'completed';
  payment_at: string;
  creator_id: number;
}

export async function createPaymentUseCase(input: CreatePayment) {
  const { data, error } = await supabaseClient.from('Payments').insert([]);
  if (error) throw error;

  const { data, error } = await supabaseClient.from('DebtRelation').insert([]);
  if (error) throw error;
}
