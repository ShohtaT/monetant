'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/components/common/loading';
import { getDebtRelations, updateDebtRelations } from '@/app/api/endpoints/debtRelations';
import { DebtRelation, DebtRelationsResponse } from '@/types/debtRelation';
import { Payment } from '@/types/payment';
import { updatePayments } from '@/app/api/endpoints/payments';
import { User } from '@/types/user';
import { getUserByUserIdToSupabase } from '@/app/api/helper/userHelper';
import PaymentDetail from '@/app/payments/[id]/paymentDetail';
import Card from '@/app/payments/[id]/card';
import { toast } from 'react-toastify';

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const [payment, setPayment] = useState<Payment | null>();
  const [payer, setPayer] = useState<User | null>();
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

  const fetchPayer = async () => {
    if (!payment) return;

    await getUserByUserIdToSupabase(payment?.creator_id).then((data) => {
      setPayer(data);
    });
  };
  useEffect(() => {
    if (payment) fetchPayer().then();
  }, [payment]);

  const unpaidAmount = (): number => {
    if (!debtRelations) return -1;

    return debtRelations
      .filter((dr) => dr.status === 'awaiting')
      .reduce((acc, dr) => acc + dr.split_amount, 0); // 回収済みの金額を除外
  };

  const unpaidNumberOfPeople = (): number => {
    if (!debtRelations) return -1;

    return debtRelations.filter((dr) => dr.status === 'awaiting').length;
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
    try {
      await updateDebtRelations(debtRelationId, {
        status,
        paid_at: status === 'completed' ? new Date().toISOString() : null,
      });
      toast(
        status === 'completed' ? '支払いを"完了"に変更しました' : '支払いを"未完了"に変更しました',
        { type: 'success' }
      );
    } catch (error) {
      toast(`ステータスの更新に失敗しました\n${error}`, { type: 'error' });
    }
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

          <PaymentDetail
            payment={payment}
            payer={payer}
            unpaidAmount={unpaidAmount()}
            unpaidNumberOfPeople={unpaidNumberOfPeople()}
          />

          <div className="mt-8 text-center text-lg font-bold">請求内訳</div>
          <ul className="mt-4">
            {debtRelations?.map((debtRelation) => (
              <Card
                key={debtRelation.id}
                debtRelation={debtRelation}
                completeRepaymentFunc={() => completeRepayment(debtRelation.id)}
                rollbackRepaymentFunc={() => rollbackRepayment(debtRelation.id)}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
