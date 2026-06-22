'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonService } from '@/services/lessonService';

export function useLessons(courseId: string) {
  return useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => lessonService.getByCourseId(courseId),
    enabled: !!courseId,
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonService.getById(id),
    enabled: !!id,
  });
}

export function useLessonProgress(userId: string, courseId: string) {
  return useQuery({
    queryKey: ['lessonProgress', userId, courseId],
    queryFn: () => lessonService.getProgress(userId, courseId),
    enabled: !!userId && !!courseId,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (progress: Parameters<typeof lessonService.updateProgress>[0]) =>
      lessonService.updateProgress(progress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['lessonProgress', variables.userId, variables.courseId],
      });
    },
  });
}
