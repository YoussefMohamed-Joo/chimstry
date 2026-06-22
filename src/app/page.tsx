'use client';

import Link from 'next/link';
import { motion, type Easing } from 'framer-motion';
import { ArrowLeft, Star, Users, BookOpen, GraduationCap, Atom, FlaskRound as Flask, Microscope, Zap, Dna, ChevronLeft, Mail } from 'lucide-react';
import HeroSection from '@/components/features/HeroSection';
import CourseCard from '@/components/features/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useFeaturedCourses } from '@/hooks/useCourses';
import { CourseCardSkeleton } from '@/components/ui/skeleton';
import type { Category, Testimonial } from '@/types';
import categoriesData from '@/data/categories.json';
import testimonialsData from '@/data/testimonials.json';
const testimonials = testimonialsData as unknown as Testimonial[];

const categories = categoriesData as unknown as Category[];

const ease: Easing = [0.25, 0.1, 0.25, 1];

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1, duration: 0.5 },
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

      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="cyan" className="mb-4">دورات مميزة</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            أشهر <span className="gradient-text">الدورات التعليمية</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            اختر من بين مجموعتنا المختارة من أفضل دورات الكيمياء
          </p>
        </motion.div>

        {featuredLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div {...stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured?.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <CourseCard course={course} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div {...fadeInUp} className="text-center mt-10">
          <Link href="/courses">
            <Button variant="primary" size="lg" className="group">
              تصفح جميع الدورات
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="cyan" className="mb-4">التصنيفات</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            تصفح حسب <span className="gradient-text">التخصص</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            اختر التخصص الذي يناسب اهتماماتك
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => {
            const Icon = categoryIcons[cat.icon] || Flask;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link
                  href={`/courses?category=${cat.id}`}
                  className="group block p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.06] transition-all duration-300 text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-white font-bold mb-1">{cat.nameAr}</h3>
                  <p className="text-sm text-gray-500">{cat.count} دورات</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="cyan" className="mb-4">المعلمون</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            تعلم مع <span className="gradient-text">أفضل المعلمين</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            نخبة من أساتذة الكيمياء من أفضل الجامعات
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {teachers.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 text-center group hover:border-cyan-500/20 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                {teacher.avatar}
              </div>
              <h3 className="text-white font-bold mb-1">{teacher.nameAr}</h3>
              <p className="text-sm text-cyan-400">{teacher.specialty}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="cyan" className="mb-4">إحصائيات</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            كيمستري في <span className="gradient-text">أرقام</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 text-center group hover:border-cyan-500/20 transition-all"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all">
                  <Icon className="w-7 h-7 text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="cyan" className="mb-4">تجارب الطلاب</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ماذا يقول <span className="gradient-text">طلابنا</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-cyan-500/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                  {t.nameAr.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-white">{t.nameAr}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{t.textAr}</p>
                  <p className="text-xs text-cyan-400/60 mt-2">{t.course}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-8 md:p-16 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-[#0B1E3D] border border-white/10 text-center"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ابدأ رحلة التعلم <span className="gradient-text">اليوم</span>
            </h2>
            <p className="text-gray-300 mb-8">
              اشترك في النشرة البريدية واحصل على أحدث الدورات والعروض الحصرية
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="أدخل بريدك الإلكتروني"
                  className="pr-10 h-12 bg-white/5 border-white/10 rounded-xl"
                />
              </div>
              <Button variant="primary" size="lg" className="shrink-0">
                اشتراك
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
