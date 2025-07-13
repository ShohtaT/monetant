import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login } from './login';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { AuthError, DomainError } from '../../../utils/errors';

// Mock Supabase client
vi.mock('../../../infrastructure/external/supabase', () => ({
  supabaseClient: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

describe('login', () => {
  let mockUserRepository: UserRepository;
  const mockUser = User.fromDatabase({
    id: 1,
    auth_id: 'test-auth-id',
    email: 'test@example.com',
    nickname: 'testuser',
    last_login_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  });

  beforeEach(() => {
    mockUserRepository = {
      findById: vi.fn(),
      findByAuthId: vi.fn(),
      findByEmail: vi.fn(),
      existsByEmail: vi.fn(),
      save: vi.fn(),
      updateLastLogin: vi.fn(),
      delete: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it('有効な認証情報でログインが成功すること', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockSupabaseResponse = {
      error: null,
      data: {
        user: { id: 'test-auth-id' },
      },
    };

    const { supabaseClient } = await import('../../../infrastructure/external/supabase');
    (supabaseClient.auth.signInWithPassword as any).mockResolvedValue(mockSupabaseResponse);
    (mockUserRepository.findByAuthId as any).mockResolvedValue(mockUser);
    (mockUserRepository.updateLastLogin as any).mockResolvedValue(mockUser);

    // Act
    const result = await login(input, mockUserRepository);

    // Assert
    expect(result.user).toEqual(mockUser);
    expect(supabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: input.email,
      password: input.password,
    });
    expect(mockUserRepository.findByAuthId).toHaveBeenCalledWith('test-auth-id');
    expect(mockUserRepository.updateLastLogin).toHaveBeenCalledWith(1);
  });

  it('Supabase認証が失敗した場合はAuthErrorを投げること', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    const mockSupabaseResponse = {
      error: { message: 'Invalid login credentials' },
      data: { user: null },
    };

    const { supabaseClient } = await import('../../../infrastructure/external/supabase');
    (supabaseClient.auth.signInWithPassword as any).mockResolvedValue(mockSupabaseResponse);

    // Act & Assert
    await expect(login(input, mockUserRepository)).rejects.toThrow(AuthError);
    await expect(login(input, mockUserRepository)).rejects.toThrow('Invalid login credentials');
  });

  it('Supabaseがユーザーを返さない場合はAuthErrorを投げること', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockSupabaseResponse = {
      error: null,
      data: { user: null },
    };

    const { supabaseClient } = await import('../../../infrastructure/external/supabase');
    (supabaseClient.auth.signInWithPassword as any).mockResolvedValue(mockSupabaseResponse);

    // Act & Assert
    await expect(login(input, mockUserRepository)).rejects.toThrow(AuthError);
    await expect(login(input, mockUserRepository)).rejects.toThrow('Invalid email or password');
  });

  it('データベースでユーザーが見つからない場合はDomainErrorを投げること', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockSupabaseResponse = {
      error: null,
      data: {
        user: { id: 'test-auth-id' },
      },
    };

    const { supabaseClient } = await import('../../../infrastructure/external/supabase');
    (supabaseClient.auth.signInWithPassword as any).mockResolvedValue(mockSupabaseResponse);
    (mockUserRepository.findByAuthId as any).mockResolvedValue(null);

    // Act & Assert
    await expect(login(input, mockUserRepository)).rejects.toThrow(DomainError);
    await expect(login(input, mockUserRepository)).rejects.toThrow('User not found');
  });

  it('空のメールアドレスの場合はAuthErrorを投げること', async () => {
    // Arrange
    const input = {
      email: '',
      password: 'password123',
    };

    const mockSupabaseResponse = {
      error: { message: 'Email is required' },
      data: { user: null },
    };

    const { supabaseClient } = await import('../../../infrastructure/external/supabase');
    (supabaseClient.auth.signInWithPassword as any).mockResolvedValue(mockSupabaseResponse);

    // Act & Assert
    await expect(login(input, mockUserRepository)).rejects.toThrow(AuthError);
    await expect(login(input, mockUserRepository)).rejects.toThrow('Email is required');
  });

  it('空のパスワードの場合はAuthErrorを投げること', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: '',
    };

    const mockSupabaseResponse = {
      error: { message: 'Password is required' },
      data: { user: null },
    };

    const { supabaseClient } = await import('../../../infrastructure/external/supabase');
    (supabaseClient.auth.signInWithPassword as any).mockResolvedValue(mockSupabaseResponse);

    // Act & Assert
    await expect(login(input, mockUserRepository)).rejects.toThrow(AuthError);
    await expect(login(input, mockUserRepository)).rejects.toThrow('Password is required');
  });
});
