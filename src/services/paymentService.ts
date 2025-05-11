import { PaymentRepository } from '@/repositories/paymentRepository';
import { DebtRelationRepository } from '@/repositories/debtRelationRepository';
import { AuthService } from '@/services/authService';
import { Billing, Payment, PaymentList, ExpandedPayment } from '@/types/payment';

export class PaymentService {
  private paymentRepository: PaymentRepository;
  private debtRelationRepository: DebtRelationRepository;
  private authService: AuthService;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.debtRelationRepository = new DebtRelationRepository();
    this.authService = new AuthService();
  }

  async createPayment(
    title: string,
    paymentDate: string,
    amount: number,
    billings: Billing[],
    note?: string
  ): Promise<Payment | undefined> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return undefined;

    // Create Payment
    await this.paymentRepository.createPayment({
      title,
      amount,
      note,
      status: 'awaiting',
      creator_id: currentUser.id,
      payment_at: paymentDate,
    });

    const newPayment = await this.paymentRepository.getLastPayment();
    if (!newPayment) return undefined;

    // Create DebtRelations
    for (const billing of billings) {
      if (billing.user === null) continue;
      await this.debtRelationRepository.createDebtRelation({
        payment_id: newPayment.id,
        payee_id: billing.user?.id,
        status: 'awaiting',
        split_amount: billing.splitAmount,
      });
    }

    return newPayment;
  }

  async getPayments(): Promise<PaymentList | null> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return null;

    // Get all payments associated with current user
    const myPayments = await this.paymentRepository.getPaymentsByCreatorId(currentUser.id);
    const debtRelations = await this.debtRelationRepository.getMyAwaitingDebtRelations(
      currentUser.id
    );

    const myPaymentIds = [
      ...new Set([
        ...myPayments.map((payment) => payment.id),
        ...debtRelations.map((dr) => dr.payment_id),
      ]),
    ];

    const allPayments = await Promise.all(
      myPaymentIds.map((id) => this.paymentRepository.getPaymentWithDebtRelations(id))
    );

    return {
      awaiting_payments: await this.expandPayments(allPayments.filter(Boolean), 'awaiting'),
      completed_payments: await this.expandPayments(allPayments.filter(Boolean), 'completed'),
    };
  }

  async deletePayment(paymentId: number): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return;

    await this.paymentRepository.deletePayment(paymentId);
  }

  async updatePayment(id: number, params: Partial<Payment>) {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return null;

    await this.paymentRepository.updatePayment(id, params);
  }

  private async getCurrentUser() {
    const user = await this.authService.getCurrentUser();
    if (!user) return null;
    return { id: user.id };
  }

  private async expandPayments(payments: Payment[], status: string): Promise<ExpandedPayment[]> {
    // Here you would implement the logic to expand payments with creator names
    // This is simplified for now
    return payments
      .filter((payment) => payment.status === status)
      .map((payment) => ({
        ...payment,
        creator_name: 'Unknown', // You would typically get this from your Users table
      }));
  }
}
