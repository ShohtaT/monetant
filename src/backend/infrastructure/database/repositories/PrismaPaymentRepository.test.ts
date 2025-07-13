import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaPaymentRepository } from './PrismaPaymentRepository';
import { CreatePaymentInput } from '../../../domains/payment/entities/Payment';
import { DatabaseError } from '../../../utils/errors';
import { prisma } from '../../../../lib/prisma';

// Mock the prisma module
vi.mock('../../../../lib/prisma', () => ({
  prisma: {
    payment: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

// Get the mocked functions
const mockCreate = vi.mocked(prisma.payment.create);
const mockFindUnique = vi.mocked(prisma.payment.findUnique);

describe('PrismaPaymentRepository', () => {
  let repository: PrismaPaymentRepository;

  beforeEach(() => {
    repository = new PrismaPaymentRepository();
    vi.clearAllMocks();
  });

  describe('save', () => {
    it('正常に支払いを保存できる', async () => {
      // Arrange
      const input: CreatePaymentInput = {
        title: 'テスト支払い',
        amount: 1000,
        note: 'テストノート',
        creatorId: 1,
      };

      const mockDbResult = {
        id: 1,
        title: 'テスト支払い',
        amount: 1000,
        note: 'テストノート',
        status: 'AWAITING',
        creator_id: 1,
        paid_at: new Date('2023-01-01'),
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };

      mockCreate.mockResolvedValue(mockDbResult);

      // Act
      const result = await repository.save(input);

      // Assert
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          title: 'テスト支払い',
          amount: 1000,
          note: 'テストノート',
          status: 'AWAITING',
          creator_id: 1,
          paid_at: expect.any(Date),
        },
      });
      expect(result.id).toBe(1);
      expect(result.title).toBe('テスト支払い');
      expect(result.amount).toBe(1000);
      expect(result.note).toBe('テストノート');
      expect(result.status).toBe('AWAITING');
      expect(result.creatorId).toBe(1);
    });

    it('カスタムステータスとpaidAtで支払いを保存できる', async () => {
      // Arrange
      const customPaidAt = new Date('2023-12-01');
      const input: CreatePaymentInput = {
        title: 'テスト支払い',
        amount: 1000,
        note: 'テストノート',
        status: 'COMPLETED',
        creatorId: 1,
        paidAt: customPaidAt,
      };

      const mockDbResult = {
        id: 1,
        title: 'テスト支払い',
        amount: 1000,
        note: 'テストノート',
        status: 'COMPLETED',
        creator_id: 1,
        paid_at: customPaidAt,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };

      mockCreate.mockResolvedValue(mockDbResult);

      // Act
      const result = await repository.save(input);

      // Assert
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          title: 'テスト支払い',
          amount: 1000,
          note: 'テストノート',
          status: 'COMPLETED',
          creator_id: 1,
          paid_at: customPaidAt,
        },
      });
      expect(result.status).toBe('COMPLETED');
      expect(result.paidAt).toEqual(customPaidAt);
    });

    it('noteがnullでも正常に保存できる', async () => {
      // Arrange
      const input: CreatePaymentInput = {
        title: 'テスト支払い',
        amount: 1000,
        creatorId: 1,
        // noteは未指定
      };

      const mockDbResult = {
        id: 1,
        title: 'テスト支払い',
        amount: 1000,
        note: null,
        status: 'AWAITING',
        creator_id: 1,
        paid_at: new Date('2023-01-01'),
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };

      mockCreate.mockResolvedValue(mockDbResult);

      // Act
      const result = await repository.save(input);

      // Assert
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          title: 'テスト支払い',
          amount: 1000,
          note: undefined,
          status: 'AWAITING',
          creator_id: 1,
          paid_at: expect.any(Date),
        },
      });
      expect(result.note).toBeNull();
    });

    it('外部キー制約エラーの場合は適切なエラーメッセージを投げる', async () => {
      // Arrange
      const input: CreatePaymentInput = {
        title: 'テスト支払い',
        amount: 1000,
        creatorId: 999, // 存在しないユーザーID
      };

      const foreignKeyError = new Error('Foreign key constraint failed on the field: creator_id');
      mockCreate.mockRejectedValue(foreignKeyError);

      // Act & Assert
      await expect(repository.save(input)).rejects.toThrow(
        new DatabaseError('Creator not found')
      );
    });

    it('その他のデータベースエラーの場合は一般的なエラーメッセージを投げる', async () => {
      // Arrange
      const input: CreatePaymentInput = {
        title: 'テスト支払い',
        amount: 1000,
        creatorId: 1,
      };

      const dbError = new Error('Connection timeout');
      mockCreate.mockRejectedValue(dbError);

      // Act & Assert
      await expect(repository.save(input)).rejects.toThrow(
        new DatabaseError('Failed to save payment')
      );
    });
  });

  describe('findById', () => {
    it('IDで支払いを正常に取得できる', async () => {
      // Arrange
      const mockDbResult = {
        id: 1,
        title: 'テスト支払い',
        amount: 1000,
        note: 'テストノート',
        status: 'AWAITING',
        creator_id: 1,
        paid_at: new Date('2023-01-01'),
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };

      mockFindUnique.mockResolvedValue(mockDbResult);

      // Act
      const result = await repository.findById(1);

      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
      expect(result?.title).toBe('テスト支払い');
      expect(result?.amount).toBe(1000);
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
        new DatabaseError('Failed to find payment by ID')
      );
    });
  });
});
