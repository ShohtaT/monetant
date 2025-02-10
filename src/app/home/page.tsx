'use client';

import { useEffect, useState } from 'react';
import { createPayment, getPayments } from '@/app/api/payments';
import { Payments } from '@/types/payments';
import { signout } from '@/app/api/users';
import { useUserStore } from '@/stores/users';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [paymentsData, setPaymentsData] = useState<Payments[]>([]);
  const router = useRouter();

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

  const handleClick = () => {
    router.push(`/payments/${1}`);
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
          <li
            key={payment.id}
            className="border p-5 mb-2 rounded-md w-full flex justify-between items-center"
          >
            <div>
              <p>【{payment.id}】 {payment.name}: ¥{payment.amount}</p>
              <p>立て替えた人: {payment.creator_id} さん</p>
            </div>
            <div className="p-2 border border-amber-200 rounded cursor-pointer" onClick={handleClick}>未払いがあります</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
