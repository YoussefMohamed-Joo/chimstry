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
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">عذراً، حدث خطأ غير متوقع</h2>
        <p className="text-gray-400 mb-6">نواجه مشكلة تقنية حالياً. يرجى المحاولة مرة أخرى.</p>
        <Button variant="primary" size="lg" onClick={reset}>
          <RefreshCw className="w-4 h-4 ml-2" />
          إعادة المحاولة
        </Button>
      </div>
    </div>
  );
}
