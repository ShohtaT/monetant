'use client';

import { ChangeEvent } from 'react';

interface InputFieldProps {
  type: 'email' | 'password' | 'text' | 'date' | 'number';
  placeholder?: string;
  value: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>, value: string | number) => void;
  className?: string;
  label?: string;
  required?: boolean;
  rows?: number;
}

export default function InputField({
  type,
  placeholder,
  value,
  onChange,
  className,
  label,
  required,
}: InputFieldProps) {
  const setType = () => (type === 'number' ? 'text' : type);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    let newValue = e.target.value;

    if (type === 'number') {
      // 数字以外の文字の場合早は変更を無視
      if (newValue.match(/\D/g)) return;

      // 先頭の `0` を削除（ただし `0` 単体は許可）
      newValue = newValue.replace(/^0+(\d)/, '$1');

      onChange(e, Number(newValue));
    } else {
      onChange(e, newValue);
    }
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
        type={setType()}
        placeholder={placeholder}
        className={`border p-3 rounded-md w-full text-black ${className}`}
        value={value}
        onChange={handleChange}
        required={required}
      />
    </div>
  );
}
