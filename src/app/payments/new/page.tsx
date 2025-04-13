'use client';

import { useEffect, useState } from 'react';
import InputField from '@/components/common/form/inputField';
import SubmitButton from '@/components/common/form/submitButton';
import Textarea from '@/components/common/form/textarea';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import BillingsForm from '@/app/payments/new/billingsForm';
import { createPayment } from '@/app/api/endpoints/payments';
import { Billing } from '@/types/payment';
import { getUsersList } from '@/app/api/endpoints/user';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/common/loading';
import { usePaymentsStore } from '@/stores/payments';
import { useUserStore } from '@/stores/users';

export default function Page() {
  const router = useRouter();
  const { isAuthChecking, isLogin } = useAuth();
  const fetchPayments = usePaymentsStore((state) => state.fetchPayments);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [billings, setBillings] = useState<Billing[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const currentUser = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthChecking && isLogin) {
        try {
          const users = await getUsersList();
          setUsers(users || []);
        } catch (error) {
          console.error('Error fetching users:', error);
          toast('ユーザー情報の取得に失敗しました', { type: 'error' });
        }
      }
    };

    fetchUsers();
  }, [isAuthChecking, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || billings.length === 0 || !currentUser) {
      toast('タイトルと支払い情報を入力してください', { type: 'error' });
      return;
    }

    const totalAmount = billings.reduce((sum, billing) => sum + billing.splitAmount, 0);

    setIsSubmitting(true);
    try {
      await createPayment(
        title,
        new Date().toISOString(),
        totalAmount,
        billings,
        description || undefined
      );
      await fetchPayments();
      toast('支払い情報を作成しました', { type: 'success' });
      router.push('/payments');
    } catch (error) {
      console.error('Error creating payment:', error);
      toast('支払い情報の作成に失敗しました', { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthChecking || !isLogin) return <Loading />;

  return (
    <div className="mt-6 flex flex-col justify-center px-4 max-w-md mx-auto w-full font-geist mb-20">
      <h1 className="mt-8 mb-4 text-center text-2xl font-bold">新規支払い作成</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          type="text"
          label="タイトル"
          placeholder="飲み会"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required={true}
        />

        <Textarea
          label="説明"
          placeholder="〇〇での飲み会の支払い"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <BillingsForm billings={billings} optionUsers={users} onChange={setBillings} />

        <div className="flex justify-center mt-4">
          <SubmitButton label="作成" disabled={isSubmitting} />
        </div>
      </form>
    </div>
  );
}
