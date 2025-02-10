export interface DebtRelations {
  id: number;
  created_at: string;
  updated_at: string;
  payment_id: number;
  payer_id: string;
  payee_id: string;
  status: 'awaiting' | 'completed';
  split_amount: number;
  paid_at?: string;
}
