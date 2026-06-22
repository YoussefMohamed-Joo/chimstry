'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Monitor,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/cn';
import { useUpdateProgress, useLessons } from '@/hooks/useLessons';
import type { Lesson } from '@/types';

interface LessonPlayerProps {
  lesson: Lesson;
  courseId: string;
  userId: string;
  isEnrolled: boolean;
}

const resourceIcon = {
  pdf: FileText,
  video: Monitor,
  quiz: BookOpen,
};

export default function LessonPlayer({ lesson, courseId, userId, isEnrolled }: LessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [markedComplete, setMarkedComplete] = useState(false);
  const updateProgress = useUpdateProgress();
  const { data: lessons } = useLessons(courseId);

  const currentIndex = lessons?.findIndex((l) => l.id === lesson.id) ?? -1;
  const prevLesson = currentIndex > 0 ? lessons?.[currentIndex - 1] : null;
  const nextLesson = lessons?.[currentIndex + 1] ?? null;

  const handleMarkComplete = () => {
    setMarkedComplete(true);
    updateProgress.mutate({
      userId,
      courseId,
      lessonId: lesson.id,
      completed: true,
      watchedSeconds: 0,
      lastWatchedAt: new Date().toISOString(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0B1E3D] border border-white/10 group cursor-pointer"
        onClick={() => setIsPlaying(true)}
      >
        {!isPlaying ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/30 group-hover:scale-110 transition-all duration-300">
                <Play className="w-8 h-8 text-cyan-400 mr-1" />
              </div>
            </div>
            <div className="absolute bottom-4 right-4">
              <Badge variant="cyan" className="gap-1.5">
                <Monitor className="w-3.5 h-3.5" />
                {lesson.duration}
              </Badge>
            </div>
            {!lesson.isFree && !isEnrolled && (
              <div className="absolute inset-0 bg-[#0B1E3D]/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white font-bold mb-3">هذا الدرس غير متاح مجاناً</p>
                  <Link href={`/courses/${courseId}`}>
                    <Button variant="primary" size="sm">
                      اشترك الآن للوصول الكامل
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-gray-400 text-sm">معاينة الفيديو</p>
          </div>
        )}
      </motion.div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">
                الدرس {lesson.order}
              </Badge>
              {lesson.isFree && (
                <Badge variant="green" className="text-xs">مجاني</Badge>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">{lesson.titleAr}</h2>
          </div>
          {isEnrolled && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={markedComplete ? 'primary' : 'outline'}
                size="sm"
                onClick={handleMarkComplete}
                isLoading={updateProgress.isPending}
                className="gap-2"
              >
                {markedComplete ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                {markedComplete ? 'تم الإكمال' : 'تحديد كمكتمل'}
              </Button>
            </motion.div>
          )}
        </div>

        <p className="text-gray-400 leading-relaxed">{lesson.descriptionAr}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={lesson.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {(prevLesson || nextLesson) && (
            <div className="flex items-center justify-between gap-3">
              {prevLesson ? (
                <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
                  <Button variant="secondary" size="md" className="gap-2">
                    <ChevronRight className="w-4 h-4" />
                    الدرس السابق
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                  <Button variant="primary" size="md" className="gap-2">
                    الدرس التالي
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Link href={`/courses/${courseId}`}>
                  <Button variant="primary" size="md" className="gap-2">
                    العودة إلى الدورة
                  </Button>
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {lesson.resources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" />
            المصادر والملفات
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lesson.resources.map((resource, i) => {
              const Icon = resourceIcon[resource.type];
              return (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {resource.nameAr}
                    </p>
                    <p className="text-xs text-gray-500">
                      {resource.type === 'pdf' ? 'ملف PDF' : resource.type === 'video' ? 'فيديو' : 'اختبار'}
                    </p>
                  </div>
                  <Download className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                </a>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
