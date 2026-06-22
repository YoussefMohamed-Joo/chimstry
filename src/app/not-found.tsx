'use client';

import Link from 'next/link';
import { SearchX, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
          <SearchX className="w-8 h-8 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">الصفحة غير موجودة</h2>
        <p className="text-gray-400 mb-6">عذراً، الصفحة التي تبحث عنها غير متوفرة.</p>
        <Link href="/">
          <Button variant="primary" size="lg">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة إلى الرئيسية
          </Button>
        </Link>
      </div>
    </div>
  );
}
