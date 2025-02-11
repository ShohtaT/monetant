'use client';

import Home from '@/app/payments/page';
import Login from '@/app/login/page';
import { useEffect } from 'react';
import { useUserStore } from '@/stores/users';
import { useRouter } from 'next/navigation';

// root component
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const isLogin = useUserStore.getState().getIsLogin();
    if (!isLogin) {
      router.push('/login');
    }
  }, []);

  const isLogin = useUserStore((state) => state.isLogin);

  return <div>{isLogin ? <Home /> : <Login />}</div>;
}
