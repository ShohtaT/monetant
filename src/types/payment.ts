export interface Payment {
  id: number;
  title: string;
  amount: number;
  note: string | null;
  status: string;
  creator_id: number;
  payment_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpandedPayment extends Payment {
  creator_name: string;
}

export interface PaymentList {
  awaiting_payments: ExpandedPayment[];
  completed_payments: ExpandedPayment[];
}
