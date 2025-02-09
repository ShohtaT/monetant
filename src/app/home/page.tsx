'use client';

import { createPayment } from '@/app/api/payments';

export default function Page() {
  const create = async () => {
    await createPayment('cool', 100, 'my uuid');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-geist">
      <h1 className="text-2xl font-bold mb-4" onClick={create}>
        HOME
      </h1>
    </div>
  );
}
