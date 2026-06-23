'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Star,
  Users,
  Book,
  AlertCircle,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';

export default function AdminCoursesPage() {
  const queryClient = useQueryClient();

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const handleDelete = (id: string, titleAr: string) => {
    if (window.confirm(`هل أنت متأكد من حذف "${titleAr}"؟`)) {
      deleteMutation.mutate(id);
    }
  };

  const levelVariant = (level: string) => {
    const map: Record<string, 'green' | 'yellow' | 'red'> = {
      beginner: 'green',
      intermediate: 'yellow',
      advanced: 'red',
    };
    return map[level] || 'default';
  };

  return (
    <div dir="rtl" className="font-cairo min-h-screen bg-[#0B1E3D] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-white">إدارة الدورات</h1>
          <Button
            variant="primary"
            onClick={() => (window.location.href = '/admin/courses/new')}
          >
            <Plus className="w-4 h-4" />
            إضافة دورة جديدة
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-9 w-20 rounded-xl" />
                  <Skeleton className="h-9 w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 text-lg">حدث خطأ أثناء تحميل الدورات</p>
          </div>
        ) : !courses || courses.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">لا توجد دورات بعد</p>
            <Button
              variant="primary"
              onClick={() => (window.location.href = '/admin/courses/new')}
            >
              <Plus className="w-4 h-4" />
              إضافة أول دورة
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-white mb-2">{course.titleAr}</h3>
                <p className="text-gray-400 text-xs mb-3">{course.categoryAr}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant={levelVariant(course.level)}>
                    {course.levelAr}
                  </Badge>
                  <Badge variant="blue">{course.duration}</Badge>
                </div>

                <div className="flex items-center gap-4 text-gray-400 text-xs mb-4">
                  <span className="flex items-center gap-1">
                    <Book className="w-3.5 h-3.5" />
                    {course.lessonsCount} درس
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {course.studentsCount} طالب
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" />
                    {course.rating}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-cyan-400 font-bold">{formatPrice(course.price)}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => (window.location.href = `/admin/courses/${course.id}/edit`)}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      تعديل
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(course.id, course.titleAr)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
