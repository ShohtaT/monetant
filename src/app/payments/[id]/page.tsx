'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/components/common/loading';
import { getDebtRelations } from '@/app/api/endpoints/debtRelations';
import { DebtRelation, DebtRelationsResponse } from '@/types/debtRelation';
import { Payment } from '@/types/payment';

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

  return (
    <div className="mt-6 flex flex-col justify-center font-geist">
      <p className="mb-4 font-bold">
        <span className="underline cursor-pointer" onClick={() => router.push('/payments')}>
          一覧
        </span>{' '}
        ＞ 詳細
      </p>

      <h1 className="text-center text-2xl font-bold mb-4">詳細ページ</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="p-5 mx-4 bg-gray-200 dark:bg-gray-900 text-center rounded-md">
            <p className="text-lg font-bold underline">{payment?.title}</p>
            <p>支払いID: {payment?.id}</p>
            <p>支払い日: {payment?.payment_at?.slice(0, 10)}</p>
            <p>精算未完了額: ¥{payment?.amount}</p>
          </div>

          <div className="mt-8 text-center text-lg font-bold">請求内訳</div>
          <ul className="mt-4">
            {debtRelations?.map((debtRelation) => (
              <li
                key={debtRelation.id}
                className="bg-white dark:bg-[#1a1a1a] p-5 mb-2 rounded-md w-full flex justify-between items-center"
              >
                <div>
                  【{debtRelation.id}: {debtRelation.status}】 ¥{debtRelation.split_amount}
                  <br />
                  {debtRelation.payee?.nickname} さん
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
