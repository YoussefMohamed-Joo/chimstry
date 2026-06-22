'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const variants = {
  default: 'bg-cyan-500 text-white hover:bg-cyan-400 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40',
  primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20',
  secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30',
  ghost: 'text-gray-300 hover:text-white hover:bg-white/5',
  outline: 'border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
} as const;

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-8 text-base',
  xl: 'h-14 px-10 text-lg',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.97]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
