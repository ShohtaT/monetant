'use client';

import { useState } from 'react';
import InputField from '@/components/common/form/InputField';
import SubmitButton from '@/components/common/form/SubmitButton';
import Textarea from '@/components/common/form/textarea';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalAmount, setTotalAmount] = useState(0);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      // TODO: await createPayment
    } catch (error) {
      setMessage(`保存に失敗しました\nError: ${error}`);
    }
  };

  return (
    <div className="mt-6 flex flex-col justify-center font-geist">
      <p className="mb-4 font-bold">
        <span className="underline cursor-pointer" onClick={() => router.push('/payments')}>
          一覧
        </span>{' '}
        ＞ 新規作成
      </p>

      <h1 className="text-center text-2xl font-bold mb-4">新規作成</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
        <InputField
          type="text"
          placeholder="支払い名称"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="支払い名称"
          required={true}
        />
        <InputField
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          label="支払い日"
          required={true}
        />
        <InputField
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(Number(e.target.value))}
          label="立替総額"
          required={true}
        />
        <Textarea
          placeholder="メモ"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          label="メモ"
          rows={3}
          required={false}
        />
        <SubmitButton label="登録する" />
      </form>

      {message && <p className="mt-4 text-sm text-center text-red-500">{message}</p>}
    </div>
  );
}
