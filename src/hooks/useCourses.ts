'use client';

import { useQuery } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getById(id),
    enabled: !!id,
  });
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: ['courses', 'featured'],
    queryFn: () => courseService.getFeatured(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCourseSearch(query: string) {
  return useQuery({
    queryKey: ['courses', 'search', query],
    queryFn: () => courseService.search(query),
    enabled: query.length > 0,
  });
}
