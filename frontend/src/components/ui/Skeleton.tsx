'use client';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export default function Skeleton({
  className = '',
  width,
  height,
  circle = false,
}: SkeletonProps) {
  const sizeStyles = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    height: height ? (typeof height === 'number' ? `${height}px` : height) : '1rem',
  };

  return (
    <div
      className={`
        bg-gray-200 
        animate-pulse
        ${circle ? 'rounded-full' : 'rounded-lg'}
        ${className}
      `}
      style={sizeStyles}
    />
  );
}
