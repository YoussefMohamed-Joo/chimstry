'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Clock, Award, ChevronLeft, Play,
  GraduationCap, TrendingUp, Activity, Calendar, ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CourseCardSkeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';
import Sidebar from '@/components/layout/Sidebar';
import CourseCard from '@/components/features/CourseCard';
import { useAuthStore } from '@/store/authStore';
import { useCourses } from '@/hooks/useCourses';

const recentActivity = [
  { id: 'a1', type: 'lesson', text: 'أكملت درس "التركيب الذري"', course: 'مقدمة في الكيمياء', time: 'منذ ٢ ساعة', icon: Play, color: 'text-green-400 bg-green-500/10' },
  { id: 'a2', type: 'quiz', text: 'حصلت على ٩٢٪ في اختبار الكيمياء العضوية', course: 'أساسيات الكيمياء العضوية', time: 'منذ ٥ ساعات', icon: Activity, color: 'text-cyan-400 bg-cyan-500/10' },
  { id: 'a3', type: 'course', text: 'بدأت دورة جديدة', course: 'الكيمياء الفيزيائية', time: 'منذ يوم', icon: BookOpen, color: 'text-purple-400 bg-purple-500/10' },
  { id: 'a4', type: 'certificate', text: 'حصلت على شهادة إتمام', course: 'السلامة في المختبرات الكيميائية', time: 'منذ ٣ أيام', icon: Award, color: 'text-yellow-400 bg-yellow-500/10' },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const { data: allCourses, isLoading: coursesLoading } = useCourses();

  useEffect(() => {
    if (isAdmin) {
      window.location.href = '/admin/dashboard';
    }
  }, [isAdmin]);

  const userData = user && 'enrolledCourses' in user ? user : null;

  const enrolledCourses = useMemo(() => {
    if (!allCourses || !userData) return [];
    return allCourses.filter((c) => userData.enrolledCourses.includes(c.id));
  }, [allCourses, userData]);

  const continueWatching = useMemo(() => {
    if (!enrolledCourses.length || !userData) return [];
    return enrolledCourses
      .map((c) => ({ ...c, progress: userData.progress[c.id] || 0 }))
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 4);
  }, [enrolledCourses, userData]);

  const statsCards = [
    { icon: BookOpen, value: enrolledCourses.length.toString(), label: 'دورات مسجل فيها' },
    { icon: GraduationCap, value: '١٢', label: 'درس مكتمل' },
    { icon: Clock, value: '١٨', label: 'ساعة تعلم' },
    { icon: Award, value: '٢', label: 'شهادات' },
  ];

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-24">
        <EmptyState
          icon={LayoutDashboard}
          title="يرجى تسجيل الدخول"
          description="سجل دخولك للوصول إلى لوحة التحكم"
          actionLabel="تسجيل الدخول"
          onAction={() => window.location.href = '/auth/login'}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 p-4 md:p-8 lg:p-10">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden mb-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          القائمة
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              مرحباً، {user.name} 👋
            </h1>
            <p className="text-gray-400">تابع تقدمك الدراسي واستمر في رحلة التعلم</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="p-4 md:p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {continueWatching.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Play className="w-5 h-5 text-cyan-400" />
                  أكمل التعلم
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {continueWatching.map((course) => (
                  <Link key={course.id} href={`/courses/${course.id}`} className="group block p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-cyan-500/20 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {course.titleAr.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover:text-cyan-300 transition-colors">{course.titleAr}</p>
                        <p className="text-xs text-gray-500">{course.duration}</p>
                      </div>
                    </div>
                    <Progress value={course.progress} className="h-1.5" />
                    <p className="text-xs text-gray-400 mt-1.5">{Math.round(course.progress)}% مكتمل</p>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    دوراتي
                  </h2>
                  <Link href="/courses" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                    تصفح الكل
                  </Link>
                </div>

                {coursesLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2].map((i) => <CourseCardSkeleton key={i} />)}
                  </div>
                ) : enrolledCourses.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="لا توجد دورات مسجل فيها"
                    description="ابدأ بتصفح الدورات المتاحة وسجل في ما يناسبك"
                    actionLabel="تصفح الدورات"
                    onAction={() => window.location.href = '/courses'}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {enrolledCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        isEnrolled
                        progress={userData?.progress[course.id] || 0}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5"
              >
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  النشاطات الأخيرة
                </h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activity.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-white leading-snug">{activity.text}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{activity.course}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
