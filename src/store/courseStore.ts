import { create } from 'zustand';

interface CourseState {
  selectedCategory: string | null;
  searchQuery: string;
  currentPage: number;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  selectedCategory: null,
  searchQuery: '',
  currentPage: 1,
  setSelectedCategory: (category) => set({ selectedCategory: category, currentPage: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
