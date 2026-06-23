'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ToggleLeft, ToggleRight, User as UserIcon } from 'lucide-react';
import { useAllUsers, useToggleUserStatus } from '@/hooks/useUser';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/types';

export default function AdminUsersPage() {
  const { data: users, isLoading, error } = useAllUsers();
  const toggleStatus = useToggleUserStatus();
  const [search, setSearch] = useState('');

  const filtered = (users || []).filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.includes(search.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const map: Record<string, { label: string; variant: 'blue' | 'green' }> = {
      admin: { label: 'مدير', variant: 'blue' },
      teacher: { label: 'معلم', variant: 'blue' },
      student: { label: 'طالب', variant: 'green' },
    };
    return map[role] || { label: role, variant: 'default' as const };
  };

  return (
    <div dir="rtl" className="font-cairo min-h-screen bg-[#0B1E3D] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-white">إدارة المستخدمين</h1>
          <Input
            placeholder="بحث عن مستخدم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="max-w-xs"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-red-400">حدث خطأ أثناء تحميل البيانات</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
            <UserIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {search ? 'لا توجد نتائج للبحث' : 'لا يوجد مستخدمين'}
            </p>
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">الاسم</th>
                    <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">البريد الإلكتروني</th>
                    <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">الدور</th>
                    <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">الحالة</th>
                    <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">الدورات المسجلة</th>
                    <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">تاريخ التسجيل</th>
                    <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u: User, idx: number) => {
                    const roleInfo = getRoleBadge(u.role);
                    return (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <span className="text-white text-sm">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{u.email}</td>
                        <td className="px-6 py-4">
                          <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={u.isActive ? 'green' : 'red'}>
                            {u.isActive ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{u.enrolledCourses?.length || 0}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {new Date(u.createdAt).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStatus.mutate(u.id)}
                            disabled={toggleStatus.isPending}
                            className={u.isActive ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}
                          >
                            {u.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            {u.isActive ? 'تعطيل' : 'تفعيل'}
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
