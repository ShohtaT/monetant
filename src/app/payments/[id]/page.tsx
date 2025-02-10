'use client';

import { DebtRelations } from '@/types/debtRelations';
import { useEffect, useState } from 'react';
import { createDebtRelation, getDebtRelations } from '@/app/api/debtRelations';
import {useRouter} from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [debtRelations, setDebtRelations] = useState<DebtRelations[]>([]);

  const fetchDebtRelations = async () => {
    const data: DebtRelations[] = await getDebtRelations(6);
    setDebtRelations(data);
  };

  useEffect(() => {
    fetchDebtRelations().then();
  }, []);

  const create = async () => {
    await createDebtRelation(
      6,
      'ab18abf4-08d3-46e0-bf0e-871e32fa16b7',
      'ab18abf4-08d3-46e0-bf0e-871e32fa16b7',
      100
    );
  };

  return (
    <div className="m-20 flex flex-col justify-center font-geist">
      <p className="mb-4 font-bold">
        <span className="underline cursor-pointer" onClick={() => router.push('/')}>
        一覧
      </span> ＞ 詳細
      </p>
      
      <h1 className="text-2xl font-bold mb-4">詳細ページ</h1>

      <h1 className="text-2xl font-bold mb-4 cursor-pointer" onClick={create}>
        新規作成
      </h1>

      <ul className="mt-4">
        {debtRelations.map((debtRelation) => (
          <li key={debtRelation.id}
              className="border p-5 mb-2 rounded-md w-full flex justify-between items-center">
            <div>
              【{debtRelation.id}: {debtRelation.status}】 ¥{debtRelation.split_amount}
              <br/>
              {debtRelation.payer_id} さんへ
            </div>
            <div className="p-2 border border-green-400 rounded">
              返済完了
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
