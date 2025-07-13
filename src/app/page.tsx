'use client';

import { useAuth } from '@/frontend/context/AuthContext';

export default function Page() {
  const { user, signOut } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome to monetant</h1>
        <p className="text-gray-600">Split bill application</p>
      </div>

      {user && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">User Information</h2>
          <p className="text-sm text-gray-600">Email: {user.email}</p>
          <button
            onClick={signOut}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
