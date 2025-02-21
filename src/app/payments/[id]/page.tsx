'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/components/common/loading';
import { getDebtRelations, updateDebtRelations } from '@/app/api/endpoints/debtRelations';
import { DebtRelation, DebtRelationsResponse } from '@/types/debtRelation';
import { Payment } from '@/types/payment';
import { deletePayment, updatePayments } from '@/app/api/endpoints/payments';

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const [payment, setPayment] = useState<Payment | null>();
  const [debtRelations, setDebtRelations] = useState<DebtRelation[]>();
  const [isLoading, setIsLoading] = useState(false);

  const paymentId = Number(params.id);
  const fetchDebtRelations = async () => {
    setIsLoading(true);
    const debtRelations: DebtRelationsResponse | null = await getDebtRelations(paymentId);
    setPayment(debtRelations?.payment);
    setDebtRelations(debtRelations?.debt_relations ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDebtRelations().then();
  }, []);

  const unpaidAmount = (): number => {
    if (!payment || !debtRelations) return -1;

    return debtRelations
      .filter((dr) => dr.status === 'awaiting')
      .reduce((acc, dr) => acc + dr.split_amount, 0); // 回収済みの金額を除外
  };

  const updateDebtRelationStatus = async (
    debtRelationId: number,
    status: 'completed' | 'awaiting'
  ) => {
    // UI の即時更新
    setDebtRelations(
      (prev) =>
        prev?.map((debtRelation) =>
          debtRelation.id === debtRelationId ? { ...debtRelation, status } : debtRelation
        ) ?? []
    );

    // DB の更新
    await updateDebtRelations(debtRelationId, {
      status,
      paid_at: status === 'completed' ? new Date().toISOString() : null,
    });
  };

  const shouldCompletePayment = (debtRelationId: number): boolean => {
    if (!payment || !debtRelations) return false;

    return (
      payment?.status === 'awaiting' &&
      debtRelations
        ?.filter((dr) => dr.id !== debtRelationId)
        .every((dr) => dr.status === 'completed')
    );
  };

  const completeRepayment = async (debtRelationId: number) => {
    await updateDebtRelationStatus(debtRelationId, 'completed');

    // すべての debtRelation が `completed` なら、payment も `completed` に変更
    if (shouldCompletePayment(debtRelationId)) {
      setPayment((prev) => (prev ? { ...prev, status: 'completed' } : null));
      await updatePayments(paymentId, { status: 'completed' });
    }
  };

  const rollbackRepayment = async (debtRelationId: number) => {
    await updateDebtRelationStatus(debtRelationId, 'awaiting');

    // `payment` が `completed` なら `awaiting` に戻す
    if (payment?.status === 'completed') {
      setPayment((prev) => (prev ? { ...prev, status: 'awaiting' } : null));
      await updatePayments(paymentId, { status: 'awaiting' });
    }
  };

  const destroy = async () => {
    const result = window.confirm(
      `${payment?.title}を削除しますか？\n削除したデータは元に戻せません。`
    );
    if (!result) return;

    router.push('/payments');
    await deletePayment(paymentId);
  };

  return (
    <div className="mt-6 flex flex-col justify-center font-geist">
      <p className="mb-4 font-bold">
        <span className="underline cursor-pointer" onClick={() => router.push('/payments')}>
          一覧
        </span>{' '}
        ＞ 詳細
      </p>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h1 className="text-center text-2xl font-bold mb-2">「{payment?.title}」</h1>
          <p className="text-center text-sm mb-4">ID: {payment?.id}</p>

          <div className="p-5 mx-4 bg-gray-200 dark:bg-gray-900 text-center rounded-md">
            <p>支払い日: {payment?.payment_at?.slice(0, 10)}</p>
            <p>精算未完了額: ¥{unpaidAmount()}</p>
            <div className="flex justify-center mt-4">
              <div
                className="text-sm border border-red-500 px-4 py-1 rounded hover:opacity-70 cursor-pointer"
                onClick={destroy}
              >
                削除する
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-lg font-bold">請求内訳</div>
          <ul className="mt-4">
            {debtRelations?.map((debtRelation) => (
              <li
                key={debtRelation.id}
                className={
                  'bg-white dark:bg-[#1a1a1a] p-5 mb-2 rounded-md w-full border' +
                  (debtRelation.status === 'awaiting' && ' border-orange-500')
                }
              >
                <div className="flex justify-between items-center">
                  <div className="flex justify-start items-center gap-4">
                    {debtRelation.status === 'awaiting' && (
                      <div
                        className="text-2xl cursor-pointer"
                        onClick={() => completeRepayment(debtRelation.id)}
                      >
                        ☑️
                      </div>
                    )}
                    {debtRelation.status === 'completed' && (
                      <div
                        className="text-2xl cursor-pointer"
                        onClick={() => rollbackRepayment(debtRelation.id)}
                      >
                        ✅
                      </div>
                    )}
                    <div>
                      <div>{debtRelation.split_amount} 円</div>
                      <div>{debtRelation.payee?.nickname} さん</div>
                    </div>
                  </div>
                  {debtRelation.status === 'awaiting' && (
                    <div className="text-orange-500 font-bold">未完了</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
