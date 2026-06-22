'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Atom, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks/useUser';
import { useAuthStore } from '@/store/authStore';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const loginMutation = useLogin();
  const isAdmin = useAuthStore((s) => s.isAdmin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await loginMutation.mutateAsync({ email, password });
      if (isAdmin) {
        window.location.href = '/admin/dashboard';
      } else {
        setError('ليس لديك صلاحية الوصول إلى لوحة الإدارة');
      }
    } catch (err: any) {
      setError(err?.message || 'فشل تسجيل الدخول');
    }
  };

  return (
    <div
      dir="rtl"
      className="font-cairo min-h-screen flex items-center justify-center bg-[#0B1E3D] p-4"
      style={{
        backgroundImage: 'radial-gradient(ellipse at top, rgba(0, 194, 203, 0.08) 0%, transparent 60%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-4">
              <Atom className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">كيمستري</h1>
            <p className="text-gray-400 text-sm mt-1">لوحة الإدارة</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="البريد الإلكتروني"
              type="email"
              dir="ltr"
              className="text-left"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@chimstry.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              label="كلمة المرور"
              type="password"
              dir="ltr"
              className="text-left"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              required
            />
            <Button
              type="submit"
              isLoading={loginMutation.isPending}
              className="w-full"
              size="lg"
            >
              {loginMutation.isPending ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
