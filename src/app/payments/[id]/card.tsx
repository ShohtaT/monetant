'use client';

import { DebtRelation } from '@/types/debtRelation';

interface CardProps {
  debtRelation: DebtRelation;
  completeRepaymentFunc: (debtRelationId: number) => void;
  rollbackRepaymentFunc: (debtRelationId: number) => void;
}

export default function Card({
  debtRelation,
  completeRepaymentFunc,
  rollbackRepaymentFunc,
}: CardProps) {
  return (
    <>
      <div
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
                onClick={() => completeRepaymentFunc(debtRelation.id)}
              >
                ☑️
              </div>
            )}
            {debtRelation.status === 'completed' && (
              <div
                className="text-2xl cursor-pointer"
                onClick={() => rollbackRepaymentFunc(debtRelation.id)}
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
      </div>
    </>
  );
}
