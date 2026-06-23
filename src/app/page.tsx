'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Users, BookOpen, GraduationCap, Atom, FlaskRound as Flask, Microscope, Zap, Dna } from 'lucide-react';
import HeroSection from '@/components/features/HeroSection';
import CourseCard from '@/components/features/CourseCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFeaturedCourses } from '@/hooks/useCourses';
import { CourseCardSkeleton } from '@/components/ui/skeleton';
import type { Category, Testimonial } from '@/types';
import categoriesData from '@/data/categories.json';
import testimonialsData from '@/data/testimonials.json';
const testimonials = testimonialsData as unknown as Testimonial[];

const categories = categoriesData as unknown as Category[];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

const categoryIcons: Record<string, React.ElementType> = {
  Flask, Atom, Zap, Microscope, Dna,
};

const teachers = [
  { id: 'teacher-1', nameAr: 'د. أحمد الرشيد', specialty: 'كيمياء عضوية', avatar: 'أ' },
  { id: 'teacher-2', nameAr: 'د. ليلى حسن', specialty: 'كيمياء عضوية', avatar: 'ل' },
  { id: 'teacher-3', nameAr: 'أ.د. كريم منصور', specialty: 'كيمياء فيزيائية', avatar: 'ك' },
  { id: 'teacher-4', nameAr: 'د. سميرة عثمان', specialty: 'كيمياء تحليلية', avatar: 'س' },
  { id: 'teacher-5', nameAr: 'د. نور الدين', specialty: 'كيمياء حيوية', avatar: 'ن' },
];

const stats = [
  { icon: BookOpen, value: '١٢٠+', label: 'دورة تعليمية' },
  { icon: Users, value: '٥٠,٠٠٠+', label: 'طالب مسجل' },
  { icon: GraduationCap, value: '٣٥+', label: 'معلم خبير' },
  { icon: Star, value: '٤.٩', label: 'متوسط التقييم' },
];

export default function HomePage() {
  const { data: featured, isLoading: featuredLoading } = useFeaturedCourses();

  return (
    <div>
      <HeroSection />

      {/* Featured Courses */}
      <section className="bg-white border-b border-[#e5e7eb]">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Badge variant="blue" className="mb-4">دورات مميزة</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
              أشهر الدورات التعليمية
            </h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              اختر من بين مجموعتنا المختارة من أفضل دورات الكيمياء
            </p>
          </motion.div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => <CourseCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured?.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <CourseCard course={course} index={i} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div {...fadeInUp} className="text-center mt-10">
            <Link href="/courses">
              <Button variant="default" size="lg">
                تصفح جميع الدورات
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#f8fafc] border-b border-[#e5e7eb]">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Badge variant="blue" className="mb-4">التصنيفات</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
              تصفح حسب التخصص
            </h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              اختر التخصص الذي يناسب اهتماماتك
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => {
              const Icon = categoryIcons[cat.icon] || Flask;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={`/courses?category=${cat.id}`}
                    className="block p-6 rounded-lg bg-white border border-[#e5e7eb] text-center hover:border-[#cbd5e1] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[#eef2ff] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#1e40af]" />
                    </div>
                    <h3 className="text-[#1e293b] font-bold text-sm mb-0.5">{cat.nameAr}</h3>
                    <p className="text-xs text-[#94a3b8]">{cat.count} دورات</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teachers */}
      <section className="bg-white border-b border-[#e5e7eb]">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Badge variant="blue" className="mb-4">المعلمون</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
              تعلم مع أفضل المعلمين
            </h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              نخبة من أساتذة الكيمياء من أفضل الجامعات
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {teachers.map((teacher, i) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-lg bg-[#f8fafc] border border-[#e5e7eb] text-center hover:border-[#cbd5e1] transition-all duration-200"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#1e40af] flex items-center justify-center text-white text-lg font-bold">
                  {teacher.avatar}
                </div>
                <h3 className="text-[#1e293b] font-bold text-sm mb-0.5">{teacher.nameAr}</h3>
                <p className="text-xs text-[#475569]">{teacher.specialty}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#f8fafc] border-b border-[#e5e7eb]">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Badge variant="blue" className="mb-4">إحصائيات</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
              كيمستري في أرقام
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-lg bg-white border border-[#e5e7eb] text-center hover:border-[#cbd5e1] transition-all"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[#eef2ff] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#1e40af]" />
                  </div>
                  <p className="text-2xl font-bold text-[#1e293b] mb-0.5">{stat.value}</p>
                  <p className="text-sm text-[#475569]">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Badge variant="blue" className="mb-4">تجارب الطلاب</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
              ماذا يقول طلابنا
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-lg bg-[#f8fafc] border border-[#e5e7eb] hover:border-[#cbd5e1] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e40af] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.nameAr.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-[#1e293b] text-sm">{t.nameAr}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= t.rating ? 'text-[#d97706] fill-[#d97706]' : 'text-[#e5e7eb]'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#475569] leading-relaxed">{t.textAr}</p>
                    <p className="text-xs text-[#94a3b8] mt-1.5">{t.course}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
