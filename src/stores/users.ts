import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  isLogin: boolean;
  getIsLogin: () => boolean;
  setIsLogin: (value: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isLogin: false,

      getIsLogin: () => get().isLogin,

      setIsLogin: (value: boolean) => set({ isLogin: value }),

      logout: () => set({ isLogin: false }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
