import type { Course } from '@/types';
import coursesData from '@/data/courses.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let data = coursesData as unknown as Course[];

export const courseService = {
  async getAll(): Promise<Course[]> {
    await delay(300);
    return data;
  },

  async getById(id: string): Promise<Course | null> {
    await delay(200);
    return data.find((c) => c.id === id) || null;
  },

  async getByCategory(category: string): Promise<Course[]> {
    await delay(200);
    return data.filter((c) => c.category === category);
  },

  async search(query: string): Promise<Course[]> {
    await delay(150);
    const q = query.toLowerCase();
    return data.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.titleAr.includes(q) ||
        c.tags.some((t) => t.includes(q))
    );
  },

  async getFeatured(): Promise<Course[]> {
    await delay(200);
    return data.filter((c) => c.rating >= 4.8).slice(0, 4);
  },

  async create(course: Omit<Course, 'id'>): Promise<Course> {
    await delay(400);
    const newCourse: Course = {
      ...course,
      id: `chem-${Date.now()}`,
    };
    data.unshift(newCourse);
    return newCourse;
  },

  async update(id: string, updates: Partial<Course>): Promise<Course | null> {
    await delay(300);
    const idx = data.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    data[idx] = { ...data[idx], ...updates };
    return data[idx];
  },

  async delete(id: string): Promise<boolean> {
    await delay(300);
    const idx = data.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    data.splice(idx, 1);
    return true;
  },
};
