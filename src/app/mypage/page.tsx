'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/users';
import { signOut } from '@/app/api/endpoints/auth';
import { toast } from 'react-toastify';

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
    <div className="mt-6 flex flex-col justify-center font-geist">
      <h1 className="mt-10 mb-4 text-center text-2xl font-bold">マイページ</h1>

      <div className="bg-white dark:bg-[#1a1a1a] p-5 mb-2 rounded-md w-full cursor-pointer">
        <p>あなたがすべき返済</p>
      </div>

      <div className="mt-8">
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
        >
          サインアウト
        </button>
      </div>
    </div>
  );
}
