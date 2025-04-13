import { DebtRelationRepository } from '@/repositories/debtRelationRepository';
import { AuthService } from '@/services/authService';
import { DebtRelation, DebtRelationsResponse } from '@/types/debtRelation';
import { User } from '@/types/user';

export class DebtRelationService {
  private debtRelationRepository: DebtRelationRepository;
  private authService: AuthService;

  constructor() {
    this.debtRelationRepository = new DebtRelationRepository();
    this.authService = new AuthService();
  }

  async getDebtRelations(paymentId: number): Promise<DebtRelationsResponse | null> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return null;

    const { data, error } = await this.debtRelationRepository.supabaseClient
      .from('Payments')
      .select(`
        *,
        DebtRelations (
          *,
          payee:Users!DebtRelations_payee_id_fkey(*)
        )
      `)
      .eq('id', paymentId)
      .limit(1);

    if (error || !data?.[0]) return null;

    const payment = data[0];
    const debtRelations = payment.DebtRelations?.map((dr: { payee: User }) => ({
      ...dr,
      payee: dr.payee
    })) ?? [];

    return {
      payment: payment,
      debt_relations: debtRelations
    };
  }

  async updateDebtRelation(id: number, params: Partial<DebtRelation>) {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return null;

    await this.debtRelationRepository.updateDebtRelation(id, params);
  }

  async getMyAwaitingDebtRelations(): Promise<DebtRelation[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return [];

    return await this.debtRelationRepository.getMyAwaitingDebtRelations(currentUser.id);
  }

  async getOthersAwaitingDebtRelations(): Promise<DebtRelation[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return [];

    const data = await this.debtRelationRepository.getOthersAwaitingDebtRelations(currentUser.id);
    
    return data?.flatMap(payment =>
      payment.DebtRelations.map(dr => ({
        ...dr,
        payment: {
          ...payment,
          DebtRelations: undefined,
        },
      }))
    ).sort((a, b) =>
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    ) ?? [];
  }

  private async getCurrentUser() {
    const user = await this.authService.getCurrentUser();
    if (!user) return null;
    return { id: user.id };
  }
}
