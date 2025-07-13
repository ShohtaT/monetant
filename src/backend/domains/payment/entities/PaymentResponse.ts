import { Payment } from './Payment';
import { DebtRelation } from './DebtRelation';

export interface PaymentResponse {
  id: number;
  title: string;
  amount: number;
  note: string | null;
  status: string;
  creatorId: number;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DebtRelationResponse {
  id: number;
  splitAmount: number;
  status: string;
  paymentId: number;
  debtorId: number;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentResponse {
  payment: PaymentResponse;
  debtRelations: DebtRelationResponse[];
}

export function toPaymentResponse(payment: Payment): PaymentResponse {
  return {
    id: payment.id,
    title: payment.title,
    amount: payment.amount,
    note: payment.note,
    status: payment.status,
    creatorId: payment.creatorId,
    paidAt: payment.paidAt,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  };
}

export function toDebtRelationResponse(debtRelation: DebtRelation): DebtRelationResponse {
  return {
    id: debtRelation.id,
    splitAmount: debtRelation.splitAmount,
    status: debtRelation.status,
    paymentId: debtRelation.paymentId,
    debtorId: debtRelation.debtorId,
    paidAt: debtRelation.paidAt,
    createdAt: debtRelation.createdAt,
    updatedAt: debtRelation.updatedAt,
  };
}
