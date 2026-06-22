'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('chimstry global error:', error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#060D1A] text-white font-sans flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md p-8 md:p-10 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">عذراً، حدث خطأ غير متوقع</h2>
          <p className="text-gray-400 mb-2">نواجه مشكلة تقنية حالياً</p>
          <p className="text-xs text-gray-600 mb-6 font-mono" dir="ltr">{error.message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
            >
              إعادة المحاولة
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all border border-white/20"
            >
              العودة للرئيسية
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-8">
            صمم وطور بواسطة <span className="text-cyan-400">المهندس يوسف محمد حسين</span>
          </p>
        </div>
      </body>
    </html>
  );
}
