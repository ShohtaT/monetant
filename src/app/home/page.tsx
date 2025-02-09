'use client';

import { useEffect, useState } from 'react';
import { createPayment, getPayments } from '@/app/api/payments';
import { Payments } from '@/types/payments';
import { signout } from '@/app/api/users';
import { useUserStore } from '@/stores/users';

export default function Page() {
  const [paymentsData, setPaymentsData] = useState<Payments[]>([]);

  const fetchPayments = async () => {
    const data: Payments[] = await getPayments();
    setPaymentsData(data);
  };

  useEffect(() => {
    fetchPayments().then();
  }, []);

  const create = async () => {
    await createPayment('cool', 100);
  };

  const logout = async () => {
    await signout();
    useUserStore.getState().setIsLogin(false);
  };

  return (
    <div className="m-20 flex flex-col justify-center font-geist">
      <h1 className="text-2xl font-bold mb-4 cursor-pointer" onClick={logout}>
        サインアウト
      </h1>

      <h1 className="text-2xl font-bold mb-4 cursor-pointer" onClick={create}>
        新規作成
      </h1>

      <ul className="mt-4">
        {paymentsData.map((payment) => (
          <li key={payment.id} className="border p-5 mb-2 rounded-md w-full">
            【{payment.id}】 {payment.name}: ¥{payment.amount}
            <br />
            user: {payment.creator_id}
          </li>
        ))}
      </ul>
    </div>
  );
}
