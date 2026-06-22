import { QueryProvider } from '@/providers/QueryProvider';
import type { ReactNode } from 'react';

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
