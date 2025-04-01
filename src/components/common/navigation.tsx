'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaListCheck } from 'react-icons/fa6';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { useNavigationStore } from '@/stores/navigation';

export const Navigation = () => {
  const pathname = usePathname();
  const { activeNav, setActiveNav } = useNavigationStore();

  // ログインとサインアップページでは非表示
  if (pathname === '/login' || pathname === '/signup') return null;

  const navItems = [
    {
      icon: <FaListCheck />,
      path: '/',
      type: 'payments' as const,
    },
    {
      icon: <IoPersonCircleOutline />,
      path: '/mypage',
      type: 'mypage' as const,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setActiveNav(item.type)}
              className={`flex-1 py-3 flex justify-center items-center text-xl ${
                activeNav === item.type
                  ? 'text-green-500 border-t-2 border-green-500'
                  : 'border-t-2 border-transparent'
              }`}
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
