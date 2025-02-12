export interface DebtRelation {
  id: number;
  payment_id: number;
  payer_id: string;
  payee_id: string;
  status: 'awaiting' | 'completed';
  split_amount: number;
  paid_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DebtRelationCreate {
  payment_id: number;
  payer_id: string;
  payee_id: string;
  status: 'awaiting' | 'completed';
  split_amount: number;
  paid_at?: string;
}
