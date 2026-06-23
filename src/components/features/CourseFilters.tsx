'use client';

import { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';
import { useCourseStore } from '@/store/courseStore';
import { useCourses } from '@/hooks/useCourses';

const levels = [
  { value: null, label: 'الكل' },
  { value: 'beginner', label: 'مبتدئ' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'advanced', label: 'متقدم' },
];

export default function CourseFilters() {
  const {
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
  } = useCourseStore();

  const { data: courses } = useCourses();

  const categories = useMemo(() => {
    if (!courses) return [];
    const map = new Map<string, number>();
    courses.forEach((c) => {
      map.set(c.category, (map.get(c.category) || 0) + 1);
    });
    return Array.from(map.entries()).map(([cat, count]) => ({
      id: cat,
      nameAr: courses.find((c) => c.category === cat)?.categoryAr || cat,
      count,
    }));
  }, [courses]);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
          <Input
            placeholder="ابحث عن دورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-11 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {levels.map((level) => (
          <button
            key={level.value || 'all'}
            onClick={() => {}}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 border',
              level.value === null
                ? 'bg-[#eef2ff] text-[#1e40af] border-[#e5e7eb]'
                : 'bg-white text-[#475569] border-[#e5e7eb] hover:bg-[#f8fafc]'
            )}
          >
            {level.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 border',
            !selectedCategory
              ? 'bg-[#eef2ff] text-[#1e40af] border-[#e5e7eb]'
              : 'bg-white text-[#475569] border-[#e5e7eb] hover:bg-[#f8fafc]'
          )}
        >
          الكل
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 border',
              selectedCategory === cat.id
                ? 'bg-[#eef2ff] text-[#1e40af] border-[#e5e7eb]'
                : 'bg-white text-[#475569] border-[#e5e7eb] hover:bg-[#f8fafc]'
            )}
          >
            {cat.nameAr}
            <span className="mr-1.5 text-xs opacity-60">({cat.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
