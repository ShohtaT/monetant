export interface CreatePaymentRequest {
  title: string;
  amount: number;
  note?: string;
  debtDetails: {
    debtorId: number;
    splitAmount: number;
  }[];
}
