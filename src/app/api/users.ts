import { signUpAtSupabase } from '@/lib/supabase/requests/auth';

export async function createUser(email: string, password: string) {
  await signUpAtSupabase(email, password);
}
