export interface CreateDebtRelationInput {
  splitAmount: number;
  status?: string;
  paymentId: number;
  debtorId: number;
}

export class DebtRelation {
  private constructor(
    public readonly id: number,
    public readonly splitAmount: number,
    public readonly status: string,
    public readonly paymentId: number,
    public readonly debtorId: number,
    public readonly paidAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    input: CreateDebtRelationInput
  ): Omit<DebtRelation, 'id' | 'paidAt' | 'createdAt' | 'updatedAt'> {
    // Validation
    if (input.splitAmount <= 0) {
      throw new Error('Split amount must be greater than 0');
    }
    if (input.paymentId <= 0) {
      throw new Error('Payment ID must be valid');
    }
    if (input.debtorId <= 0) {
      throw new Error('Debtor ID must be valid');
    }

    return {
      splitAmount: input.splitAmount,
      status: 'AWAITING',
      paymentId: input.paymentId,
      debtorId: input.debtorId,
    };
  }

  static fromDatabase(data: any): DebtRelation {
    return new DebtRelation(
      data.id,
      data.split_amount,
      data.status,
      data.payment_id,
      data.debtor_id,
      data.paid_at,
      data.created_at,
      data.updated_at
    );
  }
}
