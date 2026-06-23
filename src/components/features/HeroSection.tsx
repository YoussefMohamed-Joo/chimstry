'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Users, GraduationCap, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const stats = [
  { icon: BookOpen, value: '١٢٠+', label: 'دورة تعليمية' },
  { icon: Users, value: '٥٠,٠٠٠+', label: 'طالب مسجل' },
  { icon: GraduationCap, value: '٣٥+', label: 'معلم خبير' },
];

export default function HeroSection() {
  return (
    <section className="bg-white border-b border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eef2ff] border border-[#e5e7eb] text-[#1e40af] text-sm font-medium mb-6">
            <Beaker className="w-4 h-4" />
            منصة تعليم الكيمياء الأولى في العالم العربي
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1e293b] leading-tight mb-6">
            أتقن علم{' '}
            <span className="text-[#1e40af]">الكيمياء</span>
            <br />
            برحلة تعليمية تفاعلية
          </h1>

          <p className="text-lg text-[#475569] max-w-2xl mx-auto mb-8 leading-relaxed">
            منصة متخصصة في علوم الكيمياء، نقدم محتوى تفاعلي وشامل مع أفضل المعلمين
            لطلاب الكيمياء في جميع المراحل التعليمية
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link href="/courses">
              <Button variant="default" size="xl">
                ابدأ التعلم الآن
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="secondary" size="xl">
                تصفح المسارات
              </Button>
            </Link>
          </div>

          <div className="max-w-md mx-auto mb-14">
            <div className="relative">
              <Input
                placeholder="ابحث عن دورات في الكيمياء..."
                className="h-12 pr-12 text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg border border-[#e5e7eb] bg-[#f8fafc]">
                <div className="w-10 h-10 rounded-lg bg-[#eef2ff] flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-[#1e40af]" />
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#1e293b]">{stat.value}</p>
                  <p className="text-xs text-[#94a3b8]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
