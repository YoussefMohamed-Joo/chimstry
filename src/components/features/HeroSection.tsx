'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, BookOpen, Users, Beaker, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ParticlesBackground from '@/components/shared/Particles';

const floatingAtoms = [
  { icon: Beaker, size: 24, x: '10%', y: '20%', delay: 0, duration: 6 },
  { icon: Beaker, size: 18, x: '80%', y: '15%', delay: 1.5, duration: 7 },
  { icon: Beaker, size: 20, x: '20%', y: '70%', delay: 0.8, duration: 5.5 },
  { icon: Beaker, size: 16, x: '75%', y: '75%', delay: 2, duration: 6.5 },
  { icon: Beaker, size: 22, x: '50%', y: '10%', delay: 1.2, duration: 8 },
  { icon: Beaker, size: 14, x: '90%', y: '50%', delay: 0.5, duration: 5 },
  { icon: Beaker, size: 28, x: '5%', y: '50%', delay: 1.8, duration: 7.5 },
];

const stats = [
  { icon: BookOpen, value: '١٢٠+', label: 'دورة تعليمية' },
  { icon: Users, value: '٥٠,٠٠٠+', label: 'طالب مسجل' },
  { icon: GraduationCap, value: '٣٥+', label: 'معلم خبير' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-[#0B1E3D] via-[#0a1628] to-[#0B1E3D]">
      <ParticlesBackground />

      {floatingAtoms.map((atom, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: atom.x, top: atom.y }}
          animate={{
            y: [0, -30, 0, 20, 0],
            rotate: [0, 180, 360],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: atom.duration,
            delay: atom.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <atom.icon
            className="text-cyan-400/20"
            style={{ width: atom.size, height: atom.size }}
          />
        </motion.div>
      ))}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8">
              <Beaker className="w-4 h-4" />
              منصة تعليم الكيمياء الأولى في العالم العربي
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              أتقن علم الكيمياء
            </span>
            <br />
            <span className="text-white">برحلة تعليمية تفاعلية</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            منصة متخصصة في علوم الكيمياء، نقدم محتوى تفاعلي وشامل مع أفضل المعلمين
            لطلاب الكيمياء في جميع المراحل التعليمية
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/courses">
              <Button variant="primary" size="xl" className="group">
                ابدأ التعلم الآن
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="secondary" size="xl">
                تصفح المسارات
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="max-w-xl mx-auto mb-16"
          >
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث عن دورات في الكيمياء..."
                className="h-14 pr-12 text-base bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <stat.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
