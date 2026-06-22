export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  videoUrl: string;
  duration: string;
  order: number;
  isFree: boolean;
  resources: LessonResource[];
}

export interface LessonResource {
  name: string;
  nameAr: string;
  url: string;
  type: 'pdf' | 'video' | 'quiz';
}

export interface UserProgress {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  watchedSeconds: number;
  lastWatchedAt: string;
}
