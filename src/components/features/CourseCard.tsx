'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock, Users, Play, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/lib/utils';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  progress?: number;
  index?: number;
}

const levelVariant = {
  beginner: 'green' as const,
  intermediate: 'yellow' as const,
  advanced: 'red' as const,
};

export default function CourseCard({ course, isEnrolled, progress, index = 0 }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
    >
      <Link href={`/courses/${course.id}`} className="block group">
        <div
          className={cn(
            'relative rounded-xl overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-xl',
            'transition-all duration-500 ease-out',
            'group-hover:-translate-y-2 group-hover:scale-[1.02]',
            'group-hover:shadow-xl group-hover:shadow-cyan-500/20 group-hover:border-cyan-500/30'
          )}
        >
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-[#0B1E3D] group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E3D]/90 via-transparent to-transparent" />
            <div className="absolute top-3 right-3 flex gap-2">
              <Badge variant="cyan">{course.categoryAr}</Badge>
              <Badge variant={levelVariant[course.level]}>{course.levelAr}</Badge>
            </div>
            {isEnrolled && progress !== undefined && (
              <div className="absolute top-3 left-3">
                <Badge variant="green" className="gap-1.5">
                  <Play className="w-3 h-3" />
                  {Math.round(progress)}%
                </Badge>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-cyan-500/80 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Play className="w-6 h-6 text-white mr-0.5" />
              </div>
            </div>
          </div>

          <div className="p-5 space-y-3">
            <h3 className="text-lg font-bold text-white leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">
              {course.titleAr}
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {course.teacher.nameAr.charAt(0)}
              </div>
              <span className="text-sm text-gray-400 truncate">{course.teacher.nameAr}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span>{course.rating.toFixed(1)}</span>
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

            <div className="flex items-center justify-between pt-2">
              {isEnrolled ? (
                <Button variant="primary" size="sm" className="group/btn">
                  متابعة
                  <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                </Button>
              ) : (
                <>
                  <span className="text-lg font-bold text-cyan-400">
                    {course.price === 0 ? 'مجاناً' : formatPrice(course.price)}
                  </span>
                  <Button variant="outline" size="sm">
                    اشتراك
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
