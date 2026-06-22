'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import type { LoginInput, RegisterInput } from '@/types';

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      setUser(user);
      setLoading(false);
      return user;
    },
    retry: false,
  });
}

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (courseId: string) => {
      if (!user) throw new Error('Not authenticated');
      return authService.enrollCourse(user.id, courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}
