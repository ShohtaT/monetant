'use client';

import { DebtRelation } from '@/types/debtRelation';
import { useEffect, useState } from 'react';
import { getDebtRelations } from '@/app/api/endpoints/debtRelations';
import {useParams, useRouter} from 'next/navigation';
import Loading from '@/components/common/loading';

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const [debtRelations, setDebtRelations] = useState<DebtRelation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const paymentId = Number(params.id);
  const fetchDebtRelations = async () => {
    setIsLoading(true);
    const data: DebtRelation[] = await getDebtRelations(paymentId);
    setDebtRelations(data);
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
          <ul className="mt-4">
            {debtRelations.map((debtRelation) => (
              <li
                key={debtRelation.id}
                className="border p-5 mb-2 rounded-md w-full flex justify-between items-center"
              >
                <div>
                  【{debtRelation.id}: {debtRelation.status}】 ¥{debtRelation.split_amount}
                  <br />
                  {debtRelation.payer_id} さんへ
                </div>
                <div className="p-2 border border-green-400 rounded">返済完了</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
