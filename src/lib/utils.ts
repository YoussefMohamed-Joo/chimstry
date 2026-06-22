import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString('ar-EG')} ج.م`;
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-400';
  if (percentage >= 50) return 'text-cyan-400';
  if (percentage >= 25) return 'text-yellow-400';
  return 'text-red-400';
}
