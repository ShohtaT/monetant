import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaDebtRelationRepository } from './PrismaDebtRelationRepository';
import { CreateDebtRelationInput } from '../../../domains/payment/entities/DebtRelation';
import { DatabaseError } from '../../../utils/errors';
import { prisma } from '../../../../lib/prisma';

// Mock the prisma module
vi.mock('../../../../lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
    debtRelation: {
      findMany: vi.fn(),
    },
  },
}));

// Get the mocked functions
const mockTransaction = vi.mocked(prisma.$transaction);
const mockFindMany = vi.mocked(prisma.debtRelation.findMany);

describe('PrismaDebtRelationRepository', () => {
  let repository: PrismaDebtRelationRepository;

  beforeEach(() => {
    repository = new PrismaDebtRelationRepository();
    vi.clearAllMocks();
  });

  describe('saveMany', () => {
    it('正常に複数の債務関係を保存できる', async () => {
      // Arrange
      const inputs: CreateDebtRelationInput[] = [
        {
          splitAmount: 600,
          paymentId: 1,
          debtorId: 2,
        },
        {
          splitAmount: 400,
          paymentId: 1,
          debtorId: 3,
        },
      ];

      const mockDbResults = [
        {
          id: 1,
          split_amount: 600,
          status: 'AWAITING',
          payment_id: 1,
          debtor_id: 2,
          paid_at: null,
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        {
          id: 2,
          split_amount: 400,
          status: 'AWAITING',
          payment_id: 1,
          debtor_id: 3,
          paid_at: null,
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
      ];

      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          debtRelation: {
            create: vi.fn(),
          },
        };

        // Create mock responses for each create call
        mockTx.debtRelation.create
          .mockResolvedValueOnce(mockDbResults[0])
          .mockResolvedValueOnce(mockDbResults[1]);

        // Execute the callback with mocked transaction
        const createPromises = inputs.map((debt) =>
          mockTx.debtRelation.create({
            data: {
              split_amount: debt.splitAmount,
              status: debt.status || 'AWAITING',
              payment_id: debt.paymentId,
              debtor_id: debt.debtorId,
            },
          })
        );
        return Promise.all(createPromises);
      });

      // Act
      const result = await repository.saveMany(inputs);

      // Assert
      expect(mockTransaction).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].splitAmount).toBe(600);
      expect(result[0].debtorId).toBe(2);
      expect(result[1].id).toBe(2);
      expect(result[1].splitAmount).toBe(400);
      expect(result[1].debtorId).toBe(3);
    });

    it('カスタムステータスで債務関係を保存できる', async () => {
      // Arrange
      const inputs: CreateDebtRelationInput[] = [
        {
          splitAmount: 1000,
          status: 'COMPLETED',
          paymentId: 1,
          debtorId: 2,
        },
      ];

      const mockDbResults = [
        {
          id: 1,
          split_amount: 1000,
          status: 'COMPLETED',
          payment_id: 1,
          debtor_id: 2,
          paid_at: new Date('2023-01-01'),
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
      ];

      mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          debtRelation: {
            create: vi.fn().mockResolvedValue(mockDbResults[0]),
          },
        };

        const createPromises = inputs.map((debt) =>
          mockTx.debtRelation.create({
            data: {
              split_amount: debt.splitAmount,
              status: debt.status || 'AWAITING',
              payment_id: debt.paymentId,
              debtor_id: debt.debtorId,
            },
          })
        );
        return Promise.all(createPromises);
      });

      // Act
      const result = await repository.saveMany(inputs);

      // Assert
      expect(result[0].status).toBe('COMPLETED');
    });

    it('空の配列の場合は空の配列を返す', async () => {
      // Arrange
      const inputs: CreateDebtRelationInput[] = [];

      // Act
      const result = await repository.saveMany(inputs);

      // Assert
      expect(mockTransaction).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('外部キー制約エラーの場合は適切なエラーメッセージを投げる', async () => {
      // Arrange
      const inputs: CreateDebtRelationInput[] = [
        {
          splitAmount: 1000,
          paymentId: 999, // 存在しない支払いID
          debtorId: 2,
        },
      ];

      const foreignKeyError = new Error('Foreign key constraint failed on the field: payment_id');
      mockTransaction.mockRejectedValue(foreignKeyError);

      // Act & Assert
      await expect(repository.saveMany(inputs)).rejects.toThrow(
        new DatabaseError('Payment or debtor not found')
      );
    });

    it('その他のデータベースエラーの場合は一般的なエラーメッセージを投げる', async () => {
      // Arrange
      const inputs: CreateDebtRelationInput[] = [
        {
          splitAmount: 1000,
          paymentId: 1,
          debtorId: 2,
        },
      ];

      const dbError = new Error('Connection timeout');
      mockTransaction.mockRejectedValue(dbError);

      // Act & Assert
      await expect(repository.saveMany(inputs)).rejects.toThrow(
        new DatabaseError('Failed to save debt relations')
      );
    });

    it('トランザクション内で全ての債務関係が作成される', async () => {
      // Arrange
      const inputs: CreateDebtRelationInput[] = [
        {
          splitAmount: 500,
          paymentId: 1,
          debtorId: 2,
        },
        {
          splitAmount: 500,
          paymentId: 1,
          debtorId: 3,
        },
      ];

      let transactionCallback: any;
      mockTransaction.mockImplementation(async (callback) => {
        transactionCallback = callback;
        const mockTx = {
          debtRelation: {
            create: vi.fn()
              .mockResolvedValueOnce({
                id: 1,
                split_amount: 500,
                status: 'AWAITING',
                payment_id: 1,
                debtor_id: 2,
                paid_at: null,
                created_at: new Date('2023-01-01'),
                updated_at: new Date('2023-01-01'),
              })
              .mockResolvedValueOnce({
                id: 2,
                split_amount: 500,
                status: 'AWAITING',
                payment_id: 1,
                debtor_id: 3,
                paid_at: null,
                created_at: new Date('2023-01-01'),
                updated_at: new Date('2023-01-01'),
              }),
          },
        };
        return callback(mockTx as any);
      });

      // Act
      await repository.saveMany(inputs);

      // Assert
      expect(mockTransaction).toHaveBeenCalledTimes(1);
      expect(typeof transactionCallback).toBe('function');
    });
  });

  describe('fetchByPaymentId', () => {
    it('支払いIDで債務関係を正常に取得できる', async () => {
      // Arrange
      const mockDbResults = [
        {
          id: 1,
          split_amount: 600,
          status: 'AWAITING',
          payment_id: 1,
          debtor_id: 2,
          paid_at: null,
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        {
          id: 2,
          split_amount: 400,
          status: 'AWAITING',
          payment_id: 1,
          debtor_id: 3,
          paid_at: null,
          created_at: new Date('2023-01-02'),
          updated_at: new Date('2023-01-02'),
        },
      ];

      mockFindMany.mockResolvedValue(mockDbResults);

      // Act
      const result = await repository.fetchByPaymentId(1);

      // Assert
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { payment_id: 1 },
        orderBy: { created_at: 'asc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].splitAmount).toBe(600);
      expect(result[0].debtorId).toBe(2);
      expect(result[1].id).toBe(2);
      expect(result[1].splitAmount).toBe(400);
      expect(result[1].debtorId).toBe(3);
    });

    it('債務関係が存在しない場合は空の配列を返す', async () => {
      // Arrange
      mockFindMany.mockResolvedValue([]);

      // Act
      const result = await repository.fetchByPaymentId(999);

      // Assert
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { payment_id: 999 },
        orderBy: { created_at: 'asc' },
      });
      expect(result).toEqual([]);
    });

    it('データベースエラーの場合は適切なエラーを投げる', async () => {
      // Arrange
      const dbError = new Error('Connection lost');
      mockFindMany.mockRejectedValue(dbError);

      // Act & Assert
      await expect(repository.fetchByPaymentId(1)).rejects.toThrow(
        new DatabaseError('Failed to fetch debt relations by payment ID')
      );
    });

    it('作成日時の昇順でソートされて返される', async () => {
      // Arrange
      const mockDbResults = [
        {
          id: 1,
          split_amount: 600,
          status: 'AWAITING',
          payment_id: 1,
          debtor_id: 2,
          paid_at: null,
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        {
          id: 2,
          split_amount: 400,
          status: 'AWAITING',
          payment_id: 1,
          debtor_id: 3,
          paid_at: null,
          created_at: new Date('2023-01-02'),
          updated_at: new Date('2023-01-02'),
        },
      ];

      mockFindMany.mockResolvedValue(mockDbResults);

      // Act
      await repository.fetchByPaymentId(1);

      // Assert
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { payment_id: 1 },
        orderBy: { created_at: 'asc' },
      });
    });
  });
});
