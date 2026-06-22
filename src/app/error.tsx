'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('chimstry error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md p-8 md:p-10 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">عذراً، حدث خطأ غير متوقع</h2>
        <p className="text-gray-400 mb-2">نواجه مشكلة تقنية حالياً. يرجى المحاولة مرة أخرى.</p>
        <p className="text-xs text-gray-600 mb-6 font-mono" dir="ltr">{error.message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" size="lg" onClick={reset}>
            <RefreshCw className="w-4 h-4 ml-2" />
            إعادة المحاولة
          </Button>
          <Button variant="secondary" size="lg" onClick={() => window.location.href = '/'}>
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}
