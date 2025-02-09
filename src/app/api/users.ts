import { signInAtSupabase, signUpAtSupabase } from '@/lib/supabase/requests/auth';

export async function signup(email: string, password: string) {
  await signUpAtSupabase(email, password);
}

export async function login(email: string, password: string) {
  await signInAtSupabase(email, password);
}
