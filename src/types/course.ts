export interface Course {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  thumbnail: string;
  category: string;
  categoryAr: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  levelAr: string;
  teacher: Teacher;
  duration: string;
  lessonsCount: number;
  studentsCount: number;
  rating: number;
  price: number;
  tags: string[];
}

export interface Teacher {
  id: string;
  name: string;
  nameAr: string;
  avatar: string;
  bio: string;
  bioAr: string;
  specialty: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  count: number;
}

export interface Testimonial {
  id: string;
  name: string;
  nameAr: string;
  avatar: string;
  text: string;
  textAr: string;
  rating: number;
  course: string;
}
