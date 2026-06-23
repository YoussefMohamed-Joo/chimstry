'use client';

import Link from 'next/link';
import { Star, Clock, Users, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatPrice } from '@/lib/utils';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  progress?: number;
  index?: number;
}

const levelStyles: Record<string, { badge: 'green' | 'yellow' | 'red'; text: string }> = {
  beginner: { badge: 'green', text: 'مبتدئ' },
  intermediate: { badge: 'yellow', text: 'متوسط' },
  advanced: { badge: 'red', text: 'متقدم' },
};

export default function CourseCard({ course, isEnrolled, progress, index = 0 }: CourseCardProps) {
  const level = levelStyles[course.level] || { badge: 'blue' as const, text: course.levelAr };

  return (
    <Link href={`/courses/${course.id}`} className="block group">
      <div className="bg-white rounded-lg border border-[#e5e7eb] overflow-hidden transition-all duration-200 hover:border-[#cbd5e1] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="relative h-56 bg-gradient-to-br from-[#eef2ff] to-[#f8fafc] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]">
            <svg viewBox="0 0 400 280" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M200 40 L200 70 L215 90 Q230 110 230 140 L230 190 Q230 220 210 230 L195 235 Q175 240 175 230 L175 190 Q175 170 160 150 L140 90 Q125 70 125 40 Z" stroke="#1e40af" strokeWidth="1" />
              <line x1="135" y1="60" x2="155" y2="60" stroke="#1e40af" strokeWidth="0.5" opacity="0.3" />
              <line x1="132" y1="75" x2="158" y2="75" stroke="#1e40af" strokeWidth="0.5" opacity="0.3" />
              <line x1="175" y1="55" x2="195" y2="55" stroke="#1e40af" strokeWidth="0.5" opacity="0.3" />
              <line x1="178" y1="70" x2="192" y2="70" stroke="#1e40af" strokeWidth="0.5" opacity="0.3" />
            </svg>
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge variant="blue">{course.categoryAr}</Badge>
            <Badge variant={level.badge}>{level.text}</Badge>
          </div>
          {isEnrolled && progress !== undefined && (
            <div className="absolute top-3 left-3">
              <Badge variant="green">{Math.round(progress)}% مكتمل</Badge>
            </div>
          )}
          <div className="absolute bottom-3 right-3">
            <div className="flex -space-x-1.5 rtl:space-x-reverse">
              <div className="w-8 h-8 rounded-full bg-[#1e40af] flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                {course.teacher.nameAr.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="text-base font-bold text-[#1e293b] leading-snug line-clamp-2 group-hover:text-[#1e40af] transition-colors">
            {course.titleAr}
          </h3>

          <div className="flex items-center gap-2 text-sm text-[#475569]">
            <span>{course.teacher.nameAr}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#d97706] fill-[#d97706]" />
              <span className="text-[#475569]">{course.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{course.studentsCount.toLocaleString('ar-SA')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration}</span>
            </div>
          </div>

          {isEnrolled && progress !== undefined && (
            <Progress value={progress} className="h-1.5" />
          )}

          <div className="flex items-center justify-between pt-1">
            {isEnrolled ? (
              <Button variant="default" size="sm">
                متابعة
                <ArrowLeft className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <span className="text-base font-bold text-[#1e40af]">
                  {course.price === 0 ? 'مجاناً' : formatPrice(course.price)}
                </span>
                <Button variant="secondary" size="sm">
                  اشتراك
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
