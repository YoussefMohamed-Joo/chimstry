'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/paymentService';

export function usePaymentRequests() {
  return useQuery({
    queryKey: ['paymentRequests'],
    queryFn: () => paymentService.getAll(),
  });
}

export function usePendingPayments() {
  return useQuery({
    queryKey: ['paymentRequests', 'pending'],
    queryFn: () => paymentService.getPending(),
    refetchInterval: 10000,
  });
}

export function useSubmitPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof paymentService.submit>[0]) =>
      paymentService.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentRequests'] });
    },
  });
}

export function useApprovePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => paymentService.approve(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentRequests'] });
    },
  });
}

export function useRejectPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => paymentService.reject(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentRequests'] });
    },
  });
}
