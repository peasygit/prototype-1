'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl p-6
        border border-gray-100
        transition-all duration-300 ease-out
        ${hover ? 'hover:border-red-200 hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-1' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
