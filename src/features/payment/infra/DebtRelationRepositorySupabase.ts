// DebtRelationリポジトリ（インフラ層）
import { supabaseClient } from '@/shared/lib/supabaseClient';
import { DebtRelation, DebtRelationCreate } from '@/shared/types/debtRelation';

export const debtRelationRepository = {
  async createDebtRelation(debtRelation: DebtRelationCreate) {
    const { error } = await supabaseClient.from('DebtRelations').insert([debtRelation]);
    if (error) throw error;
  },
  // 必要に応じて他のメソッドも移植
};
