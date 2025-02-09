import { getPaymentsAtSupabase, insertAtSupabase } from '@/lib/supabase/requests/payments';
import { getCurrentUserUuid } from '@/lib/authHelper';
import { Payments } from '@/types/payments';

export async function createPayment(name: string, amount: number) {
  const currentUserUuid = await getCurrentUserUuid();
  if (currentUserUuid === null) return;

  await insertAtSupabase(name, amount, currentUserUuid);
}

export async function getPayments(): Promise<Payments[]> {
  const currentUserUuid = await getCurrentUserUuid();
  if (currentUserUuid === null) return [];

  const payments = await getPaymentsAtSupabase(currentUserUuid);
  if (payments === null) return [];

  return payments;
}
