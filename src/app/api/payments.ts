import { insertAtSupabase } from '@/lib/supabase/requests/payments';

export async function createPayment(name: string, amount: number, currentUserUuid: string) {
  await insertAtSupabase(name, amount, currentUserUuid);
}
