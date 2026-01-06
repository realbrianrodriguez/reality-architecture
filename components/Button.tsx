'use client';

import { ButtonHTMLAttributes, ReactNode, useState } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations
  const sizeClasses = {
    sm: 'px-6 py-2.5 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  // Base styles for all buttons
  const baseClasses = `
    ${sizeClasses[size]}
    rounded-glass-sm
    font-semibold
    relative
    overflow-hidden
    transition-all
    duration-[150ms]
    ease-[cubic-bezier(0.2,0.8,0.2,1)]
    focus:outline-none
    focus-visible:ring-2
    focus-visible:ring-[var(--accent)]
    focus-visible:ring-offset-2
  `;

  // Variant-specific classes
  const variantClasses = {
    primary: `
      text-white
      shadow-[0_2px_8px_rgba(37,99,235,0.2),0_1px_3px_rgba(37,99,235,0.15)]
      hover:shadow-[0_4px_12px_rgba(37,99,235,0.3),0_2px_6px_rgba(37,99,235,0.2)]
      active:translate-y-[1px]
      active:shadow-[0_1px_4px_rgba(37,99,235,0.2),0_1px_2px_rgba(37,99,235,0.15)]
      focus-visible:ring-[var(--accent)]
      disabled:opacity-60
      disabled:cursor-not-allowed
      disabled:hover:shadow-[0_2px_8px_rgba(37,99,235,0.2),0_1px_3px_rgba(37,99,235,0.15)]
      disabled:hover:bg-[var(--accent)]
      disabled:active:translate-y-0
      disabled:active:shadow-[0_2px_8px_rgba(37,99,235,0.2),0_1px_3px_rgba(37,99,235,0.15)]
    `,
    secondary: `
      bg-[var(--color-glass-fill)]
      backdrop-blur-[14px]
      text-[var(--color-ink)]
      border
      border-[var(--color-border-hairline)]
      shadow-[0_1px_0_0_var(--color-glass-edge)_inset,0_4px_12px_rgba(5,5,5,0.04)]
      hover:bg-[rgba(255,255,255,0.80)]
      hover:border-[rgba(5,5,5,0.15)]
      hover:shadow-[0_1px_0_0_var(--color-glass-edge)_inset,0_6px_16px_rgba(5,5,5,0.06)]
      active:translate-y-[1px]
      active:shadow-[0_1px_0_0_var(--color-glass-edge)_inset,0_2px_6px_rgba(5,5,5,0.04)]
      focus-visible:ring-[var(--accent)]
      disabled:opacity-50
      disabled:cursor-not-allowed
      disabled:hover:bg-[var(--color-glass-fill)]
      disabled:hover:border-[var(--color-border-hairline)]
      disabled:hover:shadow-[0_1px_0_0_var(--color-glass-edge)_inset,0_4px_12px_rgba(5,5,5,0.04)]
      disabled:active:translate-y-0
    `,
    ghost: `
      bg-transparent
      text-[rgba(5,5,5,0.64)]
      hover:bg-[rgba(5,5,5,0.04)]
      hover:text-[rgba(5,5,5,0.80)]
      active:bg-[rgba(5,5,5,0.06)]
      focus-visible:ring-[var(--accent)]
      disabled:opacity-40
      disabled:cursor-not-allowed
      disabled:hover:bg-transparent
      disabled:hover:text-[rgba(5,5,5,0.64)]
      disabled:active:bg-transparent
    `,
  };

  // Combine classes and clean up whitespace
  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // Inline style for primary variant background (accent color)
  const getBackgroundColor = () => {
    if (variant !== 'primary') return {};
    
    // Always show accent background, even when disabled
    if (disabled) {
      return {
        backgroundColor: 'var(--accent)',
      };
    }
    
    return {
      backgroundColor: isHovered ? '#1d4ed8' : 'var(--accent)',
    };
  };

  return (
    <button
      className={combinedClasses}
      style={getBackgroundColor()}
      disabled={disabled}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
