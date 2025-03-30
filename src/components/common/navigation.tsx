'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navigation = () => {
  const pathname = usePathname();

  // ログインとサインアップページでは非表示
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'MyPage', path: '/mypage' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-around items-center h-14">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex-1 py-3 px-3 text-center text-gray-700 hover:text-gray-900 ${
                pathname === item.path ? 'text-blue-500 border-t-2 border-blue-500' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
