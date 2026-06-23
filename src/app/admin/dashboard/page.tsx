'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  Activity,
  GraduationCap,
  Plus,
  Smartphone,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAllUsers } from '@/hooks/useUser';
import { courseService } from '@/services/courseService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import type { Course } from '@/types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: allUsers, isLoading: usersLoading } = useAllUsers();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    courseService.getAll().then((data) => {
      setCourses(data);
      setCoursesLoading(false);
    });
  }, []);

  const totalUsers = allUsers?.length || 0;
  const activeUsers = allUsers?.filter((u) => u.isActive).length || 0;
  const totalCourses = courses.length;
  const totalLessons = courses.reduce((sum, c) => sum + (c.lessonsCount || 0), 0);
  const recentUsers = allUsers?.slice(-5).reverse() || [];

  const stats = [
    { label: 'إجمالي المستخدمين', value: totalUsers, icon: Users, color: 'from-cyan-500 to-blue-600' },
    { label: 'المستخدمين النشطين', value: activeUsers, icon: Activity, color: 'from-green-500 to-emerald-600' },
    { label: 'إجمالي الدورات', value: totalCourses, icon: BookOpen, color: 'from-purple-500 to-pink-600' },
    { label: 'إجمالي الدروس', value: totalLessons, icon: GraduationCap, color: 'from-orange-500 to-red-600' },
  ];

  return (
    <div dir="rtl" className="font-cairo min-h-screen bg-[#0B1E3D] p-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-8"
      >
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">لوحة التحكم - الإدارة</h1>
            <p className="text-gray-400 mt-1">مرحباً، {user?.name}</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">
                  {usersLoading || coursesLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2">
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">أحدث المستخدمين</h2>
              {usersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">لا يوجد مستخدمين بعد</p>
              ) : (
                <div className="space-y-2">
                  {recentUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{u.name}</p>
                        <p className="text-gray-500 text-xs truncate">{u.email}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full ${
                        u.isActive
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {u.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">إجراءات سريعة</h2>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => (window.location.href = '/admin/users')}
                >
                  <Users className="w-4 h-4" />
                  إدارة المستخدمين
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => (window.location.href = '/admin/courses')}
                >
                  <BookOpen className="w-4 h-4" />
                  إدارة الدورات
                </Button>
                <Button
                  variant="primary"
                  className="w-full justify-start"
                  onClick={() => (window.location.href = '/admin/courses/new')}
                >
                  <Plus className="w-4 h-4" />
                  إضافة دورة جديدة
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => (window.location.href = '/admin/payments')}
                >
                  <Smartphone className="w-4 h-4" />
                  طلبات الدفع
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
