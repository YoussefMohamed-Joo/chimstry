'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, SearchX, AlertCircle, RefreshCw } from 'lucide-react';
import CourseCard from '@/components/features/CourseCard';
import CourseFilters from '@/components/features/CourseFilters';
import { CourseCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <Badge variant="cyan" className="mb-4">الدورات التعليمية</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            جميع <span className="gradient-text">الدورات</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">اختر الدورة المناسبة لمستواك وابدأ رحلة التعلم</p>
        </div>
        <CourseFilters />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (isError || localError) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <Badge variant="cyan" className="mb-4">الدورات التعليمية</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            جميع <span className="gradient-text">الدورات</span>
          </h1>
        </div>
        <ErrorState onRetry={() => { refetch(); setLocalError(false); }} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <Badge variant="cyan" className="mb-4">الدورات التعليمية</Badge>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          جميع <span className="gradient-text">الدورات</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">اختر الدورة المناسبة لمستواك وابدأ رحلة التعلم</p>
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
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
          >
            {paginated.map((course) => (
              <motion.div
                key={course.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>

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
                  variant={page === currentPage ? 'primary' : 'ghost'}
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
  );
}
