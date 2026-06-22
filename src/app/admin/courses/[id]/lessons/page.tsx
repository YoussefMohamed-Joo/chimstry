'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Trash2,
  BookOpen,
  Lock,
  Unlock,
  GripVertical,
} from 'lucide-react';
import { courseService } from '@/services/courseService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Course, Lesson, LessonResource } from '@/types';

const STORAGE_KEY = 'admin_lessons';

function loadLocalLessons(courseId: string): Lesson[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${courseId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalLessons(courseId: string, lessons: Lesson[]) {
  localStorage.setItem(`${STORAGE_KEY}_${courseId}`, JSON.stringify(lessons));
}

function generateId() {
  return `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function LessonsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const [newLesson, setNewLesson] = useState({
    titleAr: '',
    duration: '',
    isFree: false,
    order: 1,
    resourceName: '',
    resourceUrl: '',
  });

  useEffect(() => {
    params.then(({ id }) => {
      setCourseId(id);
      courseService.getById(id).then((data) => {
        if (data) setCourse(data);
        setLessons(loadLocalLessons(id));
        if (data) {
          setNewLesson((prev) => ({ ...prev, order: (data.lessonsCount || 0) + 1 }));
        }
        setLoading(false);
      });
    });
  }, [params]);

  const updateLessons = useCallback(
    (updated: Lesson[]) => {
      setLessons(updated);
      if (courseId) saveLocalLessons(courseId, updated);
    },
    [courseId]
  );

  const handleAddLesson = () => {
    if (!newLesson.titleAr.trim() || !courseId) return;

    const resources: LessonResource[] = [];
    if (newLesson.resourceName.trim() && newLesson.resourceUrl.trim()) {
      resources.push({
        name: newLesson.resourceName,
        nameAr: newLesson.resourceName,
        url: newLesson.resourceUrl,
        type: 'pdf',
      });
    }

    const lesson: Lesson = {
      id: generateId(),
      courseId,
      title: newLesson.titleAr,
      titleAr: newLesson.titleAr,
      description: '',
      descriptionAr: '',
      videoUrl: '',
      duration: newLesson.duration,
      order: newLesson.order,
      isFree: newLesson.isFree,
      resources,
    };

    updateLessons([...lessons, lesson]);
    setNewLesson({
      titleAr: '',
      duration: '',
      isFree: false,
      order: lessons.length + 2,
      resourceName: '',
      resourceUrl: '',
    });
  };

  const handleDeleteLesson = (id: string, titleAr: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الدرس "${titleAr}"؟`)) {
      updateLessons(lessons.filter((l) => l.id !== id));
    }
  };

  if (loading) {
    return (
      <div dir="rtl" className="font-cairo min-h-screen bg-[#0B1E3D] p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-60 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="font-cairo min-h-screen bg-[#0B1E3D] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/courses')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">إدارة الدروس</h1>
            <p className="text-gray-400 text-sm mt-1">{course?.titleAr || ''}</p>
          </div>
        </div>

        {lessons.length > 0 && (
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">الدروس الحالية ({lessons.length})</h2>
            <div className="space-y-2">
              {lessons
                .sort((a, b) => a.order - b.order)
                .map((lesson, idx) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors group"
                  >
                    <GripVertical className="w-4 h-4 text-gray-600 shrink-0" />
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {lesson.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{lesson.titleAr}</p>
                      <p className="text-gray-500 text-xs">{lesson.duration}</p>
                    </div>
                    {lesson.isFree ? (
                      <Badge variant="green">
                        <Unlock className="w-3 h-3" />
                        مجاني
                      </Badge>
                    ) : (
                      <Badge variant="default">
                        <Lock className="w-3 h-3" />
                        مدفوع
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLesson(lesson.id, lesson.titleAr)}
                      className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {lessons.length === 0 && (
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">لا توجد دروس بعد</p>
            <p className="text-gray-500 text-sm mt-1">أضف أول درس الآن</p>
          </div>
        )}

        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">إضافة درس جديد</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="عنوان الدرس"
                value={newLesson.titleAr}
                onChange={(e) => setNewLesson((p) => ({ ...p, titleAr: e.target.value }))}
                placeholder="مثال: مقدمة في الكيمياء"
              />
              <Input
                label="المدة"
                value={newLesson.duration}
                onChange={(e) => setNewLesson((p) => ({ ...p, duration: e.target.value }))}
                placeholder="مثال: 45 دقيقة"
              />
              <Input
                label="الترتيب"
                type="number"
                value={newLesson.order}
                onChange={(e) => setNewLesson((p) => ({ ...p, order: Number(e.target.value) }))}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFree"
                checked={newLesson.isFree}
                onChange={(e) => setNewLesson((p) => ({ ...p, isFree: e.target.checked }))}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-400"
              />
              <label htmlFor="isFree" className="text-sm text-gray-300">
                درس مجاني
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <Input
                label="اسم المرفق (اختياري)"
                value={newLesson.resourceName}
                onChange={(e) => setNewLesson((p) => ({ ...p, resourceName: e.target.value }))}
                placeholder="مثال: ملزمة الدرس"
              />
              <Input
                label="رابط المرفق (اختياري)"
                value={newLesson.resourceUrl}
                onChange={(e) => setNewLesson((p) => ({ ...p, resourceUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleAddLesson} variant="primary">
                <Plus className="w-4 h-4" />
                إضافة الدرس
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
