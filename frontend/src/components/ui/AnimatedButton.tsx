'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface AnimatedButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export default function AnimatedButton({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: AnimatedButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 ease-out rounded-full relative overflow-hidden group';
  
  const variants = {
    primary: 'bg-[#DB0011] text-white hover:bg-[#B2000E] shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:-translate-y-1',
    secondary: 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 shadow-lg hover:shadow-xl hover:-translate-y-1',
    outline: 'bg-transparent border-2 border-[#EDEEF2] text-black hover:border-[#DB0011] hover:text-[#DB0011] hover:-translate-y-1',
  };
  
  const sizes = {
    sm: 'h-10 px-6 text-sm',
    md: 'h-12 px-8 text-base',
    lg: 'h-14 px-10 text-lg',
  };
  
  const combinedClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : ''
  }`;

  // Ripple effect
  const ButtonContent = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClass}>
        {ButtonContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClass} disabled={disabled}>
      {ButtonContent}
    </button>
  );
}
