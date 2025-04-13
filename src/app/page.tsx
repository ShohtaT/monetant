'use client';

import Home from '@/app/payments/page';
import { useUserStore } from '@/stores/users';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const isLogin = useUserStore((state) => state.isLogin);

  useEffect(() => {
    if (!isLogin) {
      router.replace('/login');
    }
  }, [isLogin, router]);

  if (!isLogin) {
    return null;
  }

  return <Home />;
}
