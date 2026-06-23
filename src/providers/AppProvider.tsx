import { QueryProvider } from '@/providers/QueryProvider';
import AuthInitializer from '@/components/shared/AuthInitializer';
import type { ReactNode } from 'react';

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthInitializer />
      {children}
    </QueryProvider>
  );
}
