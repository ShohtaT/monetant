import { supabaseClient } from '@/lib/supabase/supabaseClient';

/**
 * Insert a new Payment
 * @param name
 * @param amount
 * @param creator_id
 */
export async function insertAtSupabase(name: string, amount: number, creator_id: string) {
  const { data, error } = await supabaseClient
    .from('Payments')
    .insert([{ name, amount, creator_id }]);
  if (error) throw error;
  return data;
}

/**
 * Retrieve Payments
 */
export async function getPaymentsAtSupabase(creatorId: string) {
  const { data, error } = await supabaseClient
    .from('Payments')
    .select()
    .eq('creator_id', creatorId);
  if (error) throw error;
  return data;
}
