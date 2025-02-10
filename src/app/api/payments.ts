import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { getCurrentUserUuid } from '@/lib/authHelper';
import { Payments } from '@/types/payments';

export async function createPayment(name: string, amount: number) {
  const currentUserUuid = await getCurrentUserUuid();
  if (currentUserUuid === null) return;

  await insertPaymentAtSupabase(name, amount, currentUserUuid);
}

export async function getPayments(): Promise<Payments[]> {
  const currentUserUuid = await getCurrentUserUuid();
  if (currentUserUuid === null) return [];

  const payments = await getPaymentsAtSupabase(currentUserUuid);
  if (payments === null) return [];

  return payments;
}

// Calling Supabase privately

/**
 * Insert a new Payment
 * @param name
 * @param amount
 * @param creator_id
 */
async function insertPaymentAtSupabase(name: string, amount: number, creator_id: string) {
  const { data, error } = await supabaseClient
    .from('Payments')
    .insert([{ name, amount, creator_id }]);
  if (error) throw error;
  return data;
}

/**
 * Retrieve Payments
 */
async function getPaymentsAtSupabase(creatorId: string) {
  const { data, error } = await supabaseClient
    .from('Payments')
    .select()
    .eq('creator_id', creatorId);
  if (error) throw error;
  return data;
}
