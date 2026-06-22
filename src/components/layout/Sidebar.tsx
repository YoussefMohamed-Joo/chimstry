'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, User, Settings, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/cn';

const sidebarLinks = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/dashboard/courses', label: 'دوراتي', icon: BookOpen },
  { href: '/profile', label: 'الملف الشخصي', icon: User },
  { href: '/dashboard/settings', label: 'الإعدادات', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const sidebarContent = (
    <div dir="rtl" className="h-full flex flex-col bg-[#0B1E3D]/80 backdrop-blur-xl border-l border-white/10 w-64">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium text-sm truncate">{user?.name || 'مستخدم'}</p>
            <p className="text-gray-400 text-xs truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onClose()}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-cyan-400 bg-cyan-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <ChevronLeft className="w-5 h-5 shrink-0" />
          <span>العودة للموقع</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block h-full">{sidebarContent}</aside>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 bottom-0 right-0 w-72"
            >
              {sidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
