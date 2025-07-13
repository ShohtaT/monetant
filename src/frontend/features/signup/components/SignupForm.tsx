'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '@/frontend/shared/ui/InputField';
import SubmitButton from '@/frontend/shared/ui/Button';
import Loading from '@/frontend/shared/ui/Loading';
import { signup } from '../api';
import { signupSchema, SignupFormData } from '../validation';
import { toast } from 'react-toastify';

export const SignupForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setGeneralError(null);

    try {
      const response = await signup(data);
      toast.success('Account created successfully!');
      reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';

      if (errorMessage.includes('Email already exists')) {
        setError('email', { message: 'This email is already registered' });
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

      <InputField
        label="Nickname"
        type="text"
        placeholder="Enter your nickname"
        error={errors.nickname?.message}
        required
        {...register('nickname')}
      />

      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{generalError}</p>
        </div>
      )}

      <div className="flex justify-center">
        <SubmitButton label="Create Account" disabled={isLoading} />
      </div>
    </form>
  );
};
