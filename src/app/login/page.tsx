'use client';

import { useState } from 'react';
import InputField from '@/components/common/form/InputField';
import SubmitButton from '@/components/common/form/SubmitButton';
import { login } from '@/app/api/users';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await login(email, password);
      setMessage('ログイン成功！');
    } catch (error) {
      setMessage(`エラー: ${error}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-geist">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        <InputField
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton label="ログイン" />
      </form>

      {message && <p className="mt-4 text-sm text-center text-red-500">{message}</p>}
    </div>
  );
}
