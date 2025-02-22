'use client';

interface SubmitButtonProps {
  label: string;
}

export default function SubmitButton({ label }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="bg-blue-500 text-white p-3 rounded-full w-60 hover:bg-blue-600"
    >
      {label}
    </button>
  );
}
