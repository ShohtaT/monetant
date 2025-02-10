import { supabaseClient } from '@/lib/supabase/supabaseClient';

/**
 * Create a new user
 * @see https://supabase.com/docs/reference/javascript/auth-signup
 * @param email
 * @param password
 */
export async function signUpAtSupabase(email: string, password: string) {
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    throw error;
  }
}

/**
 * Sign in a user
 * @see https://supabase.com/docs/reference/javascript/auth-signinwithpassword
 * @param email
 * @param password
 */
export async function signInAtSupabase(email: string, password: string) {
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
}

/**
 * Sign out a user
 * @see https://supabase.com/docs/reference/javascript/auth-signout
 */
export async function signOutAtSupabase() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    throw error;
  }
}

/**
 * Retrieve a session
 * @see https://supabase.com/docs/reference/javascript/auth-getsession
 */
export async function getSessionAtSupabase() {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    throw error;
  }
  return data;
}

/**
 * Retrieve a user
 * @see https://supabase.com/docs/reference/javascript/auth-getuser
 */
export async function getUserAtSupabase() {
  const { data } = await supabaseClient.auth.getUser();
  return data;
}
