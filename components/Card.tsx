'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface CardProps {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, href, className = '', onClick }: CardProps) {
  const content = (
    <div 
      className={`glass-card p-8 md:p-10 cursor-pointer focus-within:ring-2 focus-within:ring-[var(--accent)] focus-within:ring-offset-2 ${className}`}
      onClick={onClick}
      tabIndex={href ? -1 : 0}
    >
      <div className="specular-highlight" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 rounded-[28px]"
      >
        {content}
      </Link>
    );
  }

  return content;
}
