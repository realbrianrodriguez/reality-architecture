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
      className={`glass-card p-8 md:p-10 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="specular-highlight" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }

  return content;
}
