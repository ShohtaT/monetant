'use client';

import { useEffect, useState } from 'react';
import { DebtRelationService } from '@/services/debtRelationService';
import { DebtRelation } from '@/types/debtRelation';
import { toast } from 'react-toastify';
import Card from './card';
import Loading from '@/components/common/loading';
import { useAuth } from '@/hooks/useAuth';

export default function Page() {
  const { isAuthChecking, isLogin } = useAuth();
  const [debtRelations, setDebtRelations] = useState<DebtRelation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDebtRelations = async () => {
    try {
      const debtRelationService = new DebtRelationService();
      const data = await debtRelationService.getMyAwaitingDebtRelations();
      setDebtRelations(data);
    } catch (error) {
      console.error('Error fetching debt relations:', error);
      toast('返済情報の取得に失敗しました', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthChecking && isLogin) {
      fetchDebtRelations();
    }
  }, [isAuthChecking, isLogin]);

  if (isAuthChecking || !isLogin) return <Loading />;

  if (isLoading) return <Loading />;

  const totalAmount = debtRelations
    .filter((dr) => dr.status === 'awaiting')
    .reduce((acc, dr) => acc + dr.split_amount, 0);

  return (
    <div className="mt-6 flex flex-col justify-center px-4 max-w-md mx-auto w-full font-geist mb-20">
      <h1 className="mt-8 mb-4 text-center text-2xl font-bold dark:text-white">
        あなたがすべき返済
      </h1>

      {debtRelations.length > 0 ? (
        <>
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">未返済の合計金額</p>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {totalAmount.toLocaleString()} 円
            </p>
          </div>

          <div className="space-y-4">
            {debtRelations.map((debtRelation) => (
              <Card key={debtRelation.id} debtRelation={debtRelation} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          返済すべき支払いはありません
        </div>
      )}
    </div>
  );
}
