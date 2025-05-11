'use client';

import { ChangeEvent } from 'react';

interface InputNumberFieldProps {
  placeholder?: string;
  value: string | number;
  onChange?: (value: string | number, e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
  required?: boolean;
  rows?: number;
}

export default function InputNumberField({
  placeholder,
  value,
  onChange,
  className,
  label,
  required,
}: InputNumberFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    let newValue: string | number = e.target.value;

    newValue = newValue.replaceAll(/\D/g, ''); // Remove non-numeric characters
    newValue = newValue === '' ? '' : Number(newValue.replace(/^0+(\d)/, '$1')); // Handle empty input

    onChange(newValue, e);
  };

  return (
    <div>
      {label && (
        <div className="text-sm font-semibold mb-1">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </div>
      )}
      <input
        type="text"
        placeholder={placeholder}
        className={`border p-3 rounded-md w-full text-black ${className}`}
        value={value}
        onChange={handleChange}
        required={required}
      />
    </div>
  );
}
