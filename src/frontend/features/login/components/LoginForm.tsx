'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '@/frontend/shared/ui/InputField';
import SubmitButton from '@/frontend/shared/ui/Button';
import Loading from '@/frontend/shared/ui/Loading';
import { login } from '../api';
import { loginSchema, LoginFormData } from '../validation';
import { toast } from 'react-toastify';

export const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setGeneralError(null);

    try {
      const response = await login(data);
      toast.success('Login successful!');
      reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';

      if (errorMessage.includes('Invalid email or password')) {
        setError('email', { message: 'Invalid email or password' });
      } else if (errorMessage.includes('Invalid login credentials')) {
        setError('email', { message: 'Invalid email or password' });
      } else {
        setGeneralError(errorMessage);
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label="Email"
        type="email"
        placeholder="Enter your email"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      <InputField
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        required
        {...register('password')}
      />

      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{generalError}</p>
        </div>
      )}

      <div className="flex justify-center">
        <SubmitButton label="Sign In" disabled={isLoading} />
      </div>
    </form>
  );
};
