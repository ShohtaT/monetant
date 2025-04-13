'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/users';
import { signOut } from '@/app/api/endpoints/auth';
import { getCurrentUser } from '@/app/api/helper/authHelper';
import { toast } from 'react-toastify';
import { IoIosArrowForward } from 'react-icons/io';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function MyPage() {
  const router = useRouter();
  const isLogin = useUserStore((state) => state.isLogin);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (!isLogin) {
      router.push('/login');
      return;
    }

    if (!user) {
      const fetchUser = async () => {
        try {
          const userData = await getCurrentUser();
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          toast('ユーザー情報の取得に失敗しました', { type: 'error' });
        }
      };

      fetchUser();
    }
  }, [isLogin, router, user, setUser]);

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
    <div className="mt-6 flex flex-col justify-center px-4 max-w-md mx-auto w-full font-geist mb-20">
      <h1 className="mt-8 mb-6 text-center text-2xl font-bold dark:text-white">マイページ</h1>

      <div className="space-y-4">
        <div className="bg-white dark:bg-[#1a1a1a] shadow-sm p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-2 dark:text-white">プロフィール</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">ニックネーム</p>
            <p className="text-gray-700 dark:text-gray-300">{user?.nickname || 'Loading...'}</p>
          </div>
        </div>

        <Link href="/payments/tome" className="block">
          <div className="bg-white dark:bg-[#1a1a1a] shadow-sm border border-gray-100 dark:border-gray-800 p-4 rounded-lg flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
            <span className="text-gray-700 dark:text-gray-300">あなたがすべき返済</span>
            <IoIosArrowForward className="text-gray-400 dark:text-gray-500 text-xl" />
          </div>
        </Link>

        <Link href="/payments/fromme" className="block">
          <div className="bg-white dark:bg-[#1a1a1a] shadow-sm border border-gray-100 dark:border-gray-800 p-4 rounded-lg flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
            <span className="text-gray-700 dark:text-gray-300">あなたが請求中の支払い</span>
            <IoIosArrowForward className="text-gray-400 dark:text-gray-500 text-xl" />
          </div>
        </Link>

        <Link href="/payments/new" className="block">
          <div className="bg-white dark:bg-[#1a1a1a] shadow-sm border border-gray-100 dark:border-gray-800 p-4 rounded-lg flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
            <span className="text-gray-700 dark:text-gray-300">新しい請求を作成</span>
            <FiPlus className="text-gray-400 dark:text-gray-500 text-xl" />
          </div>
        </Link>
      </div>

      <div className="mt-8">
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
