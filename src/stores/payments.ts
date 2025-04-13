import { create } from 'zustand';
import { ExpandedPayment } from '@/types/payment';
import { PaymentService } from '@/services/paymentService';

type PaymentsStore = {
  awaitingPayments: ExpandedPayment[] | null;
  completedPayments: ExpandedPayment[] | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: Error | null;
  fetchPayments: () => Promise<void>;
  clearPayments: () => void;
};

export const usePaymentsStore = create<PaymentsStore>((set) => ({
  awaitingPayments: null,
  completedPayments: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  fetchPayments: async () => {
    set({ isLoading: true, error: null });
    try {
      const paymentService = new PaymentService();
      const payments = await paymentService.getPayments();
      set({
        awaitingPayments: payments?.awaiting_payments || null,
        completedPayments: payments?.completed_payments || null,
        isInitialized: true,
      });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },
  clearPayments: () => {
    set({
      awaitingPayments: null,
      completedPayments: null,
      isInitialized: false,
      error: null,
    });
  },
}));
