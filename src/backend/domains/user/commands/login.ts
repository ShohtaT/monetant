import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { AuthLoginRequest } from '../entities/UserRequest';
import { DomainError, AuthError } from '../../../utils/errors';
import { supabaseClient } from '../../../infrastructure/external/supabase';

export async function login(
  input: AuthLoginRequest,
  userRepository: UserRepository
): Promise<{
  user: User;
}> {
  // Sign in with Supabase
  const { error: signInError, data: signInData } = await supabaseClient.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (signInError || !signInData.user) {
    throw new AuthError(signInError?.message || 'Invalid email or password', 'LOGIN_FAILED');
  }

  // Get user from database
  const user = await userRepository.findByAuthId(signInData.user.id);
  if (!user) {
    throw new DomainError('User not found', 'USER_NOT_FOUND');
  }

  return { user };
}
