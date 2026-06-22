import api from './api';
import type { Course } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let coursesData: Course[] = [];

export const loadCoursesData = async (): Promise<Course[]> => {
  if (coursesData.length > 0) return coursesData;
  const data = await import('@/data/courses.json');
  coursesData = data.default as unknown as Course[];
  return coursesData;
};

export const courseService = {
  async getAll(): Promise<Course[]> {
    await delay(400);
    return loadCoursesData();
  },

  async getById(id: string): Promise<Course | null> {
    await delay(300);
    const courses = await loadCoursesData();
    return courses.find((c) => c.id === id) || null;
  },

  async getByCategory(category: string): Promise<Course[]> {
    await delay(300);
    const courses = await loadCoursesData();
    return courses.filter((c) => c.category === category);
  },

  async search(query: string): Promise<Course[]> {
    await delay(200);
    const courses = await loadCoursesData();
    const q = query.toLowerCase();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.titleAr.includes(q) ||
        c.tags.some((t) => t.includes(q))
    );
  },

  async getFeatured(): Promise<Course[]> {
    await delay(300);
    const courses = await loadCoursesData();
    return courses.filter((c) => c.rating >= 4.8).slice(0, 4);
  },
};
