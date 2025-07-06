import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { DomainError, AuthError } from '../../../utils/errors';
import { signup } from './signup';
import { supabaseClient } from '../../../infrastructure/external/supabase';

// Mock the supabase module
vi.mock('../../../infrastructure/external/supabase', () => ({
  supabaseClient: {
    auth: {
      signUp: vi.fn(),
    },
  },
}));

// Get the mocked function
const mockSignUp = vi.mocked(supabaseClient.auth.signUp);

describe('signup', () => {
  let mockUserRepository: UserRepository;
  let mockUser: User;

  beforeEach(() => {
    // UserRepositoryのモック作成
    mockUserRepository = {
      findById: vi.fn(),
      findByAuthId: vi.fn(),
      findByEmail: vi.fn(),
      existsByEmail: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };

    // モックユーザー作成
    mockUser = User.fromDatabase({
      id: 1,
      auth_id: 'test-auth-id',
      email: 'test@example.com',
      nickname: 'testuser',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-01'),
    });

    // モックをリセット
    vi.clearAllMocks();
  });

  it('正常にユーザーを作成できる', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'testuser',
    };

    const mockSupabaseUser = {
      id: 'test-auth-id',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
      role: 'authenticated',
    };

    vi.mocked(mockUserRepository.existsByEmail).mockResolvedValue(false);
    vi.mocked(mockUserRepository.save).mockResolvedValue(mockUser);
    mockSignUp.mockResolvedValue({
      error: null,
      data: { 
        user: mockSupabaseUser,
        session: null
      },
    });

    // Act
    const result = await signup(input, mockUserRepository);

    // Assert
    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      options: {
        data: { nickname: 'testuser' },
      },
    });
    expect(mockUserRepository.save).toHaveBeenCalledWith({
      auth_id: 'test-auth-id',
      email: 'test@example.com',
      nickname: 'testuser',
    });
    expect(result.user).toEqual(mockUser);
  });

  it('重複するemailの場合はDomainErrorを投げる', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'testuser',
    };

    vi.mocked(mockUserRepository.existsByEmail).mockResolvedValue(true);

    // Act & Assert
    await expect(signup(input, mockUserRepository)).rejects.toThrow(
      new DomainError('Email already exists', 'EMAIL_ALREADY_EXISTS')
    );

    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockSignUp).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('Supabase認証エラーの場合はAuthErrorを投げる', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'testuser',
    };

    vi.mocked(mockUserRepository.existsByEmail).mockResolvedValue(false);
    mockSignUp.mockResolvedValue({
      error: {
        message: 'Invalid email format',
      } as any,
      data: { 
        user: null,
        session: null
      },
    });

    // Act & Assert
    await expect(signup(input, mockUserRepository)).rejects.toThrow(
      new AuthError('Invalid email format', 'SIGNUP_FAILED')
    );

    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockSignUp).toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('Supabaseでユーザーがnullの場合はAuthErrorを投げる', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'testuser',
    };

    vi.mocked(mockUserRepository.existsByEmail).mockResolvedValue(false);
    mockSignUp.mockResolvedValue({
      error: null,
      data: { 
        user: null,
        session: null
      },
    });

    // Act & Assert
    await expect(signup(input, mockUserRepository)).rejects.toThrow(
      new AuthError('Sign up failed', 'SIGNUP_FAILED')
    );

    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockSignUp).toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('無効なauth_idの場合はDomainErrorを投げる', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'testuser',
    };

    const mockSupabaseUser = {
      id: '', // 空のauth_id
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
      role: 'authenticated',
    };

    vi.mocked(mockUserRepository.existsByEmail).mockResolvedValue(false);
    mockSignUp.mockResolvedValue({
      error: null,
      data: { 
        user: mockSupabaseUser,
        session: null
      },
    });

    // Act & Assert
    await expect(signup(input, mockUserRepository)).rejects.toThrow(
      new DomainError('Auth ID is required', 'INVALID_AUTH_ID')
    );

    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockSignUp).toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('空のnicknameの場合はDomainErrorを投げる', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: 'password123',
      nickname: '   ', // 空白のみ
    };

    const mockSupabaseUser = {
      id: 'test-auth-id',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
      role: 'authenticated',
    };

    vi.mocked(mockUserRepository.existsByEmail).mockResolvedValue(false);
    mockSignUp.mockResolvedValue({
      error: null,
      data: { 
        user: mockSupabaseUser,
        session: null
      },
    });

    // Act & Assert
    await expect(signup(input, mockUserRepository)).rejects.toThrow(
      new DomainError('Nickname is required', 'INVALID_NICKNAME')
    );

    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockSignUp).toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('長すぎるnicknameの場合はDomainErrorを投げる', async () => {
    // Arrange
    const longNickname = 'a'.repeat(51); // 51文字
    const input = {
      email: 'test@example.com',
      password: 'password123',
      nickname: longNickname,
    };

    const mockSupabaseUser = {
      id: 'test-auth-id',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
      role: 'authenticated',
    };

    vi.mocked(mockUserRepository.existsByEmail).mockResolvedValue(false);
    mockSignUp.mockResolvedValue({
      error: null,
      data: { 
        user: mockSupabaseUser,
        session: null
      },
    });

    // Act & Assert
    await expect(signup(input, mockUserRepository)).rejects.toThrow(
      new DomainError('Nickname must be less than 50 characters', 'INVALID_NICKNAME_LENGTH')
    );

    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockSignUp).toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('nicknameの前後の空白を除去して保存する', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      password: 'password123',
      nickname: '  testuser  ', // 前後に空白
    };

    const mockSupabaseUser = {
      id: 'test-auth-id',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
      role: 'authenticated',
    };

    vi.mocked(mockUserRepository.existsByEmail).mockResolvedValue(false);
    vi.mocked(mockUserRepository.save).mockResolvedValue(mockUser);
    mockSignUp.mockResolvedValue({
      error: null,
      data: { 
        user: mockSupabaseUser,
        session: null
      },
    });

    // Act
    const result = await signup(input, mockUserRepository);

    // Assert
    expect(mockUserRepository.save).toHaveBeenCalledWith({
      auth_id: 'test-auth-id',
      email: 'test@example.com',
      nickname: 'testuser', // 空白が除去されている
    });
    expect(result.user).toEqual(mockUser);
  });
});
