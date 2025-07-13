import { DebtRelation, CreateDebtRelationInput } from '../entities/DebtRelation';

export interface DebtRelationRepository {
  saveMany(debtRelations: CreateDebtRelationInput[]): Promise<DebtRelation[]>;
  fetchByPaymentId(paymentId: number): Promise<DebtRelation[]>;
}
