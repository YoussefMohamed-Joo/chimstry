'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/cn';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/courses', label: 'الدورات' },
    { href: '/lab', label: 'المعمل' },
    { href: isAdmin ? '/admin/dashboard' : '/dashboard', label: 'لوحة التحكم' },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav dir="rtl" className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e5e7eb]',
      'transition-shadow duration-200'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#1e40af]">كيمستري</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  pathname === link.href
                    ? 'text-[#1e40af] bg-[#eef2ff]'
                    : 'text-[#475569] hover:text-[#1e293b] hover:bg-[#f8fafc]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e5e7eb] hover:bg-[#f8fafc] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1e40af] flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm text-[#475569]">{user.name}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  خروج
                </Button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="secondary" size="sm">
                    <LogIn className="w-4 h-4" />
                    دخول
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="default" size="sm">
                    إنشاء حساب
                  </Button>
                </Link>
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f8fafc] transition-colors"
              aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            >
              {isOpen ? <X className="w-5 h-5 text-[#475569]" /> : <Menu className="w-5 h-5 text-[#475569]" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-[#e5e7eb] bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-[#1e40af] bg-[#eef2ff]'
                    : 'text-[#475569] hover:text-[#1e293b] hover:bg-[#f8fafc]'
                )}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-[#e5e7eb] my-3" />
            {isAuthenticated && user ? (
              <div className="space-y-2 px-2">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-9 h-9 rounded-full bg-[#1e40af] flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1e293b]">{user.name}</p>
                    <p className="text-xs text-[#94a3b8]">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-right px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="space-y-2 px-2 pt-2">
                <Link href="/auth/login" className="block">
                  <Button variant="secondary" size="md" className="w-full">
                    <LogIn className="w-4 h-4" />
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link href="/auth/register" className="block">
                  <Button variant="default" size="md" className="w-full">
                    إنشاء حساب
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
