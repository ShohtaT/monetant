'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/users';

export default function MyPage() {
  const router = useRouter();
  const isLogin = useUserStore((state) => state.isLogin);

  useEffect(() => {
    if (!isLogin) {
      router.push('/login');
    }
  }, [isLogin, router]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col justify-center font-geist">
      <h1 className="mt-10 mb-4 text-center text-2xl font-bold">マイページ</h1>

      <div className="bg-white dark:bg-[#1a1a1a] p-5 mb-2 rounded-md w-full cursor-pointer">
        <p>あなたがすべき返済</p>
      </div>
    </div>
  );
}
