'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AuthInitializer() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      const stored = localStorage.getItem('admin');
      if (stored) {
        setUser(JSON.parse(stored), 'admin');
      } else {
        setUser(null);
      }
    } else if (role === 'user') {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored), 'user');
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [setUser, setLoading]);

  return null;
}
