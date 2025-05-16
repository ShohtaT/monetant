'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/components/common/loading';
import { DebtRelation } from '@/types/debtRelation';
import { Payment } from '@/types/payment';
import { User } from '@/types/user';
import { UserRepository } from '@/repositories/userRepository';

import PaymentDetail from '@/app/payments/[id]/paymentDetail';
import Card from '@/app/payments/[id]/card';
import { getPaymentDetailUseCase } from '@/features/payment/application/getPaymentDetail';

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const [payment, setPayment] = useState<Payment | null>();
  const [payer, setPayer] = useState<User | null>();
  const [debtRelations, setDebtRelations] = useState<DebtRelation[]>();
  const [isLoading, setIsLoading] = useState(false);

  const paymentId = Number(params.id);

  const fetchDebtRelations = useCallback(async () => {
    setIsLoading(true);
    const detail = await getPaymentDetailUseCase(paymentId);
    setPayment(detail?.payment ?? null);
    setDebtRelations(detail?.debt_relations ?? []);
    setIsLoading(false);
  }, [paymentId]);
  useEffect(() => {
    fetchDebtRelations();
  }, [fetchDebtRelations]);

  const fetchPayer = useCallback(async () => {
    if (!payment) return;

    const userRepository = new UserRepository();
    const data = await userRepository.getUserById(payment?.creator_id);
    setPayer(data);
  }, [payment]);
  useEffect(() => {
    if (payment) fetchPayer();
  }, [payment, fetchPayer]);

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

  // 完了・未完了操作は未実装。必要に応じてAPI経由で実装してください。
  const completeRepayment = async (debtRelationId: number) => {
    // TODO: API経由で支払い完了処理を実装
  };

  const rollbackRepayment = async (debtRelationId: number) => {
    // TODO: API経由で支払い未完了処理を実装
  };

  // updateDebtRelationStatusは未実装。必要に応じてAPI経由で実装してください。

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
