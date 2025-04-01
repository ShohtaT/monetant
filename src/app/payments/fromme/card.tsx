'use client';

import Link from 'next/link';
import { DebtRelation } from '@/types/debtRelation';

export default function Card({ debtRelation }: { debtRelation: DebtRelation }) {
  return (
    <Link
      href={`/payments/${debtRelation.payment_id}`}
      className="block rounded-lg border border-gray-200 dark:border-gray-800"
    >
      <div className="px-5 py-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {debtRelation.payment?.note}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(debtRelation.created_at!).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium dark:text-white">
              {debtRelation.payee?.nickname}さんへの請求
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            ¥{debtRelation.split_amount.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
