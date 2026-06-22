'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  MessageSquare,
  CheckCircle2,
  Circle,
  Clock,
  Star,
  Play,
  User,
  Award,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
import type { Course, Lesson } from '@/types';

interface CourseTabsProps {
  course: Course;
  lessons: Lesson[];
  completedLessons?: string[];
}

const tabs = [
  { id: 'curriculum', label: 'المنهج', icon: BookOpen },
  { id: 'description', label: 'الوصف', icon: FileText },
  { id: 'reviews', label: 'المراجعات', icon: MessageSquare },
];

const mockReviews = [
  { id: '1', name: 'سارة أحمد', avatar: 'س', rating: 5, date: '١٥ مارس ٢٠٢٦', text: 'دورة ممتازة! الشرح واضح والمحتوى منظم جداً. أنصح بها بشدة لكل من يرغب في فهم الكيمياء بشكل عميق.' },
  { id: '2', name: 'محمد علي', avatar: 'م', rating: 4, date: '٢ فبراير ٢٠٢٦', text: 'محتوى قيم ومفيد. الأستاذ متمكن في شرح المفاهيم الصعبة. هناك بعض الدروس التي تحتاج إلى تحديث.' },
  { id: '3', name: 'نورة خالد', avatar: 'ن', rating: 5, date: '٢٠ يناير ٢٠٢٦', text: 'أفضل دورة كيمياء درستها على الإطلاق. التجارب العملية والرسوم التوضيحية ساعدتني كثيراً في الفهم.' },
  { id: '4', name: 'فهد العتيبي', avatar: 'ف', rating: 4, date: '٥ ديسمبر ٢٠٢٥', text: 'دورة شاملة ومتكاملة. الاستفادة كانت كبيرة خاصة في جزء الكيمياء العضوية.' },
];

export default function CourseTabs({ course, lessons, completedLessons = [] }: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState('curriculum');

  return (
    <div dir="rtl">
      <div className="flex border-b border-white/10 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all duration-300 relative',
                isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-200'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {activeTab === 'curriculum' && (
            <div className="space-y-2">
              {lessons.map((lesson, i) => {
                const isCompleted = completedLessons.includes(lesson.id);
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl transition-all duration-300',
                      'border border-white/5 hover:border-cyan-500/20 hover:bg-white/[0.03]',
                      'cursor-pointer group'
                    )}
                  >
                    <div className="relative w-9 h-9 shrink-0">
                      <div className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all',
                        isCompleted
                          ? 'bg-green-500/10 text-green-400'
                          : lesson.isFree
                            ? 'bg-cyan-500/10 text-cyan-400'
                            : 'bg-white/5 text-gray-400'
                      )}>
                        {lesson.order}
                      </div>
                      {isCompleted && (
                        <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-cyan-300 transition-colors">
                        {lesson.titleAr}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{lesson.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {lesson.isFree && (
                        <Badge variant="green" className="text-xs">مجاني</Badge>
                      )}
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                        isCompleted
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-white/5 text-gray-500 opacity-0 group-hover:opacity-100'
                      )}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === 'description' && (
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  وصف الدورة
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {course.descriptionAr}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  المدرب
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {course.teacher.nameAr.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{course.teacher.nameAr}</p>
                    <p className="text-sm text-cyan-400 mb-2">{course.teacher.specialty}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{course.teacher.bioAr}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-cyan-400" />
                  متطلبات الدورة
                </h3>
                <ul className="space-y-2">
                  {['معرفة أساسية بمبادئ الكيمياء', 'دفتر وقلم لتسجيل الملاحظات', 'اتصال مستقر بالإنترنت', 'حماس ورغبة في التعلم'].map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {req}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
              >
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-white">{course.rating.toFixed(1)}</p>
                    <div className="flex items-center gap-0.5 mt-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'w-4 h-4',
                            star <= Math.round(course.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-600'
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{mockReviews.length} تقييم</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = mockReviews.filter((r) => r.rating === star).length;
                      const percentage = (count / mockReviews.length) * 100;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="text-gray-400 w-4">{star}</span>
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-gray-500 w-6 text-left">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              <div className="space-y-3">
                {mockReviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-white text-sm">{review.name}</p>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'w-3.5 h-3.5',
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-600'
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">{review.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
