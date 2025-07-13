import { AuthError } from '../../../utils/errors';
import { supabaseClient } from '../../../infrastructure/external/supabase';

export async function logout(): Promise<void> {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    throw new AuthError(error.message || 'Logout failed', 'LOGOUT_FAILED');
  }
}
