import { create } from 'zustand';
import type { User, Admin } from '@/types';

interface AuthState {
  user: (User | Admin) | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  setUser: (user: User | Admin | null, role?: 'user' | 'admin') => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  setUser: (user, role) =>
    set({
      user,
      isAuthenticated: !!user,
      isAdmin: role === 'admin' || user?.role === 'admin' || user?.role === 'superadmin',
      isLoading: false,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('role');
    set({ user: null, isAuthenticated: false, isAdmin: false });
  },
}));
