'use client';

import { useEffect, useState } from 'react';
import { getPayments } from '@/app/api/endpoints/payments';
import { signOut } from '@/app/api/endpoints/auth';
import { useUserStore } from '@/stores/users';
import { ExpandedPayment } from '@/types/payment';
import Card from '@/app/payments/card';
import { useRouter } from 'next/navigation';
import Loading from '@/components/common/loading';

export default function Page() {
  const router = useRouter();
  const [awaitingPayments, setAwaitingPayments] = useState<ExpandedPayment[] | null>(null);
  const [completedPayments, setCompletedPayments] = useState<ExpandedPayment[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExpandedPayments = async () => {
    setIsLoading(true);
    const payments = await getPayments();
    setAwaitingPayments(payments?.awaiting_payments as ExpandedPayment[]);
    setCompletedPayments(payments?.completed_payments as ExpandedPayment[]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExpandedPayments().then();
  }, []);

  const create = async () => {
    router.push('/payments/new');
  };

  const logout = async () => {
    await signOut();
    useUserStore.getState().setIsLogin(false);
    router.push('/login');
  };

  return (
    <div className="mt-6 flex flex-col justify-center font-geist">
      <h1 className="mt-10 mb-4 text-center text-2xl font-bold">支払い一覧</h1>

      <div className="flex justify-end">
        <div
          className="px-2 text-right text-xl font-bold border rounded cursor-pointer hover:opacity-70"
          onClick={create}
        >
          ＋新規作成
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className="text-2xl font-bold mt-4 text-orange-500">未完了</p>
          <ul className="mt-4">
            {awaitingPayments?.map((payment: ExpandedPayment) => (
              <Card key={payment.id} payment={payment} />
            ))}
          </ul>

          <p className="text-2xl font-bold mt-4 text-green-500">完了</p>
          <ul className="mt-4">
            {completedPayments?.map((payment) => <Card key={payment.id} payment={payment} />)}
          </ul>
        </>
      )}

      <div className="flex justify-center mt-24">
        <div
          className="text-lg border border-red-500 px-4 py-2 rounded hover:opacity-70 cursor-pointer"
          onClick={logout}
        >
          サインアウト
        </div>
      </div>
    </div>
  );
}
