import React from 'react';
import { ExpandedPayment } from '@/types/payment';
import { useRouter } from 'next/navigation';

interface CardProps {
  payment: ExpandedPayment;
}

export default function Card({ payment }: CardProps) {
  const isAwaiting = payment.status === 'awaiting';

  const router = useRouter();
  const handleClick = (paymentId: number) => {
    router.push(`/payments/${paymentId}`);
  };

  return (
    <li
      className="bg-white dark:bg-[#2a2a2a] p-5 mb-2 rounded-md w-full cursor-pointer"
      onClick={() => handleClick (payment.id)}
    >
      <div className="flex justify-between items-start">
        <p className="text-2xl font-bold">{payment.title}</p>
        <div
          className={`p-1 border rounded ${
            isAwaiting ? 'border-orange-500 text-orange-500' : 'border-green-500 text-green-500'
          }`}
        >
          {isAwaiting ? '未完了' : '完了'}
        </div>
      </div>
      <p className="mt-1 text-sm">{payment.payment_at?.slice (0, 10)}</p>
      <p className="mt-2.5">
        ¥{payment.amount}を、{payment.creator_name}さんが
        {isAwaiting ? '立て替えています。' : '立て替えていました。'}
      </p>
    </li>
  );
}
