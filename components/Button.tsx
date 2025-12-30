'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-8 py-4 rounded-glass-sm font-semibold text-base relative overflow-hidden';
  
  if (variant === 'primary') {
    return (
      <button 
        className={`glass-button ${baseStyles} ${className}`} 
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }

  // Secondary variant - simpler glass style
  return (
    <button 
      className={`
        ${baseStyles}
        glass-button
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
