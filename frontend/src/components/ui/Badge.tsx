'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variants = {
    primary: 'bg-red-100 text-red-700 border-red-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-orange-100 text-orange-700 border-orange-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        font-medium rounded-full border
        transition-colors duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
