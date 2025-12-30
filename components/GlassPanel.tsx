'use client';

import { ReactNode, useEffect, useState } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'default' | 'tight' | 'stage';
  onClick?: () => void;
}

export default function GlassPanel({ 
  children, 
  className = '', 
  delay = 0,
  variant = 'default',
  onClick
}: GlassPanelProps) {
  const [isVisible, setIsVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  // Variant-specific padding
  const variantStyles = {
    default: 'p-8 md:p-10',
    tight: 'p-6 md:p-8',
    stage: 'p-10 md:p-12 lg:p-14',
  };

  const padding = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`
        glass-panel
        ${padding}
        ${className}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="specular-highlight" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
