import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`glass-input w-full px-5 py-4 text-base ${className}`}
      {...props}
    />
  );
}
