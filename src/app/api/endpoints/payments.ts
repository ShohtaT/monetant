import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { getCurrentUser } from '@/app/api/helper/authHelper';
import { Payment } from '@/types/payment';

/**
 * Create a new payment
 *
 * @param title
 * @param amount
 * @return data of Payment
 */
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
 * Retrieve payments
 *
 * @return data of Payment[]
 */
export async function getPayments(): Promise<Payment[]> {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return [];

  const { data, error } = await supabaseClient
    .from('Payments')
    .select()
    .eq('creator_id', currentUser.id);

  if (error) throw error;
  return data;
}
