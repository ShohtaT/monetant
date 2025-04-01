'use client';

import { DebtRelation } from '@/types/debtRelation';
import Link from 'next/link';

interface CardProps {
  debtRelation: DebtRelation;
}

export default function Card({ debtRelation }: CardProps) {
  return (
    <Link href={`/payments/${debtRelation.payment_id}`}>
      <div
        className={
          'bg-white dark:bg-[#1a1a1a] p-5 mb-2 rounded-md w-full border cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors' +
          (debtRelation.status === 'awaiting' ? ' border-orange-500' : ' border-gray-100 dark:border-gray-800')
        }
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="text-gray-700 dark:text-gray-300 text-lg mb-1">
              {debtRelation.payment?.title}
            </div>
            <div className="flex gap-2 items-center">
              <div className="text-gray-700 dark:text-gray-300">{debtRelation.split_amount.toLocaleString()} 円</div>
              <div className="text-sm text-gray-500">支払先: {debtRelation.payment?.creator?.nickname} さん</div>
            </div>
          </div>
          {debtRelation.status === 'awaiting' ? (
            <div className="text-orange-500 font-bold">未完了</div>
          ) : (
            <div className="text-green-500 font-bold">完了済</div>
          )}
        </div>
      </div>
    </Link>
  );
}