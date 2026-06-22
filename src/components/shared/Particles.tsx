'use client';

import { useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ParticlesComponent = dynamic(
  () => import('./ParticlesInner'),
  { ssr: false, loading: () => null }
);

export default function ParticlesBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <ParticlesComponent />;
}
