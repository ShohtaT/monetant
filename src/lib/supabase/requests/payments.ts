import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { Payments } from '@/types/payments';

/**
 * Insert a new Payment
 */
export async function insertAtSupabase(name: string, amount: number, creator_id: string) {
  const { data, error } = await supabaseClient
    .from('Payments')
    .insert([{ name, amount, creator_id }]);
  if (error) {
    throw error;
  }
  console.log(error, data);
  return data as Payments[] | null;
}
