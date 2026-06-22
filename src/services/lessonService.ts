import api from './api';
import type { Lesson, UserProgress } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let lessonsData: Lesson[] = [];

export const loadLessonsData = async (): Promise<Lesson[]> => {
  if (lessonsData.length > 0) return lessonsData;
  const data = await import('@/data/lessons.json');
  lessonsData = data.default as unknown as Lesson[];
  return lessonsData;
};

export const lessonService = {
  async getByCourseId(courseId: string): Promise<Lesson[]> {
    await delay(300);
    const lessons = await loadLessonsData();
    return lessons
      .filter((l) => l.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  },

  async getById(id: string): Promise<Lesson | null> {
    await delay(200);
    const lessons = await loadLessonsData();
    return lessons.find((l) => l.id === id) || null;
  },

  async getProgress(userId: string, courseId: string): Promise<UserProgress[]> {
    await delay(200);
    const stored = localStorage.getItem(`progress_${userId}_${courseId}`);
    return stored ? JSON.parse(stored) : [];
  },

  async updateProgress(progress: UserProgress): Promise<void> {
    await delay(100);
    const key = `progress_${progress.userId}_${progress.courseId}`;
    const stored = localStorage.getItem(key);
    const all: UserProgress[] = stored ? JSON.parse(stored) : [];
    const idx = all.findIndex((p) => p.lessonId === progress.lessonId);
    if (idx >= 0) all[idx] = progress;
    else all.push(progress);
    localStorage.setItem(key, JSON.stringify(all));
  },
};
