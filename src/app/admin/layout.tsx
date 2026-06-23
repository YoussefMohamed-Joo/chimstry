'use client';

import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/shared/AdminGuard';
import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return <AdminGuard>{children}</AdminGuard>;
}
