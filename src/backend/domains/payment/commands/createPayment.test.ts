import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { DebtRelationRepository } from '../repositories/DebtRelationRepository';
import { UserRepository } from '../../user/repositories/UserRepository';
import { Payment } from '../entities/Payment';
import { DebtRelation } from '../entities/DebtRelation';
import { User } from '../../user/entities/User';
import { CreatePaymentRequest } from '../entities/PaymentRequest';
import { DomainError } from '../../../utils/errors';
import { createPayment } from './createPayment';
import { prisma } from '../../../../lib/prisma';

// Mock the prisma module
vi.mock('../../../../lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}));

// Get the mocked function
const mockTransaction = vi.mocked(prisma.$transaction);

describe('createPayment', () => {
  let mockPaymentRepository: PaymentRepository;
  let mockDebtRelationRepository: DebtRelationRepository;
  let mockUserRepository: UserRepository;
  let mockPayment: Payment;
  let mockDebtRelations: DebtRelation[];
  let mockCreator: User;
  let mockDebtor: User;

  beforeEach(() => {
    // PaymentRepositoryのモック作成
    mockPaymentRepository = {
      save: vi.fn(),
      findById: vi.fn(),
    };

    // DebtRelationRepositoryのモック作成
    mockDebtRelationRepository = {
      saveMany: vi.fn(),
      fetchByPaymentId: vi.fn(),
    };

    // UserRepositoryのモック作成
    mockUserRepository = {
      findById: vi.fn(),
      findByAuthId: vi.fn(),
      findByEmail: vi.fn(),
      existsByEmail: vi.fn(),
      save: vi.fn(),
      updateLastLogin: vi.fn(),
      delete: vi.fn(),
    };

    // モックデータ作成
    mockCreator = User.fromDatabase({
      id: 1,
      auth_id: 'creator-auth-id',
      email: 'creator@example.com',
      nickname: 'creator',
      last_login_at: null,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-01'),
    });

    mockDebtor = User.fromDatabase({
      id: 2,
      auth_id: 'debtor-auth-id',
      email: 'debtor@example.com',
      nickname: 'debtor',
      last_login_at: null,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-01'),
    });

    mockPayment = Payment.fromDatabase({
      id: 1,
      title: 'テスト支払い',
      amount: 1000,
      note: 'テストノート',
      status: 'AWAITING',
      creator_id: 1,
      paid_at: new Date('2023-01-01'),
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-01'),
    });

    mockDebtRelations = [
      DebtRelation.fromDatabase({
        id: 1,
        split_amount: 1000,
        status: 'AWAITING',
        payment_id: 1,
        debtor_id: 2,
        paid_at: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      }),
    ];

    // モックをリセット
    vi.clearAllMocks();
  });

  it('正常に支払いと債務関係を作成できる', async () => {
    // Arrange
    const input: CreatePaymentRequest = {
      title: 'テスト支払い',
      amount: 1000,
      note: 'テストノート',
      debtDetails: [
        {
          debtorId: 2,
          splitAmount: 1000,
        },
      ],
    };
    const creatorId = 1;

    vi.mocked(mockUserRepository.findById).mockImplementation(async (id: number) => {
      if (id === 1) return mockCreator;
      if (id === 2) return mockDebtor;
      return null;
    });
    vi.mocked(mockPaymentRepository.save).mockResolvedValue(mockPayment);
    vi.mocked(mockDebtRelationRepository.saveMany).mockResolvedValue(mockDebtRelations);
    mockTransaction.mockImplementation(async (callback) => {
      return await callback({} as any);
    });

    // Act
    const result = await createPayment(
      input,
      creatorId,
      mockPaymentRepository,
      mockDebtRelationRepository,
      mockUserRepository
    );

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(2); // debtor
    expect(mockUserRepository.findById).toHaveBeenCalledWith(1); // creator
    expect(mockPaymentRepository.save).toHaveBeenCalledWith({
      title: 'テスト支払い',
      amount: 1000,
      note: 'テストノート',
      creatorId: 1,
    });
    expect(mockDebtRelationRepository.saveMany).toHaveBeenCalledWith([
      {
        splitAmount: 1000,
        paymentId: 1,
        debtorId: 2,
      },
    ]);
    expect(result).toEqual({
      payment: mockPayment,
      debtRelations: mockDebtRelations,
    });
  });

  it('債務詳細が空の場合はDomainErrorを投げる', async () => {
    // Arrange
    const input: CreatePaymentRequest = {
      title: 'テスト支払い',
      amount: 1000,
      note: 'テストノート',
      debtDetails: [],
    };
    const creatorId = 1;

    // Act & Assert
    await expect(
      createPayment(
        input,
        creatorId,
        mockPaymentRepository,
        mockDebtRelationRepository,
        mockUserRepository
      )
    ).rejects.toThrow(
      new DomainError('At least one debt detail is required', 'DEBT_DETAILS_REQUIRED')
    );

    expect(mockUserRepository.findById).not.toHaveBeenCalled();
    expect(mockPaymentRepository.save).not.toHaveBeenCalled();
    expect(mockDebtRelationRepository.saveMany).not.toHaveBeenCalled();
  });

  it('分割金額の合計が支払い金額と一致しない場合はDomainErrorを投げる', async () => {
    // Arrange
    const input: CreatePaymentRequest = {
      title: 'テスト支払い',
      amount: 1000,
      note: 'テストノート',
      debtDetails: [
        {
          debtorId: 2,
          splitAmount: 500, // 支払い金額と一致しない
        },
      ],
    };
    const creatorId = 1;

    // Act & Assert
    await expect(
      createPayment(
        input,
        creatorId,
        mockPaymentRepository,
        mockDebtRelationRepository,
        mockUserRepository
      )
    ).rejects.toThrow(
      new DomainError(
        'Total split amount (500) must equal payment amount (1000)',
        'SPLIT_AMOUNT_MISMATCH'
      )
    );

    expect(mockUserRepository.findById).not.toHaveBeenCalled();
    expect(mockPaymentRepository.save).not.toHaveBeenCalled();
    expect(mockDebtRelationRepository.saveMany).not.toHaveBeenCalled();
  });

  it('存在しない債務者IDが含まれている場合はDomainErrorを投げる', async () => {
    // Arrange
    const input: CreatePaymentRequest = {
      title: 'テスト支払い',
      amount: 1000,
      note: 'テストノート',
      debtDetails: [
        {
          debtorId: 999, // 存在しないID
          splitAmount: 1000,
        },
      ],
    };
    const creatorId = 1;

    vi.mocked(mockUserRepository.findById).mockImplementation(async (id: number) => {
      if (id === 1) return mockCreator;
      return null; // 存在しない債務者
    });

    // Act & Assert
    await expect(
      createPayment(
        input,
        creatorId,
        mockPaymentRepository,
        mockDebtRelationRepository,
        mockUserRepository
      )
    ).rejects.toThrow(new DomainError('Debtor with ID 999 not found', 'DEBTOR_NOT_FOUND'));

    expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
    expect(mockPaymentRepository.save).not.toHaveBeenCalled();
    expect(mockDebtRelationRepository.saveMany).not.toHaveBeenCalled();
  });

  it('存在しない作成者IDの場合はDomainErrorを投げる', async () => {
    // Arrange
    const input: CreatePaymentRequest = {
      title: 'テスト支払い',
      amount: 1000,
      note: 'テストノート',
      debtDetails: [
        {
          debtorId: 2,
          splitAmount: 1000,
        },
      ],
    };
    const creatorId = 999; // 存在しないID

    vi.mocked(mockUserRepository.findById).mockImplementation(async (id: number) => {
      if (id === 2) return mockDebtor;
      return null; // 存在しない作成者
    });

    // Act & Assert
    await expect(
      createPayment(
        input,
        creatorId,
        mockPaymentRepository,
        mockDebtRelationRepository,
        mockUserRepository
      )
    ).rejects.toThrow(new DomainError('Creator not found', 'CREATOR_NOT_FOUND'));

    expect(mockUserRepository.findById).toHaveBeenCalledWith(2); // debtor
    expect(mockUserRepository.findById).toHaveBeenCalledWith(999); // creator
    expect(mockPaymentRepository.save).not.toHaveBeenCalled();
    expect(mockDebtRelationRepository.saveMany).not.toHaveBeenCalled();
  });

  it('複数の債務者で正常に分割できる', async () => {
    // Arrange
    const mockDebtor2 = User.fromDatabase({
      id: 3,
      auth_id: 'debtor2-auth-id',
      email: 'debtor2@example.com',
      nickname: 'debtor2',
      last_login_at: null,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-01'),
    });

    const input: CreatePaymentRequest = {
      title: 'テスト支払い',
      amount: 1000,
      note: 'テストノート',
      debtDetails: [
        {
          debtorId: 2,
          splitAmount: 600,
        },
        {
          debtorId: 3,
          splitAmount: 400,
        },
      ],
    };
    const creatorId = 1;

    const mockMultipleDebtRelations = [
      DebtRelation.fromDatabase({
        id: 1,
        split_amount: 600,
        status: 'AWAITING',
        payment_id: 1,
        debtor_id: 2,
        paid_at: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      }),
      DebtRelation.fromDatabase({
        id: 2,
        split_amount: 400,
        status: 'AWAITING',
        payment_id: 1,
        debtor_id: 3,
        paid_at: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      }),
    ];

    vi.mocked(mockUserRepository.findById).mockImplementation(async (id: number) => {
      if (id === 1) return mockCreator;
      if (id === 2) return mockDebtor;
      if (id === 3) return mockDebtor2;
      return null;
    });
    vi.mocked(mockPaymentRepository.save).mockResolvedValue(mockPayment);
    vi.mocked(mockDebtRelationRepository.saveMany).mockResolvedValue(mockMultipleDebtRelations);
    mockTransaction.mockImplementation(async (callback) => {
      return await callback({} as any);
    });

    // Act
    const result = await createPayment(
      input,
      creatorId,
      mockPaymentRepository,
      mockDebtRelationRepository,
      mockUserRepository
    );

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(2);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(3);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    expect(mockDebtRelationRepository.saveMany).toHaveBeenCalledWith([
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
    ]);
    expect(result).toEqual({
      payment: mockPayment,
      debtRelations: mockMultipleDebtRelations,
    });
  });

  it('同じ債務者IDが重複している場合でも正常に処理できる', async () => {
    // Arrange
    const input: CreatePaymentRequest = {
      title: 'テスト支払い',
      amount: 1000,
      note: 'テストノート',
      debtDetails: [
        {
          debtorId: 2,
          splitAmount: 500,
        },
        {
          debtorId: 2, // 同じ債務者ID
          splitAmount: 500,
        },
      ],
    };
    const creatorId = 1;

    vi.mocked(mockUserRepository.findById).mockImplementation(async (id: number) => {
      if (id === 1) return mockCreator;
      if (id === 2) return mockDebtor;
      return null;
    });
    vi.mocked(mockPaymentRepository.save).mockResolvedValue(mockPayment);
    vi.mocked(mockDebtRelationRepository.saveMany).mockResolvedValue(mockDebtRelations);
    mockTransaction.mockImplementation(async (callback) => {
      return await callback({} as any);
    });

    // Act
    const result = await createPayment(
      input,
      creatorId,
      mockPaymentRepository,
      mockDebtRelationRepository,
      mockUserRepository
    );

    // Assert
    // 重複するIDは一度だけチェックされる
    expect(mockUserRepository.findById).toHaveBeenCalledWith(2);
    expect(mockUserRepository.findById).toHaveBeenCalledTimes(2); // debtor(1回) + creator(1回)
    expect(result).toEqual({
      payment: mockPayment,
      debtRelations: mockDebtRelations,
    });
  });

  it('noteが未指定でも正常に処理できる', async () => {
    // Arrange
    const input: CreatePaymentRequest = {
      title: 'テスト支払い',
      amount: 1000,
      // note未指定
      debtDetails: [
        {
          debtorId: 2,
          splitAmount: 1000,
        },
      ],
    };
    const creatorId = 1;

    vi.mocked(mockUserRepository.findById).mockImplementation(async (id: number) => {
      if (id === 1) return mockCreator;
      if (id === 2) return mockDebtor;
      return null;
    });
    vi.mocked(mockPaymentRepository.save).mockResolvedValue(mockPayment);
    vi.mocked(mockDebtRelationRepository.saveMany).mockResolvedValue(mockDebtRelations);
    mockTransaction.mockImplementation(async (callback) => {
      return await callback({} as any);
    });

    // Act
    const result = await createPayment(
      input,
      creatorId,
      mockPaymentRepository,
      mockDebtRelationRepository,
      mockUserRepository
    );

    // Assert
    expect(mockPaymentRepository.save).toHaveBeenCalledWith({
      title: 'テスト支払い',
      amount: 1000,
      note: undefined, // noteは未指定
      creatorId: 1,
    });
    expect(result).toEqual({
      payment: mockPayment,
      debtRelations: mockDebtRelations,
    });
  });
});
