'use client';

import { useEffect, useState } from 'react';
import { getPayments } from '@/app/api/endpoints/payments';
import { signOut } from '@/app/api/endpoints/auth';
import { useUserStore } from '@/stores/users';
import { ExpandedPayment } from '@/types/payment';
import Card from '@/app/payments/card';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [awaitingPayments, setAwaitingPayments] = useState<ExpandedPayment[] | null>(null);
  const [completedPayments, setCompletedPayments] = useState<ExpandedPayment[] | null>(null);

  const fetchExpandedPayments = async () => {
    const payments = await getPayments();
    setAwaitingPayments(payments?.awaiting_payments as ExpandedPayment[]);
    setCompletedPayments(payments?.completed_payments as ExpandedPayment[]);
    return;
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
      <h1 className="text-center text-2xl font-bold mb-4">支払い一覧</h1>

      <div className="flex justify-end mb-4">
        <div className="text-xl cursor-pointer hover:opacity-70" onClick={logout}>
          サインアウト
        </div>
      </div>

      <div className="flex justify-end">
        <div
          className="px-2 text-right text-xl font-bold border border-black rounded cursor-pointer hover:opacity-70"
          onClick={create}
        >
          ＋新規作成
        </div>
      </div>

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
    </div>
  );
}
