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
      {label ? <label className="text-sm font-semibold">{label}</label> : null}
      <textarea
        placeholder={placeholder}
        className="mt-1 border p-3 rounded-md w-full text-black"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
