'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/users';
import { signOut } from '@/app/api/endpoints/auth';
import { toast } from 'react-toastify';
import { IoIosArrowForward } from 'react-icons/io';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function MyPage() {
  const router = useRouter();
  const isLogin = useUserStore((state) => state.isLogin);

  useEffect(() => {
    if (!isLogin) {
      router.push('/login');
    }
  }, [isLogin, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      useUserStore.getState().logout();
      router.push('/login');
      toast('ログアウトしました', { type: 'success' });
    } catch (error) {
      toast(`ログアウトに失敗しました\n${error}`, { type: 'error' });
    }
  };

  if (!isLogin) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col justify-center px-4 max-w-md mx-auto w-full font-geist">
      <h1 className="mt-10 mb-6 text-center text-2xl font-bold">マイページ</h1>

      <div className="space-y-4">
        <Link href="/payments/new" className="block">
          <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">新しい請求を作成</span>
            <FiPlus className="text-gray-400 text-xl" />
          </div>
        </Link>

        <Link href="/payments" className="block">
          <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">あなたがすべき返済</span>
            <IoIosArrowForward className="text-gray-400 text-xl" />
          </div>
        </Link>

        <Link href="/payments" className="block">
          <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">あなたが請求中の支払い</span>
            <IoIosArrowForward className="text-gray-400 text-xl" />
          </div>
        </Link>
      </div>

      <div className="mt-12">
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
        >
          サインアウト
        </button>
      </div>
    </div>
  );
}
