import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface UserState {
  isLogin: boolean;
  user: User | null;
  getIsLogin: () => boolean;
  setIsLogin: (value: boolean) => void;
  getUser: () => User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isLogin: false,
      user: null,
      getIsLogin: () => get().isLogin,
      setIsLogin: (value: boolean) => set({ isLogin: value }),
      getUser: () => get().user,
      setUser: (user: User) => set({ user }),
      logout: () => set({ isLogin: false, user: null }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
