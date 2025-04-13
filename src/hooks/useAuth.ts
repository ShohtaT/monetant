import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/users';

export function useAuth() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const isLogin = useUserStore((state) => state.isLogin);

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = useUserStore.getState().getIsLogin();
      if (!isLoggedIn) {
        router.replace('/login');
        return;
      }
      setIsAuthChecking(false);
    };

    checkAuth();
  }, [router]);

  return {
    isAuthChecking,
    isLogin,
  };
}
