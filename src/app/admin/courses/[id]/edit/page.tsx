'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { Course } from '@/types';

const categories = [
  { value: 'general', labelAr: 'عام' },
  { value: 'organic', labelAr: 'عضوية' },
  { value: 'physical', labelAr: 'فيزيائية' },
  { value: 'analytical', labelAr: 'تحليلية' },
  { value: 'biochemistry', labelAr: 'كيمياء حيوية' },
];

const levels = [
  { value: 'beginner', labelAr: 'مبتدئ' },
  { value: 'intermediate', labelAr: 'متوسط' },
  { value: 'advanced', labelAr: 'متقدم' },
];

const categoryArMap: Record<string, string> = {
  general: 'عام',
  organic: 'عضوية',
  physical: 'فيزيائية',
  analytical: 'تحليلية',
  biochemistry: 'كيمياء حيوية',
};

const levelArMap: Record<string, string> = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدم',
};

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    category: 'general',
    categoryAr: 'عام',
    level: 'beginner',
    levelAr: 'مبتدئ',
    teacher: '',
    teacherAr: '',
    teacherSpecialty: '',
    duration: '',
    price: 0,
    tags: '',
  });

  useEffect(() => {
    params.then(({ id }) => {
      setCourseId(id);
      courseService.getById(id).then((data) => {
        if (data) {
          setCourse(data);
          setForm({
            title: data.title,
            titleAr: data.titleAr,
            description: data.description,
            descriptionAr: data.descriptionAr,
            category: data.category,
            categoryAr: data.categoryAr,
            level: data.level,
            levelAr: data.levelAr,
            teacher: data.teacher?.name || '',
            teacherAr: data.teacher?.nameAr || '',
            teacherSpecialty: data.teacher?.specialty || '',
            duration: data.duration,
            price: data.price,
            tags: data.tags.join(', '),
          });
        } else {
          setError('الدورة غير موجودة');
        }
        setLoading(false);
      });
    });
  }, [params]);

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'category') {
        next.categoryAr = categoryArMap[value as string] || (value as string);
      }
      if (field === 'level') {
        next.levelAr = levelArMap[value as string] || (value as string);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    setSaving(true);
    try {
      await courseService.update(courseId, {
        title: form.title,
        titleAr: form.titleAr,
        description: form.description,
        descriptionAr: form.descriptionAr,
        category: form.category,
        categoryAr: form.categoryAr,
        level: form.level as 'beginner' | 'intermediate' | 'advanced',
        levelAr: form.levelAr,
        teacher: {
          ...course!.teacher,
          name: form.teacher,
          nameAr: form.teacherAr,
          specialty: form.teacherSpecialty,
        },
        duration: form.duration,
        price: form.price,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      router.push('/admin/courses');
    } catch {
      alert('حدث خطأ أثناء تحديث الدورة');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div dir="rtl" className="font-cairo min-h-screen bg-[#0B1E3D] p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div dir="rtl" className="font-cairo min-h-screen bg-[#0B1E3D] p-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-4">{error || 'حدث خطأ'}</p>
          <Button onClick={() => router.push('/admin/courses')}>العودة إلى الدورات</Button>
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
          <h1 className="text-3xl font-bold text-white">تعديل الدورة</h1>
        </div>

        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="العنوان (English)"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
              />
              <Input
                label="العنوان (عربي)"
                value={form.titleAr}
                onChange={(e) => updateField('titleAr', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">الوصف (English)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={4}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 hover:border-white/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">الوصف (عربي)</label>
                <textarea
                  value={form.descriptionAr}
                  onChange={(e) => updateField('descriptionAr', e.target.value)}
                  rows={4}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 hover:border-white/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">التصنيف</label>
                <select
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 hover:border-white/30"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value} className="bg-[#0B1E3D]">{c.labelAr}</option>
                  ))}
                </select>
              </div>
              <Input
                label="التصنيف (عربي)"
                value={form.categoryAr}
                onChange={(e) => updateField('categoryAr', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">المستوى</label>
                <select
                  value={form.level}
                  onChange={(e) => updateField('level', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 hover:border-white/30"
                >
                  {levels.map((l) => (
                    <option key={l.value} value={l.value} className="bg-[#0B1E3D]">{l.labelAr}</option>
                  ))}
                </select>
              </div>
              <Input
                label="المستوى (عربي)"
                value={form.levelAr}
                onChange={(e) => updateField('levelAr', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="اسم المعلم (English)"
                value={form.teacher}
                onChange={(e) => updateField('teacher', e.target.value)}
                required
              />
              <Input
                label="اسم المعلم (عربي)"
                value={form.teacherAr}
                onChange={(e) => updateField('teacherAr', e.target.value)}
                required
              />
              <Input
                label="تخصص المعلم"
                value={form.teacherSpecialty}
                onChange={(e) => updateField('teacherSpecialty', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="المدة"
                value={form.duration}
                onChange={(e) => updateField('duration', e.target.value)}
                required
              />
              <Input
                label="السعر"
                type="number"
                value={form.price}
                onChange={(e) => updateField('price', Number(e.target.value))}
                required
              />
              <Input
                label="الوسوم (مفصولة بفواصل)"
                value={form.tags}
                onChange={(e) => updateField('tags', e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" type="button" onClick={() => router.push('/admin/courses')}>
                إلغاء
              </Button>
              <Button type="submit" variant="primary" isLoading={saving}>
                <Save className="w-4 h-4" />
                {saving ? 'جاري الحفظ...' : 'تحديث الدورة'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
