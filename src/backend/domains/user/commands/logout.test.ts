import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logout } from './logout';
import { AuthError } from '../../../utils/errors';

// Mock the supabase module
vi.mock('../../../infrastructure/external/supabase', () => ({
  supabaseClient: {
    auth: {
      signOut: vi.fn(),
    },
  },
}));

describe('logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常にログアウトできる', async () => {
    // Arrange
    const { supabaseClient } = await import('../../../infrastructure/external/supabase');
    (supabaseClient.auth.signOut as any).mockResolvedValue({ error: null });

    // Act & Assert
    await expect(logout()).resolves.toBeUndefined();
    expect(supabaseClient.auth.signOut).toHaveBeenCalledOnce();
  });

  it('Supabaseログアウトエラーの場合はAuthErrorを投げる', async () => {
    // Arrange
    const mockError = { message: 'Network error' };
    const { supabaseClient } = await import('../../../infrastructure/external/supabase');
    (supabaseClient.auth.signOut as any).mockResolvedValue({ error: mockError });

    // Act & Assert
    await expect(logout()).rejects.toThrow(
      new AuthError('Network error', 'LOGOUT_FAILED')
    );
    expect(supabaseClient.auth.signOut).toHaveBeenCalledOnce();
  });

  it('Supabaseエラーメッセージがない場合はデフォルトメッセージを使用', async () => {
    // Arrange
    const mockError = {}; // no message property
    const { supabaseClient } = await import('../../../infrastructure/external/supabase');
    (supabaseClient.auth.signOut as any).mockResolvedValue({ error: mockError });

    // Act & Assert
    await expect(logout()).rejects.toThrow(
      new AuthError('Logout failed', 'LOGOUT_FAILED')
    );
    expect(supabaseClient.auth.signOut).toHaveBeenCalledOnce();
  });
});
