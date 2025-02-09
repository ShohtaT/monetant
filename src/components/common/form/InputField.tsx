'use client';

interface InputFieldProps {
  type: 'email' | 'password' | 'text';
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({ type, placeholder, value, onChange }: InputFieldProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="border p-3 rounded-md w-full text-black"
      value={value}
      onChange={onChange}
      required
    />
  );
}
