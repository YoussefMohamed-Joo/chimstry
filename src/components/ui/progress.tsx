'use client';

import { cn } from '@/lib/cn';

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, className, indicatorClassName }: ProgressProps) {
  return (
    <div
      className={cn(
        'h-2 w-full rounded-full bg-white/5 overflow-hidden',
        className
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-cyan-500 to-blue-500',
          indicatorClassName
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
