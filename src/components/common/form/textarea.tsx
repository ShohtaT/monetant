'use client';

import { ChangeEventHandler } from 'react';

interface InputFieldProps {
  placeholder?: string;
  value: string | number;
  label?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement> | undefined;
  required?: boolean;
  rows?: number;
}

export default function Textarea({
  placeholder,
  value,
  label,
  onChange,
  required,
}: InputFieldProps) {
  return (
    <div>
      {label ? (
        <div className="text-sm font-semibold mb-1">
          {label}
          {required ? <span className="ml-1 text-red-500">*</span> : null}
        </div>
      ) : null}
      <textarea
        placeholder={placeholder}
        className="border p-3 rounded-md w-full text-black"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
