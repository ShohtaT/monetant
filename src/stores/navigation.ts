import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type NavType = 'payments' | 'mypage';

interface NavigationState {
  activeNav: NavType;
  setActiveNav: (nav: NavType) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      activeNav: 'payments',
      setActiveNav: (nav: NavType) => set({ activeNav: nav }),
    }),
    {
      name: 'navigation-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
