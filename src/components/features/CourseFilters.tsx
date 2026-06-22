'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, X } from 'lucide-react';
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

const sortOptions = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'rating', label: 'الأعلى تقييماً' },
  { value: 'price-asc', label: 'الأقل سعراً' },
  { value: 'price-desc', label: 'الأعلى سعراً' },
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
    <div className="space-y-5" dir="rtl">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
          <Input
            placeholder="ابحث عن دورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-11 bg-white/5 border-white/10 rounded-xl text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <select
              className="appearance-none h-11 px-4 pr-10 rounded-xl bg-white/5 border border-white/10 text-sm text-white cursor-pointer hover:border-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              defaultValue="newest"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0B1E3D]">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {levels.map((level) => (
          <motion.button
            key={level.value || 'all'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {}}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border',
              level.value === null
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-sm shadow-cyan-500/10'
                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
            )}
          >
            {level.label}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border',
            !selectedCategory
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-sm shadow-cyan-500/10'
              : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
          )}
        >
          الكل
        </motion.button>
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border',
              selectedCategory === cat.id
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-sm shadow-cyan-500/10'
                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
            )}
          >
            {cat.nameAr}
            <span className="mr-1.5 text-xs opacity-60">({cat.count})</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
