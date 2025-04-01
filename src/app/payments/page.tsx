'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/common/loading';
import { useAuth } from '@/hooks/useAuth';
import { usePaymentsStore } from '@/stores/payments';
import Card from '@/app/payments/card';
import { toast } from 'react-toastify';

export default function Page() {
  const router = useRouter();
  const { isAuthChecking, isLogin } = useAuth();
  const { awaitingPayments, completedPayments, isLoading, isInitialized, fetchPayments } =
    usePaymentsStore();

  useEffect(() => {
    if (!isAuthChecking && isLogin && !isInitialized) {
      fetchPayments().catch((error) => {
        console.error('Error fetching payments:', error);
        toast('支払い情報の取得に失敗しました', { type: 'error' });
      });
    }
  }, [isAuthChecking, isLogin, isInitialized, fetchPayments]);

  const create = () => {
    router.push('/payments/new');
  };

  if (isAuthChecking || !isLogin) return <Loading />;

  if (isLoading) return <Loading />;

  return (
    <div className="mt-6 flex flex-col justify-center font-geist">
      <h1 className="mt-10 mb-4 text-center text-2xl font-bold">お金のやりとり一覧</h1>

      <div className="mt-2 flex justify-end">
        <div
          className="px-2 text-right bg-blue-500 text-white dark:text-black text-lg border dark:border-gray-700 rounded cursor-pointer hover:opacity-80"
          onClick={create}
        >
          ＋新規請求
        </div>
      </div>

      <>
        {/* 未完了 */}
        <p className="text-2xl font-bold mt-4 text-orange-500">未完了</p>
        {awaitingPayments?.length === 0 ? (
          <p className="text-center">
            未完了の支払いはありません！
            <br />
            その調子です！🎉
          </p>
        ) : (
          <p className="mt-1 text-[12px]">
            あなたが貸しているか借りている未完了のやりとりが表示されます。
            <br />
            「未完了」がなくなることを目指して管理しましょう！
          </p>
        )}
        <ul className="mt-4">
          {awaitingPayments?.map((payment) => <Card key={payment.id} payment={payment} />)}
        </ul>

        {/* 完了 */}
        {completedPayments?.length !== 0 && (
          <>
            <p className="text-2xl font-bold mt-4 text-green-500">完了</p>
            <ul className="mt-4">
              {completedPayments?.map((payment) => <Card key={payment.id} payment={payment} />)}
            </ul>
          </>
        )}
      </>
    </div>
  );
}
