export interface CreatePaymentInput {
  title: string;
  amount: number;
  note?: string;
  status?: string;
  creatorId: number;
  paidAt?: Date;
}

export class Payment {
  private constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly amount: number,
    public readonly note: string | null,
    public readonly status: string,
    public readonly creatorId: number,
    public readonly paidAt: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    input: CreatePaymentInput
  ): Omit<Payment, 'id' | 'paidAt' | 'createdAt' | 'updatedAt'> {
    // Validation
    if (!input.title.trim()) {
      throw new Error('Title is required');
    }
    if (input.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (input.creatorId <= 0) {
      throw new Error('Creator ID must be valid');
    }

    return {
      title: input.title.trim(),
      amount: input.amount,
      note: input.note?.trim() || null,
      status: 'AWAITING',
      creatorId: input.creatorId,
    };
  }

  static fromDatabase(data: any): Payment {
    return new Payment(
      data.id,
      data.title,
      data.amount,
      data.note,
      data.status,
      data.creator_id,
      data.paid_at,
      data.created_at,
      data.updated_at
    );
  }
}
