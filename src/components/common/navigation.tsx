'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaListCheck } from 'react-icons/fa6';
import { IoPersonCircleOutline } from 'react-icons/io5';

export const Navigation = () => {
  const pathname = usePathname();

  // ログインとサインアップページでは非表示
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const navItems = [
    {
      icon: <FaListCheck />,
      path: '/',
      isActive: pathname === '/' || pathname.startsWith('/payments'),
    },
    { icon: <IoPersonCircleOutline />, path: '/mypage', isActive: pathname === '/mypage' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex-1 py-3 flex justify-center items-center text-xl ${
                item.isActive
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
