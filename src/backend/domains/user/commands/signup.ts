import { User, CreateUserInput } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { AuthSignupRequest } from '../entities/UserRequest';
import { DomainError, AuthError } from '../../../utils/errors';
import { supabaseClient } from '../../../infrastructure/external/supabase';

export async function signup(
  input: AuthSignupRequest,
  userRepository: UserRepository
): Promise<{
  user: User;
}> {
  // Check if email already exists
  const existingUser = await userRepository.existsByEmail(input.email);
  if (existingUser) {
    throw new DomainError('Email already exists', 'EMAIL_ALREADY_EXISTS');
  }

  // Sign up with Supabase
  const { error: signUpError, data: signUpData } = await supabaseClient.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { nickname: input.nickname },
    },
  });

  if (signUpError || !signUpData.user) {
    throw new AuthError(signUpError?.message || 'Sign up failed', 'SIGNUP_FAILED');
  }

  // Create user in database
  const userData: CreateUserInput = {
    authId: signUpData.user.id,
    email: input.email,
    nickname: input.nickname,
  };
  const validatedUserData = User.create(userData);
  const user = await userRepository.save(validatedUserData);

  return { user };
}
