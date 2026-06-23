import { cn } from '@/lib/cn';

interface BadgeProps {
  variant?: 'default' | 'blue' | 'green' | 'yellow' | 'red';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: 'bg-[#f8fafc] text-[#475569] border-[#e5e7eb]',
  blue: 'bg-[#eef2ff] text-[#1e40af] border-[#e5e7eb]',
  green: 'bg-[#ecfdf5] text-[#059669] border-[#e5e7eb]',
  yellow: 'bg-[#fffbeb] text-[#d97706] border-[#e5e7eb]',
  red: 'bg-[#fef2f2] text-[#dc2626] border-[#e5e7eb]',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
