import {
  signInAtSupabase,
  signOutAtSupabase,
  signUpAtSupabase,
} from '@/lib/supabase/auth';

export async function signup(email: string, password: string) {
  await signUpAtSupabase(email, password);
}

export async function login(email: string, password: string) {
  await signInAtSupabase(email, password);
}

export async function signout() {
  await signOutAtSupabase();
}
