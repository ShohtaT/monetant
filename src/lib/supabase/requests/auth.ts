import { supabaseClient } from '@/lib/supabase/supabaseClient';

/**
 * Create a new user
 * https://supabase.com/docs/reference/javascript/auth-signup
 * @param email
 * @param password
 */
export async function signUpAtSupabase(email: string, password: string) {
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    throw error;
  }
}
