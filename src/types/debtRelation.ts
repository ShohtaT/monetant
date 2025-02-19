import {User} from "@/types/user";
import {Payment} from "@/types/payment";

export interface DebtRelation {
  id: number;
  payment_id: number;
  payer_id: number;
  payer?: User;
  payee_id: number;
  payee?: User;
  status: 'awaiting' | 'completed';
  split_amount: number;
  paid_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DebtRelationCreate {
  payment_id: number;
  payer_id: number;
  payee_id: number;
  status: 'awaiting' | 'completed';
  split_amount: number;
  paid_at?: string;
}

export interface DebtRelationsResponse {
  payment: Payment;
  debt_relations: DebtRelation[];
}
