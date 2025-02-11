export interface Payment {
  id: number;
  title: string;
  amount: number;
  note?: string;
  status: string;
  creator_id: number;
  payment_at: string;
  created_at: string;
  updated_at: string;
}
