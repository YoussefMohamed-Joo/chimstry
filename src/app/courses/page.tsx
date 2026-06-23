'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import CourseCard from '@/components/features/CourseCard';
import CourseFilters from '@/components/features/CourseFilters';
import { CourseCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';
import { useCourses } from '@/hooks/useCourses';
import { useCourseStore } from '@/store/courseStore';

const ITEMS_PER_PAGE = 8;

export default function CoursesPage() {
  const { data: courses, isLoading, isError, refetch } = useCourses();
  const { selectedCategory, searchQuery, currentPage, setCurrentPage } = useCourseStore();
  const [localError, setLocalError] = useState(false);

  const filtered = useMemo(() => {
    if (!courses) return [];
    let result = [...courses];
    if (selectedCategory) {
      result = result.filter((c) => c.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) => c.titleAr.includes(q) || c.title.toLowerCase().includes(q) || c.tags.some((t) => t.includes(q))
      );
    }
    return result;
  }, [courses, selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-[#1e293b] mb-4">جميع الدورات</h1>
            <p className="text-[#475569] max-w-xl mx-auto">اختر الدورة المناسبة لمستواك وابدأ رحلة التعلم</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (isError || localError) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-[#1e293b] mb-4">جميع الدورات</h1>
          </div>
          <ErrorState onRetry={() => { refetch(); setLocalError(false); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-[#1e293b] mb-4">جميع الدورات</h1>
          <p className="text-[#475569] max-w-xl mx-auto">اختر الدورة المناسبة لمستواك وابدأ رحلة التعلم</p>
        </motion.div>

        <CourseFilters />

        {paginated.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="لا توجد نتائج"
            description="لم نتمكن من العثور على دورات تطابق معايير البحث"
            actionLabel="مسح التصفية"
            onAction={() => {
              useCourseStore.getState().setSelectedCategory(null);
              useCourseStore.getState().setSearchQuery('');
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {paginated.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12" dir="rtl">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  السابق
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  التالي
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
