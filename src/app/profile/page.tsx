'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, Bell, Shield, Camera, Save, Eye, EyeOff,
  Moon, Globe, ChevronLeft, LogOut, AtSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import EmptyState from '@/components/shared/EmptyState';

const notifications = [
  { id: 'n1', label: 'إشعارات الدورات الجديدة', enabled: true },
  { id: 'n2', label: 'تذكير بمواعيد الدروس', enabled: true },
  { id: 'n3', label: 'عروض وخصومات', enabled: false },
  { id: 'n4', label: 'النشرة البريدية الأسبوعية', enabled: false },
];

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedBio, setEditedBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notifState, setNotifState] = useState(notifications);

  const toggleNotif = (id: string) => {
    setNotifState((prev) => prev.map((n) => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-24">
        <EmptyState
          icon={User}
          title="يرجى تسجيل الدخول"
          description="سجل دخولك للوصول إلى الملف الشخصي"
          actionLabel="تسجيل الدخول"
          onAction={() => window.location.href = '/auth/login'}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
            <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
            <Badge variant="blue" className="mt-2">
              {user.role === 'student' ? 'طالب' : user.role === 'teacher' ? 'معلم' : 'مشرف'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              المعلومات الشخصية
            </h2>
            <div className="space-y-4">
              <Input
                label="الاسم الكامل"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                icon={<User className="w-4 h-4" />}
              />
              <Input
                label="البريد الإلكتروني"
                value={user.email}
                disabled
                icon={<Mail className="w-4 h-4" />}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">نبذة عني</label>
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  placeholder="اكتب نبذة قصيرة عن نفسك..."
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 hover:border-white/30 resize-none"
                />
              </div>
              <Button variant="primary" size="md" className="gap-2">
                <Save className="w-4 h-4" />
                حفظ التغييرات
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              تغيير كلمة المرور
            </h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">كلمة المرور الحالية</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 pl-10 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 hover:border-white/30"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">كلمة المرور الجديدة</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 pl-10 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 hover:border-white/30"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">تأكيد كلمة المرور الجديدة</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 pl-10 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 hover:border-white/30"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button variant="primary" size="md" className="gap-2">
                <Save className="w-4 h-4" />
                تحديث كلمة المرور
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              إعدادات الإشعارات
            </h2>
            <div className="space-y-4">
              {notifState.map((notif) => (
                <div key={notif.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{notif.label}</span>
                  <button
                    onClick={() => toggleNotif(notif.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${notif.enabled ? 'bg-cyan-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${notif.enabled ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              إعدادات الحساب
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">اللغة</p>
                  <p className="text-xs text-gray-500">العربية - اللغة الافتراضية</p>
                </div>
                <Globe className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">الوضع الليلي</p>
                  <p className="text-xs text-gray-500">مفعل بشكل افتراضي</p>
                </div>
                <Moon className="w-5 h-5 text-cyan-400" />
              </div>
              <hr className="border-white/5" />
              <Button variant="danger" size="md" className="w-full gap-2" onClick={logout}>
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
