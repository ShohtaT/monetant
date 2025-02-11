'use client';

import { useEffect, useState } from 'react';
import { createPayment, getPayments } from '@/app/api/endpoints/payments';
import { Payment } from '@/types/payment';
import { signOut } from '@/app/api/endpoints/auth';
import { useUserStore } from '@/stores/users';
import { useRouter } from 'next/navigation';
import {getUser} from "@/app/api/endpoints/user";

interface ExpandPayment extends Payment {
  creator_name: string;
}

export default function Page() {
  const [expandedPaymentsData, setExpandedPaymentsData] = useState<ExpandPayment[]>([]);
  const router = useRouter();

  const fetchExpandedPayments = async () => {
    const data: Payment[] = await getPayments();
    const expandData: ExpandPayment[] = await Promise.all(data.map(async (payment) => {
      const creator = await getUser(payment.creator_id);
      return {
        ...payment,
        creator_name: creator?.nickname ?? 'unknown',
      };
    }));
    setExpandedPaymentsData(expandData);
  };
  
  const awaitingPayments = expandedPaymentsData.filter((payment) => payment.status === 'awaiting');
  const completedPayments = expandedPaymentsData.filter((payment) => payment.status === 'completed');

  useEffect(() => {
    fetchExpandedPayments().then();
  }, []);

  const create = async () => {
    await createPayment('cool', 100);
  };

  const logout = async () => {
    await signOut();
    useUserStore.getState().setIsLogin(false);
  };

  const handleClick = () => {
    router.push(`/payments/${1}`);
  };

  return (
    <div className="mt-6 flex flex-col justify-center font-geist">
      <h1 className="text-center text-2xl font-bold mb-4">支払い一覧</h1>
      
      <div className="flex justify-end mb-4" onClick={create}>
        <div className="text-xl cursor-pointer hover:opacity-70" onClick={logout}>
          サインアウト
        </div>
      </div>
      
      <div className="flex justify-end">
        <div className="px-2 text-right text-xl font-bold border border-black rounded cursor-pointer hover:opacity-70"
             onClick={create}>
          ＋新規作成
        </div>
      </div>
      
      <p className="text-2xl font-bold mt-4 text-orange-500">未完了</p>
      <ul className="mt-4">
        {awaitingPayments.map ((payment) => (
          <li
            key={payment.id}
            className="bg-white dark:bg-[#2a2a2a] p-5 mb-2 rounded-md w-full cursor-pointer"
            onClick={handleClick}
          >
            <div className="flex justify-between items-start">
              <p>
                {payment.payment_at.slice (0, 10)}
              </p>
              <div className="p-1 border border-orange-500 text-orange-500 rounded">
                未完了
              </div>
            </div>
            <p className="text-xl font-bold">
              {payment.title}
            </p>
            <p className="mt-2.5">
              ¥{payment.amount}を、{payment.creator_name}さんが立て替えています。
            </p>
          </li>
        ))}
      </ul>
      
      <p className="text-2xl font-bold mt-4 text-green-500">完了</p>
      <ul className="mt-4">
        {completedPayments.map ((payment) => (
          <li
            key={payment.id}
            className="bg-white dark:bg-[#2a2a2a] p-5 mb-2 rounded-md w-full cursor-pointer"
            onClick={handleClick}
          >
            <div className="flex justify-between items-start">
              <p>
                {payment.payment_at.slice (0, 10)}
              </p>
              <div className="p-1 border border-green-500 text-green-500 rounded">
                完了
              </div>
            </div>
            <p className="text-xl font-bold">
              {payment.title}
            </p>
            <p className="mt-2.5">
              ¥{payment.amount}を、{payment.creator_name}さんが立て替えていました。
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
