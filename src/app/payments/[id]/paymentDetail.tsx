'use client';

import { Payment } from '@/types/payment';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { deletePayment } from '@/app/api/endpoints/payments';
import { toast } from 'react-toastify';

interface PaymentDetailProps {
  payment: Payment | null | undefined;
  payer: User | null | undefined;
  unpaidAmount: number;
  unpaidNumberOfPeople: number;
}

export default function PaymentDetail({
  payment,
  payer,
  unpaidAmount,
  unpaidNumberOfPeople,
}: PaymentDetailProps) {
  const router = useRouter();

  const destroy = async () => {
    if (!payment) return;

    const result = window.confirm(
      `${payment?.title}を削除しますか？\n削除したデータは元に戻せません。`
    );
    if (!result) return;

    router.push('/payments');
    await deletePayment(payment.id);
    toast('支払いデータを削除しました', { type: 'success' });
  };

  return (
    <div className="p-5 mx-4 bg-gray-200 dark:bg-gray-900 text-center rounded-md">
      {payment === null && payer === null ? (
        <div className="my-2 text-center">データの取得に失敗しました</div>
      ) : (
        <>
          <p>支払い日: {payment?.payment_at?.slice(0, 10)}</p>
          <p>
            精算未完了額: ¥{unpaidAmount}（{unpaidNumberOfPeople}人）
          </p>
          <p>{payer?.nickname} さんへの返済</p>
          <p className="mt-1 text-[12px] text-gray-400">{payment?.note}</p>
          <div className="flex justify-center mt-4">
            <div
              className="text-sm border border-red-500 px-4 py-1 rounded hover:opacity-70 cursor-pointer"
              onClick={destroy}
            >
              削除する
            </div>
          </div>
        </>
      )}
    </div>
  );
}
