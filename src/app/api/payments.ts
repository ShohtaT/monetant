import { getPaymentsAtSupabase, insertAtSupabase } from '@/lib/supabase/requests/payments';
import { getCurrentUser } from '@/lib/authHelper';
import {Payments} from "@/types/payments";

export async function createPayment(name: string, amount: number) {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return;

  await insertAtSupabase(name, amount, currentUser.id);
}

export async function getPayments(): Promise<Payments[]> {
  const currentUser = await getCurrentUser();
  if (currentUser === null) return [];

  const payments = await getPaymentsAtSupabase(currentUser.id);
  if (payments === null) return [];

  return payments;
}
