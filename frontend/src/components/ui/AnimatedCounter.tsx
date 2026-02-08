'use client';

import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function AnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (end - startValue) * easeOut);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
