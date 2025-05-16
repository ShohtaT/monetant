import { User } from './user';

export interface Payment {
  id: number;
  title: string;
  amount: number;
  note?: string;
  status: 'awaiting' | 'completed';
  creator_id: number;
  payment_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentCreate {
  title: string;
  amount: number;
  note?: string;
  status: 'awaiting' | 'completed';
  payment_at: string;
  creator_id: number;
}

export interface ExpandedPayment extends Payment {
  creator_name: string;
}

export interface PaymentList {
  awaiting_payments: ExpandedPayment[];
  completed_payments: ExpandedPayment[];
}

export interface Billing {
  user: User | null;
  splitAmount: number;
}
