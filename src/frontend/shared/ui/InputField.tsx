'use client';

import { ChangeEvent, forwardRef } from 'react';

interface InputFieldProps {
  type: 'email' | 'password' | 'text' | 'date' | 'number';
  placeholder?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
  required?: boolean;
  rows?: number;
  error?: string;
  name?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  type,
  placeholder,
  value,
  onChange,
  className,
  label,
  required,
  error,
  name,
  ...props
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <div className="text-sm font-semibold mb-1">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </div>
      )}
      <input
        ref={ref}
        type={type}
        name={name}
        placeholder={placeholder}
        className={`border p-3 rounded-md w-full text-black ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
