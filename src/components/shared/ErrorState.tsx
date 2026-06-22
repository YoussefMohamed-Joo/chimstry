'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  message = 'عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn('flex flex-col items-center justify-center text-center py-16 px-4', className)}
    >
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">حدث خطأ</h3>
        <p className="text-gray-400 mb-6">{message}</p>
        {onRetry && (
          <Button variant="secondary" size="md" onClick={onRetry}>
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
        )}
      </div>
    </motion.div>
  );
}
