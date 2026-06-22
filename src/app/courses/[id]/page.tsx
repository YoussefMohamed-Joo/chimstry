'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Star, Users, Clock, ChevronLeft, Play, Award, Shield,
  User, GraduationCap, FileText, Loader2, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import LessonPlayer from '@/components/features/LessonPlayer';
import CourseTabs from '@/components/features/CourseTabs';
import ErrorState from '@/components/shared/ErrorState';
import { Skeleton, LessonSkeleton } from '@/components/ui/skeleton';
import { cn, formatPrice } from '@/lib/utils';
import { useCourse } from '@/hooks/useCourses';
import { useLessons, useLessonProgress } from '@/hooks/useLessons';
import { useAuthStore } from '@/store/authStore';
import { useEnrollCourse } from '@/hooks/useUser';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);
  const { data: course, isLoading, isError, refetch } = useCourse(id ?? '');
  const { data: lessons, isLoading: lessonsLoading } = useLessons(id ?? '');
  const { user, isAuthenticated } = useAuthStore();
  const enroll = useEnrollCourse();
  const { data: progressData } = useLessonProgress(user?.id ?? '', id ?? '');

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const completedLessons = useMemo(() => {
    if (!progressData) return [];
    return progressData.filter((p) => p.completed).map((p) => p.lessonId);
  }, [progressData]);

  const progressPercent = useMemo(() => {
    if (!lessons || lessons.length === 0) return 0;
    return Math.round((completedLessons.length / lessons.length) * 100);
  }, [lessons, completedLessons]);

  const selectedLesson = useMemo(() => {
    if (!lessons) return null;
    const lessonId = selectedLessonId || lessons[0]?.id;
    return lessons.find((l) => l.id === lessonId) || lessons[0] || null;
  }, [lessons, selectedLessonId]);

  const isEnrolled = user?.enrolledCourses?.includes(id ?? '') ?? false;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <LessonSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="container mx-auto px-4 py-24">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const handleEnroll = () => {
    if (!isAuthenticated || !id) return;
    enroll.mutate(id);
  };

  return (
    <div className="container mx-auto px-4 py-24" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          العودة إلى الدورات
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 md:p-8 mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="cyan">{course.categoryAr}</Badge>
              <Badge variant={
                course.level === 'beginner' ? 'green' : course.level === 'intermediate' ? 'yellow' : 'red'
              }>
                {course.levelAr}
              </Badge>
              {course.rating >= 4.8 && <Badge variant="purple">الأفضل</Badge>}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">{course.titleAr}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{course.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{course.studentsCount.toLocaleString('ar-SA')} طالب</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{course.lessonsCount} درس</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {course.teacher.nameAr.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{course.teacher.nameAr}</p>
                <p className="text-gray-400 text-xs">{course.teacher.specialty}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-4 lg:min-w-[200px]">
            <div className="text-right">
              <p className="text-3xl font-bold text-cyan-400">
                {course.price === 0 ? 'مجاناً' : formatPrice(course.price)}
              </p>
              {course.price > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  {formatPrice(course.price * 1.4)}
                </p>
              )}
            </div>
            {isEnrolled ? (
              <Button variant="primary" size="lg" className="w-full gap-2 group">
                <Play className="w-5 h-5" />
                متابعة التعلم
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleEnroll}
                isLoading={enroll.isPending}
                disabled={!isAuthenticated}
              >
                {isAuthenticated ? 'الاشتراك في الدورة' : 'سجل دخولك للاشتراك'}
              </Button>
            )}
          </div>
        </div>

        {isEnrolled && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">التقدم العام</span>
              <span className="text-sm font-bold text-cyan-400">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} />
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {selectedLesson && (
            <LessonPlayer
              lesson={selectedLesson}
              courseId={id ?? ''}
              userId={user?.id ?? ''}
              isEnrolled={isEnrolled}
            />
          )}

          <CourseTabs
            course={course}
            lessons={lessons || []}
            completedLessons={completedLessons}
          />
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              محتوى الدورة
            </h3>
            {lessonsLoading ? (
              <LessonSkeleton />
            ) : (
              <div className="space-y-1">
                {lessons?.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isActive = selectedLesson?.id === lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={cn(
                        'w-full text-right flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
                        isActive
                          ? 'bg-cyan-500/10 border border-cyan-500/20'
                          : 'hover:bg-white/5 border border-transparent'
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all',
                        isCompleted
                          ? 'bg-green-500/10 text-green-400'
                          : isActive
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-white/5 text-gray-500'
                      )}>
                        {lesson.order}
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <p className={cn(
                          'text-sm font-medium truncate transition-colors',
                          isActive ? 'text-cyan-300' : isCompleted ? 'text-green-400' : 'text-gray-300'
                        )}>
                          {lesson.titleAr}
                        </p>
                        <p className="text-xs text-gray-500">{lesson.duration}</p>
                      </div>
                      {lesson.isFree && !isEnrolled && (
                        <Badge variant="green" className="text-xs">مجاني</Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 space-y-3"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              تتضمن الدورة
            </h3>
            {[
              { icon: Play, text: `${course.lessonsCount} درس فيديو` },
              { icon: FileText, text: 'ملفات ومراجع قابلة للتحميل' },
              { icon: Shield, text: 'شهادة إتمام معتمدة' },
              { icon: GraduationCap, text: 'وصول مدى الحياة' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                <item.icon className="w-4 h-4 text-cyan-400" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
