import type { Course } from '@/types';
import coursesData from '@/data/courses.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const data = coursesData as unknown as Course[];

export const courseService = {
  async getAll(): Promise<Course[]> {
    await delay(400);
    return data;
  },

  async getById(id: string): Promise<Course | null> {
    await delay(300);
    return data.find((c) => c.id === id) || null;
  },

  async getByCategory(category: string): Promise<Course[]> {
    await delay(300);
    return data.filter((c) => c.category === category);
  },

  async search(query: string): Promise<Course[]> {
    await delay(200);
    const q = query.toLowerCase();
    return data.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.titleAr.includes(q) ||
        c.tags.some((t) => t.includes(q))
    );
  },

  async getFeatured(): Promise<Course[]> {
    await delay(300);
    return data.filter((c) => c.rating >= 4.8).slice(0, 4);
  },
};
