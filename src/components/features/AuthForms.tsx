'use client';

import { useState, useEffect, type InputHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';
import { useLogin, useRegister } from '@/hooks/useUser';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('البريد الإلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة').min(6, 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل'),
});

const registerSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب').min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('البريد الإلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة').min(6, 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل'),
  confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمة المرور غير متطابقة',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthFormsProps {
  mode: 'login' | 'register';
}

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputId = id || label.replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            <Lock className="w-4 h-4" />
          </div>
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            className={cn(
              'w-full rounded-xl border bg-white/5 px-4 py-2.5 pr-10 pl-10 text-sm text-white placeholder-gray-500',
              'transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50',
              'hover:border-white/30',
              error ? 'border-red-500/50 focus:ring-red-400/50 focus:border-red-400/50' : 'border-white/10',
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

function LoginForm() {
  const login = useLogin();
  const { isAdmin } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (login.isSuccess) {
      setTimeout(() => {
        window.location.href = isAdmin ? '/admin/dashboard' : '/';
      }, 300);
    }
  }, [login.isSuccess, isAdmin]);

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Input
          label="البريد الإلكتروني"
          type="email"
          placeholder="your@email.com"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      <div>
        <PasswordInput
          label="كلمة المرور"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>
      {login.error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-2 border border-red-500/20"
        >
          {login.error instanceof Error ? login.error.message : 'حدث خطأ في تسجيل الدخول'}
        </motion.p>
      )}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={login.isPending}
      >
        <LogIn className="w-5 h-5" />
        تسجيل الدخول
      </Button>
      <p className="text-center text-sm text-gray-400">
        ليس لديك حساب؟{' '}
        <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
          إنشاء حساب جديد
        </Link>
      </p>
    </form>
  );
}

function RegisterForm() {
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Input
          label="الاسم الكامل"
          type="text"
          placeholder="أحمد محمد"
          icon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />
      </div>
      <div>
        <Input
          label="البريد الإلكتروني"
          type="email"
          placeholder="your@email.com"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      <div>
        <PasswordInput
          label="كلمة المرور"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>
      <div>
        <PasswordInput
          label="تأكيد كلمة المرور"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>
      {registerMutation.error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-2 border border-red-500/20"
        >
          {registerMutation.error instanceof Error ? registerMutation.error.message : 'حدث خطأ في إنشاء الحساب'}
        </motion.p>
      )}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={registerMutation.isPending}
      >
        <UserPlus className="w-5 h-5" />
        إنشاء حساب
      </Button>
      <p className="text-center text-sm text-gray-400">
        لديك حساب بالفعل؟{' '}
        <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
          تسجيل الدخول
        </Link>
      </p>
    </form>
  );
}

export default function AuthForms({ mode }: AuthFormsProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0B1E3D] to-[#0a1628] px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 sm:p-10 shadow-2xl shadow-black/20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center mb-4">
              <Atom className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h1>
            <p className="text-gray-400 text-sm">
              {mode === 'login'
                ? 'مرحباً بعودتك! سجل دخولك للمتابعة'
                : 'انضم إلى منصة كيمستري وابدأ رحلة التعلم'}
            </p>
          </motion.div>

          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {mode === 'login' ? <LoginForm /> : <RegisterForm />}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
