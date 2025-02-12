'use client';

interface InputFieldProps {
  type: 'email' | 'password' | 'text' | 'date' | 'number';
  placeholder?: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  rows?: number;
}

export default function InputField({
  type,
  placeholder,
  value,
  onChange,
  label,
  required,
}: InputFieldProps) {
  return (
    <div>
      {label ? <div className="text-sm font-semibold mb-1">{label}</div> : null}
      <input
        type={type}
        placeholder={placeholder}
        className="border p-3 rounded-md w-full text-black"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
