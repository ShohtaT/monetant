import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaUserRepository } from './PrismaUserRepository';
import { CreateUserInput } from '../../../domains/user/entities/User';
import { DatabaseError } from '../../../utils/errors';
import { prisma } from '../../../../lib/prisma';

// Mock the prisma module
vi.mock('../../../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Get the mocked functions
const mockFindUnique = vi.mocked(prisma.user.findUnique);
const mockCount = vi.mocked(prisma.user.count);
const mockCreate = vi.mocked(prisma.user.create);
const mockUpdate = vi.mocked(prisma.user.update);
const mockDelete = vi.mocked(prisma.user.delete);

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;

  beforeEach(() => {
    repository = new PrismaUserRepository();
    vi.clearAllMocks();
  });

  describe('findById', () => {
    it('IDでユーザーを正常に取得できる', async () => {
      // Arrange
      const mockDbUser = {
        id: 1,
        auth_id: 'test-auth-id',
        email: 'test@example.com',
        nickname: 'testuser',
        last_login_at: new Date('2023-01-01'),
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };

      mockFindUnique.mockResolvedValue(mockDbUser);

      // Act
      const result = await repository.findById(1);

      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
      expect(result?.email).toBe('test@example.com');
      expect(result?.nickname).toBe('testuser');
    });

    it('存在しないIDの場合はnullを返す', async () => {
      // Arrange
      mockFindUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findById(999);

      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });

    it('データベースエラーの場合は適切なエラーを投げる', async () => {
      // Arrange
      const dbError = new Error('Connection lost');
      mockFindUnique.mockRejectedValue(dbError);

      // Act & Assert
      await expect(repository.findById(1)).rejects.toThrow(
        new DatabaseError('Failed to find user by ID')
      );
    });
  });

  describe('findByAuthId', () => {
    it('Auth IDでユーザーを正常に取得できる', async () => {
      // Arrange
      const mockDbUser = {
        id: 1,
        auth_id: 'test-auth-id',
        email: 'test@example.com',
        nickname: 'testuser',
        last_login_at: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };

      mockFindUnique.mockResolvedValue(mockDbUser);

      // Act
      const result = await repository.findByAuthId('test-auth-id');

      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { auth_id: 'test-auth-id' },
      });
      expect(result).not.toBeNull();
      expect(result?.authId).toBe('test-auth-id');
    });

    it('存在しないAuth IDの場合はnullを返す', async () => {
      // Arrange
      mockFindUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findByAuthId('non-existent-auth-id');

      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { auth_id: 'non-existent-auth-id' },
      });
      expect(result).toBeNull();
    });

    it('データベースエラーの場合は適切なエラーを投げる', async () => {
      // Arrange
      const dbError = new Error('Connection timeout');
      mockFindUnique.mockRejectedValue(dbError);

      // Act & Assert
      await expect(repository.findByAuthId('test-auth-id')).rejects.toThrow(
        new DatabaseError('Failed to find user by auth ID')
      );
    });
  });

  describe('findByEmail', () => {
    it('メールアドレスでユーザーを正常に取得できる', async () => {
      // Arrange
      const mockDbUser = {
        id: 1,
        auth_id: 'test-auth-id',
        email: 'test@example.com',
        nickname: 'testuser',
        last_login_at: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };

      mockFindUnique.mockResolvedValue(mockDbUser);

      // Act
      const result = await repository.findByEmail('test@example.com');

      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).not.toBeNull();
      expect(result?.email).toBe('test@example.com');
    });

    it('存在しないメールアドレスの場合はnullを返す', async () => {
      // Arrange
      mockFindUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findByEmail('non-existent@example.com');

      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: 'non-existent@example.com' },
      });
      expect(result).toBeNull();
    });

    it('データベースエラーの場合は適切なエラーを投げる', async () => {
      // Arrange
      const dbError = new Error('Query failed');
      mockFindUnique.mockRejectedValue(dbError);

      // Act & Assert
      await expect(repository.findByEmail('test@example.com')).rejects.toThrow(
        new DatabaseError('Failed to find user by email')
      );
    });
  });

  describe('existsByEmail', () => {
    it('メールアドレスが存在する場合はtrueを返す', async () => {
      // Arrange
      mockCount.mockResolvedValue(1);

      // Act
      const result = await repository.existsByEmail('test@example.com');

      // Assert
      expect(mockCount).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toBe(true);
    });

    it('メールアドレスが存在しない場合はfalseを返す', async () => {
      // Arrange
      mockCount.mockResolvedValue(0);

      // Act
      const result = await repository.existsByEmail('non-existent@example.com');

      // Assert
      expect(mockCount).toHaveBeenCalledWith({
        where: { email: 'non-existent@example.com' },
      });
      expect(result).toBe(false);
    });

    it('データベースエラーの場合は適切なエラーを投げる', async () => {
      // Arrange
      const dbError = new Error('Count operation failed');
      mockCount.mockRejectedValue(dbError);

      // Act & Assert
      await expect(repository.existsByEmail('test@example.com')).rejects.toThrow(
        new DatabaseError('Failed to check email existence')
      );
    });
  });

  describe('save', () => {
    it('正常にユーザーを保存できる', async () => {
      // Arrange
      const input: CreateUserInput = {
        authId: 'test-auth-id',
        email: 'test@example.com',
        nickname: 'testuser',
      };

      const mockDbUser = {
        id: 1,
        auth_id: 'test-auth-id',
        email: 'test@example.com',
        nickname: 'testuser',
        last_login_at: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };

      mockCreate.mockResolvedValue(mockDbUser);

      // Act
      const result = await repository.save(input);

      // Assert
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          auth_id: 'test-auth-id',
          email: 'test@example.com',
          nickname: 'testuser',
        },
      });
      expect(result.id).toBe(1);
      expect(result.authId).toBe('test-auth-id');
      expect(result.email).toBe('test@example.com');
      expect(result.nickname).toBe('testuser');
    });

    it('重複するメールアドレスの場合は適切なエラーメッセージを投げる', async () => {
      // Arrange
      const input: CreateUserInput = {
        authId: 'test-auth-id',
        email: 'existing@example.com',
        nickname: 'testuser',
      };

      const uniqueConstraintError = new Error('Unique constraint failed on the fields: (`email`)');
      mockCreate.mockRejectedValue(uniqueConstraintError);

      // Act & Assert
      await expect(repository.save(input)).rejects.toThrow(
        new DatabaseError('Email already exists')
      );
    });

    it('その他のデータベースエラーの場合は一般的なエラーメッセージを投げる', async () => {
      // Arrange
      const input: CreateUserInput = {
        authId: 'test-auth-id',
        email: 'test@example.com',
        nickname: 'testuser',
      };

      const dbError = new Error('Connection timeout');
      mockCreate.mockRejectedValue(dbError);

      // Act & Assert
      await expect(repository.save(input)).rejects.toThrow(
        new DatabaseError('Failed to save user')
      );
    });
  });

  describe('updateLastLogin', () => {
    it('正常に最終ログイン日時を更新できる', async () => {
      // Arrange
      const now = new Date();
      const mockDbUser = {
        id: 1,
        auth_id: 'test-auth-id',
        email: 'test@example.com',
        nickname: 'testuser',
        last_login_at: now,
        created_at: new Date('2023-01-01'),
        updated_at: now,
      };

      mockUpdate.mockResolvedValue(mockDbUser);

      // Act
      const result = await repository.updateLastLogin(1);

      // Assert
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          last_login_at: expect.any(Date),
        },
      });
      expect(result.id).toBe(1);
      expect(result.lastLoginAt).toEqual(now);
    });

    it('データベースエラーの場合は適切なエラーを投げる', async () => {
      // Arrange
      const dbError = new Error('Update failed');
      mockUpdate.mockRejectedValue(dbError);

      // Act & Assert
      await expect(repository.updateLastLogin(1)).rejects.toThrow(
        new DatabaseError('Failed to update last login')
      );
    });
  });

  describe('delete', () => {
    it('正常にユーザーを削除できる', async () => {
      // Arrange
      mockDelete.mockResolvedValue({ 
        id: 1,
        auth_id: 'test-auth-id',
        email: 'test@example.com',
        nickname: 'testuser',
        last_login_at: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      });

      // Act
      await repository.delete(1);

      // Assert
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('データベースエラーの場合は適切なエラーを投げる', async () => {
      // Arrange
      const dbError = new Error('Delete operation failed');
      mockDelete.mockRejectedValue(dbError);

      // Act & Assert
      await expect(repository.delete(1)).rejects.toThrow(
        new DatabaseError('Failed to delete user')
      );
    });
  });
});
