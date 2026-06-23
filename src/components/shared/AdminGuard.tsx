'use client';

import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

export default function AdminGuard({ children }: { children: ReactNode }) {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div dir="rtl" className="font-cairo min-h-screen flex items-center justify-center bg-[#0B1E3D]">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div dir="rtl" className="font-cairo min-h-screen flex items-center justify-center bg-[#0B1E3D]">
        <div className="text-center">
          <p className="text-gray-400 mb-4">ليس لديك صلاحية الوصول</p>
          <Button onClick={() => (window.location.href = '/admin/login')}>
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
